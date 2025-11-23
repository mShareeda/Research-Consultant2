
import { GoogleGenAI, Type } from "@google/genai";
import { AcademicLevel, Theory, Report, ComparisonResult, Language } from "../types";

// Initialize the Google GenAI client
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API Key is missing. Please check your vite.config.ts and environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Centralized error handler to convert technical errors into user-friendly messages.
 */
const handleError = (error: any, context: string, lang: Language): never => {
  console.error(`Error in ${context}:`, error);

  const msg = (error?.message || "").toString();

  const messages = {
    ar: {
        apiKey: "مفتاح الربط (API Key) مفقود أو غير صحيح. يرجى التحقق من الإعدادات.",
        quota: "عذراً، تم تجاوز حد الاستخدام المسموح به حالياً. يرجى الانتظار قليلاً ثم المحاولة.",
        server: "الخادم مشغول حالياً بسبب ضغط الطلبات. يرجى المحاولة بعد دقيقة.",
        safety: "تم حظر إنشاء المحتوى بسبب معايير السلامة. يرجى محاولة تعديل صياغة العنوان البحثي ليكون أكثر أكاديمية.",
        json: "حدث خطأ في معالجة البيانات الواردة من النظام الذكي. يرجى المحاولة مرة أخرى.",
        network: "فشل الاتصال بالإنترنت. يرجى التحقق من الشبكة.",
        generic: "حدث خطأ غير متوقع أثناء المعالجة. يرجى المحاولة لاحقاً."
    },
    en: {
        apiKey: "API Key is missing or invalid. Please check settings.",
        quota: "Usage limit exceeded. Please wait a moment and try again.",
        server: "Server is overloaded. Please try again in a minute.",
        safety: "Content generation blocked by safety filters. Please refine your research title to be more academic.",
        json: "Error processing data from the AI system. Please try again.",
        network: "Network connection failed. Please check your internet.",
        generic: "An unexpected error occurred. Please try again later."
    }
  };

  const t = messages[lang];

  if (msg.includes("API key") || !apiKey) throw new Error(t.apiKey);
  if (msg.includes("429") || msg.includes("quota") || msg.includes("resource")) throw new Error(t.quota);
  if (msg.includes("503") || msg.includes("overloaded")) throw new Error(t.server);
  if (msg.includes("SAFETY") || msg.includes("blocked") || msg.includes("candidate")) throw new Error(t.safety);
  if (msg.includes("JSON") || msg.includes("SyntaxError") || msg.includes("parse")) throw new Error(t.json);
  if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed")) throw new Error(t.network);

  throw new Error(t.generic);
};

export const getTheorySuggestions = async (
  title: string,
  level: AcademicLevel,
  foundation: string,
  lang: Language,
  existingTheories: string[] = []
): Promise<Theory[]> => {
  try {
    if (!apiKey) throw new Error("API key is missing");

    console.log("Fetching theories for:", title, "Level:", level, "Foundation:", foundation, "Lang:", lang);
    
    // Instructions based on Language
    const langInstruction = lang === 'ar' 
        ? "اللغة: عربية فصحى فقط (بدون مصطلحات إنجليزية في الأسماء)."
        : "Language: English Only. The Output must be in English.";

    let depthInstruction = "";
    if (lang === 'ar') {
        if (level === AcademicLevel.Bachelor) depthInstruction = "مستوى البكالوريوس: ركز على 'النظريات الكلاسيكية والتأسيسية'.";
        else if (level === AcademicLevel.Master) depthInstruction = "مستوى الماجستير: ركز على 'النظريات التحليلية والوسيطة'.";
        else if (level === AcademicLevel.PhD) depthInstruction = "مستوى الدكتوراة: ركز على 'الأطر النظرية الفلسفية والنماذج الكلية'.";
    } else {
        if (level === AcademicLevel.Bachelor) depthInstruction = "Bachelor Level: Focus on Classical & Foundational Theories.";
        else if (level === AcademicLevel.Master) depthInstruction = "Master Level: Focus on Analytical & Mediating Theories.";
        else if (level === AcademicLevel.PhD) depthInstruction = "PhD Level: Focus on Meta-Theories & Comprehensive Frameworks.";
    }

    const exclusionInstruction = existingTheories.length > 0 
      ? (lang === 'ar' ? `استبعد هذه النظريات: (${existingTheories.join("، ")})` : `Exclude these theories: (${existingTheories.join(", ")})`)
      : "";

    const prompt = `
      Role: Expert Research Methodologist.
      Task: Analyze title, identify causal mechanism, and suggest 3 distinct scientific theories.

      Data:
      Title: "${title}"
      Level: "${level}"
      Field: "${foundation}"
      Target Language: ${lang === 'ar' ? 'Arabic' : 'English'}
      
      Instructions:
      1. Theories must be from the "${foundation}" discipline.
      2. ${depthInstruction}
      3. ${exclusionInstruction}
      4. Avoid generic theories unless absolutely foundational.

      Output constraints:
      - ${langInstruction}
      - Include founder/originator and year in the justification/match_reason.
      - Explain WHY it fits the variables.

      Format (JSON Array): [{ name, match_reason }]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              match_reason: { type: Type.STRING },
            },
            required: ["name", "match_reason"],
          },
        },
      },
    });

    if (!response.text) {
        throw new Error("Empty response received from AI model.");
    }

    const jsonText = response.text;
    return JSON.parse(jsonText) as Theory[];

  } catch (error) {
    return handleError(error, "getTheorySuggestions", lang);
  }
};

export const compareTheories = async (
    title: string,
    theories: Theory[],
    lang: Language
): Promise<ComparisonResult> => {
    try {
        if (!apiKey) throw new Error("API key is missing");

        const theoryNames = theories.map(t => t.name).join(lang === 'ar' ? "، " : ", ");
        const langInstruction = lang === 'ar' ? "Output in Arabic Only" : "Output in English Only";

        const prompt = `
            Role: Research Methodologist.
            Task: Critical comparison of theories for title: "${title}".
            Theories: (${theoryNames})
            Target Language: ${lang === 'ar' ? 'Arabic' : 'English'}

            Requirements (${langInstruction}):
            1. Common ground/Similiarities.
            2. Key differences.
            3. Analysis (Pros/Cons for this specific title).
            4. Final Recommendation.

            Format (JSON):
            {
              common_ground: string,
              key_differences: string,
              analysis: [{ theory_name, pros, cons }],
              recommendation: string
            }
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        common_ground: { type: Type.STRING },
                        key_differences: { type: Type.STRING },
                        analysis: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    theory_name: { type: Type.STRING },
                                    pros: { type: Type.STRING },
                                    cons: { type: Type.STRING }
                                }
                            }
                        },
                        recommendation: { type: Type.STRING }
                    }
                }
            }
        });

        if (!response.text) throw new Error("Empty response from comparison.");
        return JSON.parse(response.text) as ComparisonResult;

    } catch (error) {
        return handleError(error, "compareTheories", lang);
    }
}

export const getFinalReport = async (
  title: string,
  level: AcademicLevel,
  theory: Theory,
  lang: Language
): Promise<Report> => {
  try {
    if (!apiKey) throw new Error("API key is missing");
    console.log("Generating report for:", theory.name, "Lang:", lang);

    const langInstruction = lang === 'ar' ? "Output in Arabic Only" : "Output in English Only";

    const prompt = `
      Role: Research Scientific Methodologist.
      Input: Title "${title}", Theory "${theory.name}", Level "${level}".
      Target Language: ${lang === 'ar' ? 'Arabic' : 'English'}

      Requirements (JSON ${langInstruction}):
      1. theory_integration: Two paragraphs separated by (\\n\\n). First: Theory History/Founder. Second: Alignment to Study.
      2. independent_variable: The Independent Variable.
      3. dependent_variable: The Dependent Variable.
      4. theory_hypotheses: 3 Core Axioms/Hypotheses of the original theory.
      5. study_hypotheses: 4 Specific hypotheses for this study derived from the theory.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theory_integration: { type: Type.STRING },
            independent_variable: { type: Type.STRING },
            dependent_variable: { type: Type.STRING },
            theory_hypotheses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            study_hypotheses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["theory_integration", "independent_variable", "dependent_variable", "theory_hypotheses", "study_hypotheses"],
        },
      },
    });

    if (!response.text) {
         throw new Error("Empty response for final report.");
    }

    return JSON.parse(response.text) as Report;
  } catch (error) {
    return handleError(error, "getFinalReport", lang);
  }
};
