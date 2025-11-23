
import { GoogleGenAI, Type } from "@google/genai";
import { AcademicLevel, Theory, Report, ComparisonResult } from "../types";

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
  level: AcademicLevel,
  foundation: string,
  existingTheories: string[] = []
): Promise<Theory[]> => {
  try {
    console.log("Fetching theories for:", title, "Level:", level, "Foundation:", foundation);
    
    // Define level-specific depth instructions with higher academic rigor
    let depthInstruction = "";
    if (level === AcademicLevel.Bachelor) {
      depthInstruction = "مستوى البكالوريوس: ركز على 'النظريات الكلاسيكية والتأسيسية' (Classical & Foundational Theories) التي تكون مباشرة وواضحة وتفسر العلاقة بين المتغيرات بشكل أساسي ومباشر دون تعقيد فلسفي.";
    } else if (level === AcademicLevel.Master) {
      depthInstruction = "مستوى الماجستير: ركز على 'النظريات التحليلية والوسيطة' (Analytical & Mediating Theories) التي تسمح باختبار العلاقات المعقدة وتفسر العمليات الوسيطة (Process-oriented) وتناسب الدراسات الوصفية والتحليلية.";
    } else if (level === AcademicLevel.PhD) {
      depthInstruction = "مستوى الدكتوراة: ركز على 'الأطر النظرية الفلسفية والنماذج الكلية' (Meta-Theories & Comprehensive Frameworks) التي تتسم بالأصالة والعمق، وتسمح ببناء نموذج مفاهيمي يضيف معرفة جديدة (Original Contribution) وليس مجرد تطبيق.";
    }

    const exclusionInstruction = existingTheories.length > 0 
      ? `تنبيه هام جداً: المستخدم طلب المزيد من النظريات. يجب عليك **استبعاد** النظريات التالية نهائياً وعدم تكرارها: (${existingTheories.join("، ")}). ابحث عن بدائل علمية رصينة ومختلفة تخدم نفس العنوان.` 
      : "";

    const prompt = `
      الدور: أنت بروفيسور متخصص في "بناء الأطر النظرية" ومناهج البحث العلمي المتقدمة.
      المهمة: قم بتحليل دقيق جداً لعنوان الدراسة المقدم أدناه، واستنتج "الآلية السببية" (Causal Mechanism) التي تربط المتغيرات، ثم اقترح أفضل 3 نظريات علمية تنتمي للمجال التأسيسي المحدد.

      بيانات الإدخال:
      العنوان: "${title}"
      المستوى الأكاديمي: "${level}"
      المجال التأسيسي (Discipline Base): "${foundation}"
      
      تعليمات جوهرية للمجال التأسيسي:
      لقد حدد الباحث أن دراسته تنبني على أساس "${foundation}".
      لذا يجب أن تكون النظريات المقترحة **مشتقة أساساً من أدبيات هذا المجال** أو معتمدة بشكل واسع فيه.
      (مثلاً: إذا اختار "إعلامي"، ابحث عن نظريات الاتصال الجماهيري وتأثيرات الإعلام وليس نظريات علم النفس السريري، إلا إذا كان هناك تداخل قوي).

      تعليمات مستوى العمق:
      ${depthInstruction}

      ${exclusionInstruction}

      خطوات التحليل المطلوبة منك (Deep Analysis):
      1. تأكد من أن النظريات تخدم المجال "${foundation}" بشكل مباشر.
      2. حدد المتغير المستقل (السبب) والمتغير التابع (النتيجة) والسياق.
      3. ابحث عن النظريات التي صممت خصيصاً لتفسر انتقال الأثر من [المتغير المستقل] إلى [المتغير التابع] ضمن سياق ${foundation}.
      4. تجنب النظريات العامة (مثل Maslow أو SWOT) إلا إذا كانت هي الأساس الوحيد في الأدبيات لهذا الموضوع.

      شروط المخرجات الصارمة:
      1. اللغة: العربية الفصحى الأكاديمية الرصينة فقط.
      2. ممنوع استخدام أحرف إنجليزية نهائياً في الأسماء (مثلاً: لا تكتب TAM، اكتب نموذج قبول التكنولوجيا).
      3. التوثيق الإلزامي في (match_reason): يجب ذكر "اسم المؤسس/المنظر الأصلي" و"سنة الطرح" للنظرية.
      4. صياغة (match_reason): اشرح "لماذا" هذه النظرية تحديداً تصلح لهذا العنوان في ضوء المجال ${foundation}.

      تنسيق الاستجابة (JSON):
      مصفوفة تحتوي على كائنات:
      - name: اسم النظرية (عربي فقط).
      - match_reason: الفقرة التبريرية (شاملة المؤسس والسنة والربط العميق بالمشكلة والمجال).
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

export const compareTheories = async (
    title: string,
    theories: Theory[]
): Promise<ComparisonResult> => {
    try {
        const theoryNames = theories.map(t => t.name).join("، ");
        const prompt = `
            الدور: خبير استراتيجي في البحث العلمي ومناهج الدراسات العليا.
            المدخلات:
            1. عنوان الدراسة (المرجع الأساسي للمقارنة): "${title}"
            2. النظريات المراد مقارنتها: (${theoryNames})

            المهمة: إجراء مقارنة نقدية دقيقة لتحديد أي النظريات تخدم العنوان أعلاه بشكل أفضل.

            تحذير هام: يجب أن تستند التوصية والمقارنة بالكامل على مدى ملاءمة النظرية لمتغيرات وسياق العنوان المذكور ("${title}"). لا تقدم مقارنة عامة، بل مقارنة تطبيقية على هذه الدراسة.

            المتطلبات:
            1. اللغة العربية الفصحى فقط.
            2. حدد "القواسم المشتركة" (كيف تتفق النظريات في تفسير الظاهرة الموجودة في العنوان).
            3. حدد "نقاط الاختلاف الجوهرية" (كيف تختلف في زاوية النظر للمتغيرات).
            4. لكل نظرية، اذكر "نقاط القوة" (لماذا تصلح لهذا العنوان) و"نقاط الضعف/التحديات" (ما الذي قد تغفله في سياق هذا العنوان).
            5. قدم توصية ختامية بالنظرية الأرجح، مع ذكر السبب المرتبط بطبيعة العنوان.

            نسق المخرجات (JSON):
            - common_ground: نص الفقرة.
            - key_differences: نص الفقرة.
            - analysis: مصفوفة كائنات، لكل نظرية { theory_name, pros, cons }.
            - recommendation: نص التوصية (يجب أن يشير للعنوان صراحة).
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

        if (!response.text) throw new Error("Empty comparison response");
        return JSON.parse(response.text) as ComparisonResult;

    } catch (error) {
        console.error("Error comparing theories:", error);
        throw error;
    }
}

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
      5. "theory_hypotheses": اذكر 3 فرضيات/مسلمات أساسية للنظرية نفسها (بشكل عام وتجريدي، كما وضعها المؤسس).
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
