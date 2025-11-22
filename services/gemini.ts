
import { GoogleGenAI, Type } from "@google/genai";
import { AcademicLevel, Theory, Report } from "../types";

// Initialize the Google GenAI client
// The API key is injected via vite.config.ts from process.env.API_KEY
// We assume process.env.API_KEY is available. If running locally without it, this will throw.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API Key is missing. Please check your vite.config.ts and environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const MODEL_NAME = "gemini-2.5-flash";

export const getTheorySuggestions = async (
  title: string,
  level: AcademicLevel
): Promise<Theory[]> => {
  try {
    console.log("Fetching theories for:", title, "Level:", level);
    
    // Define level-specific depth instructions with higher academic rigor
    let depthInstruction = "";
    if (level === AcademicLevel.Bachelor) {
      depthInstruction = "مستوى البكالوريوس: ركز على 'النظريات الكلاسيكية والتأسيسية' (Classical & Foundational Theories) التي تكون مباشرة وواضحة وتفسر العلاقة بين المتغيرات بشكل أساسي ومباشر دون تعقيد فلسفي.";
    } else if (level === AcademicLevel.Master) {
      depthInstruction = "مستوى الماجستير: ركز على 'النظريات التحليلية والوسيطة' (Analytical & Mediating Theories) التي تسمح باختبار العلاقات المعقدة وتفسر العمليات الوسيطة (Process-oriented) وتناسب الدراسات الوصفية والتحليلية.";
    } else if (level === AcademicLevel.PhD) {
      depthInstruction = "مستوى الدكتوراة: ركز على 'الأطر النظرية الفلسفية والنماذج الكلية' (Meta-Theories & Comprehensive Frameworks) التي تتسم بالأصالة والعمق، وتسمح ببناء نموذج مفاهيمي يضيف معرفة جديدة (Original Contribution) وليس مجرد تطبيق.";
    }

    const prompt = `
      الدور: أنت بروفيسور متخصص في "بناء الأطر النظرية" ومناهج البحث العلمي المتقدمة.
      المهمة: تحليل العنوان البحثي المقدم بدقة متناهية لاقتراح أفضل 3 نظريات علمية رصينة تفسر "المشكلة البحثية".

      بيانات الإدخال:
      العنوان: "${title}"
      المستوى الأكاديمي: "${level}"
      
      تعليمات مستوى العمق:
      ${depthInstruction}

      خطوات التحليل المطلوبة منك (Chain of Thought):
      1. قم بتفكيك العنوان وتحديد "المتغير المستقل" و"المتغير التابع" بدقة.
      2. حدد "التخصص الدقيق" (مثلاً: علم النفس التنظيمي، تكنولوجيا التعليم، التسويق الرقمي، إلخ).
      3. ابحث في ذاكرتك عن النظريات "الأم" (Seminal Theories) في هذا التخصص التي تشرح "لماذا" يؤثر المتغير المستقل في التابع.
      4. استبعد النظريات العامة جداً (مثل SWOT أو PESTLE) إلا إذا كانت جوهرية، واستبعد النماذج السطحية.

      شروط المخرجات الصارمة:
      1. اللغة: العربية الفصحى الأكاديمية الرصينة فقط.
      2. ممنوع استخدام أحرف إنجليزية نهائياً (مثلاً: لا تكتب TAM، اكتب نموذج قبول التكنولوجيا).
      3. التوثيق الإلزامي في (match_reason): يجب ذكر "اسم المؤسس/المنظر" و"سنة الطرح" لكل نظرية.
      4. صياغة (match_reason): يجب أن تكون فقرة "منمقة ومقنعة" تشرح كيف تعالج النظرية مشكلة الدراسة تحديداً. استخدم عبارات مثل: "تعتبر هذه النظرية الأنسب لأنها تفسر الآلية التي من خلالها يؤثر..."

      تنسيق الاستجابة (JSON):
      مصفوفة تحتوي على كائنات:
      - name: اسم النظرية (عربي فقط).
      - match_reason: الفقرة التبريرية (شاملة المؤسس والسنة والربط بالمشكلة).
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
        console.warn("Gemini response was empty or blocked.");
        throw new Error("لم يتمكن النظام من توليد استجابة. قد يكون السبب قيود المحتوى أو ضعف الاتصال.");
    }

    const jsonText = response.text;
    console.log("Gemini Response:", jsonText);
    return JSON.parse(jsonText) as Theory[];
  } catch (error) {
    console.error("Error fetching theory suggestions:", error);
    throw error;
  }
};

export const getFinalReport = async (
  title: string,
  level: AcademicLevel,
  theory: Theory
): Promise<Report> => {
  try {
    console.log("Generating report for:", theory.name);

    const prompt = `
      الدور: خبير مناهج بحث علمي أكاديمي صارم.
      السياق: دراسة بعنوان "${title}".
      النظرية المعتمدة: "${theory.name}".
      المستوى الأكاديمي: "${level}".

      المهمة: إعداد تقرير مواءمة نظرية شامل ودقيق.

      القيود الصارمة:
      1. اللغة: العربية فقط (يمنع استخدام أي أحرف إنجليزية أو اختصارات لاتينية).
      2. "theory_integration" (مبررات المواءمة): يجب أن تتكون من فقرتين منفصلتين تماماً بينهما سطرين فارغين (\\n\\n):
         - الفقرة الأولى: خلفية تاريخية عميقة عن النظرية، مع ذكر "اسم المؤسس" و"سنة التأسيس" وفلسفتها الجوهرية.
         - الفقرة الثانية: مواءمة تطبيقية دقيقة، تشرح كيف سيتم "تطويع" مفاهيم النظرية لقياس متغيرات هذا العنوان تحديداً.
      3. "independent_variable": استخرج المتغير المستقل من العنوان بدقة.
      4. "dependent_variable": استخرج المتغير التابع من العنوان بدقة.
      5. "theory_hypotheses": اذكر 3 فرضيات/مسلمات أساسية للنظرية نفسها (بشكل عام وتجريدي).
      6. "study_hypotheses": قم بصياغة 4 فرضيات بحثية للدراسة الحالية، بحيث تعكس مصطلحات النظرية (مثلاً: إذا كانت النظرية TAM، استخدم مصطلحات "سهولة الاستخدام المدركة" في الفرضية).

      تنسيق الاستجابة (JSON) المطابق للمخطط.
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
         throw new Error("No content generated for report.");
    }

    const jsonText = response.text;
    return JSON.parse(jsonText) as Report;
  } catch (error) {
    console.error("Error fetching final report:", error);
    throw error;
  }
};
