
import { GoogleGenAI, Type } from "@google/genai";
import { AcademicLevel, Theory, Report, ComparisonResult } from "../types";

// Initialize the Google GenAI client
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API Key is missing. Please check your vite.config.ts and environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Centralized error handler to convert technical errors into user-friendly Arabic messages.
 */
const handleError = (error: any, context: string): never => {
  console.error(`Error in ${context}:`, error);

  const msg = (error?.message || "").toString();

  // Check for specific error patterns
  if (msg.includes("API key") || !apiKey) {
    throw new Error("مفتاح الربط (API Key) مفقود أو غير صحيح. يرجى التحقق من الإعدادات.");
  }

  if (msg.includes("429") || msg.includes("quota") || msg.includes("resource")) {
    throw new Error("عذراً، تم تجاوز حد الاستخدام المسموح به حالياً. يرجى الانتظار قليلاً ثم المحاولة.");
  }

  if (msg.includes("503") || msg.includes("overloaded")) {
    throw new Error("الخادم مشغول حالياً بسبب ضغط الطلبات. يرجى المحاولة بعد دقيقة.");
  }

  if (msg.includes("SAFETY") || msg.includes("blocked") || msg.includes("candidate")) {
    throw new Error("تم حظر إنشاء المحتوى بسبب معايير السلامة. يرجى محاولة تعديل صياغة العنوان البحثي ليكون أكثر أكاديمية.");
  }

  if (msg.includes("JSON") || msg.includes("SyntaxError") || msg.includes("parse")) {
    throw new Error("حدث خطأ في معالجة البيانات الواردة من النظام الذكي. يرجى المحاولة مرة أخرى.");
  }

  if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed")) {
    throw new Error("فشل الاتصال بالإنترنت. يرجى التحقق من الشبكة.");
  }

  // Default generic error
  throw new Error("حدث خطأ غير متوقع أثناء المعالجة. يرجى المحاولة لاحقاً.");
};

export const getTheorySuggestions = async (
  title: string,
  level: AcademicLevel,
  foundation: string,
  existingTheories: string[] = []
): Promise<Theory[]> => {
  try {
    if (!apiKey) throw new Error("API key is missing");

    console.log("Fetching theories for:", title, "Level:", level, "Foundation:", foundation);
    
    let depthInstruction = "";
    if (level === AcademicLevel.Bachelor) {
      depthInstruction = "مستوى البكالوريوس: ركز على 'النظريات الكلاسيكية والتأسيسية' (Classical & Foundational Theories) التي تكون مباشرة وواضحة وتفسر العلاقة بين المتغيرات بشكل أساسي ومباشر.";
    } else if (level === AcademicLevel.Master) {
      depthInstruction = "مستوى الماجستير: ركز على 'النظريات التحليلية والوسيطة' (Analytical & Mediating Theories) التي تسمح باختبار العلاقات المعقدة وتفسر العمليات الوسيطة.";
    } else if (level === AcademicLevel.PhD) {
      depthInstruction = "مستوى الدكتوراة: ركز على 'الأطر النظرية الفلسفية والنماذج الكلية' (Meta-Theories & Comprehensive Frameworks) التي تتسم بالأصالة والعمق.";
    }

    const exclusionInstruction = existingTheories.length > 0 
      ? `تنبيه هام: المستخدم طلب المزيد. استبعد هذه النظريات تماماً: (${existingTheories.join("، ")}).` 
      : "";

    const prompt = `
      الدور: أنت بروفيسور متخصص في "بناء الأطر النظرية".
      المهمة: تحليل عنوان الدراسة واستنتاج "الآلية السببية" واقتراح 3 نظريات علمية دقيقة.

      البيانات:
      العنوان: "${title}"
      المستوى: "${level}"
      المجال: "${foundation}"
      
      التعليمات:
      1. النظريات يجب أن تكون من صلب أدبيات المجال "${foundation}".
      2. ${depthInstruction}
      3. ${exclusionInstruction}
      4. تجنب النظريات العامة جداً إلا إذا كانت هي الأساس الوحيد.

      شروط المخرجات:
      - اللغة: عربية فصحى فقط (بدون مصطلحات إنجليزية في الأسماء).
      - التوثيق: ذكر المؤسس والسنة في التبرير.
      - التبرير: شرح سبب الملاءمة للمتغيرات.

      التنسيق (JSON Array): [{ name, match_reason }]
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
    return handleError(error, "getTheorySuggestions");
  }
};

export const compareTheories = async (
    title: string,
    theories: Theory[]
): Promise<ComparisonResult> => {
    try {
        if (!apiKey) throw new Error("API key is missing");

        const theoryNames = theories.map(t => t.name).join("، ");
        const prompt = `
            الدور: خبير مناهج بحث.
            المهمة: مقارنة نقدية بين النظريات التالية لخدمة العنوان: "${title}".
            النظريات: (${theoryNames})

            المطلوب (عربي فقط):
            1. نقاط الاتفاق.
            2. نقاط الاختلاف الجوهرية.
            3. تحليل كل نظرية (نقاط قوة وضعف بالنسبة للعنوان).
            4. توصية ختامية.

            التنسيق (JSON):
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
        return handleError(error, "compareTheories");
    }
}

export const getFinalReport = async (
  title: string,
  level: AcademicLevel,
  theory: Theory
): Promise<Report> => {
  try {
    if (!apiKey) throw new Error("API key is missing");
    console.log("Generating report for:", theory.name);

    const prompt = `
      الدور: خبير مناهج بحث علمي.
      المدخلات: العنوان "${title}"، النظرية "${theory.name}"، المستوى "${level}".

      المطلوب (تقرير JSON عربي):
      1. theory_integration: فقرتان منفصلتان بـ (\\n\\n). الأولى عن تاريخ ومؤسس النظرية. الثانية عن مواءمتها للدراسة.
      2. independent_variable: المتغير المستقل.
      3. dependent_variable: المتغير التابع.
      4. theory_hypotheses: 3 فرضيات للنظرية الأم.
      5. study_hypotheses: 4 فرضيات للدراسة الحالية.
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
    return handleError(error, "getFinalReport");
  }
};
