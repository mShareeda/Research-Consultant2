
import React from "react";
import { Report, Theory, AcademicLevel } from "../types";
import { RefreshCw, FileText, Layers, Calendar, Lightbulb, GraduationCap, AlertTriangle, Download } from "lucide-react";

interface StepReportProps {
  report: Report;
  theory: Theory;
  title: string;
  level: AcademicLevel;
  onReset: () => void;
}

const StepReport: React.FC<StepReportProps> = ({ report, theory, title, level, onReset }) => {

  const handleExportWord = () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    // Get the HTML content
    const content = element.innerHTML;

    // Construct a Word-friendly HTML document
    // We add specific Office namespaces and RTL direction
    const preHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl' lang='ar'>
        <head>
            <meta charset='utf-8'>
            <title>تقرير المواءمة النظرية</title>
            <style>
                body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; }
                h1, h2, h3, h4 { font-family: 'Arial', sans-serif; }
                .no-export { display: none; }
            </style>
        </head>
        <body>
    `;
    const postHtml = "</body></html>";
    const html = preHtml + content + postHtml;

    // Create a Blob with Word MIME type
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    // Create download link
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${new Date().getTime()}.doc`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-700 pb-10">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/50 z-30 relative">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-200">
                <FileText className="w-5 h-5"/>
            </div>
            التقرير النهائي للمواءمة
        </h2>
        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
          
          <button
            onClick={handleExportWord}
            className="flex-1 md:flex-none justify-center px-4 py-3 text-slate-600 hover:bg-white hover:text-blue-600 border border-transparent hover:border-blue-200 hover:shadow-sm rounded-xl flex items-center gap-2 transition-all text-sm font-bold"
          >
            <Download className="w-4 h-4" />
            تصدير Word
          </button>

          <div className="w-px h-6 bg-slate-200 hidden md:block mx-1"></div>

          <button
            onClick={onReset}
            className="flex-1 md:flex-none justify-center px-6 py-3 bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 rounded-xl flex items-center gap-2 transition-all text-sm font-bold shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            بحث جديد
          </button>
        </div>
      </div>

      {/* Content Container - Natural Flow */}
      <div className="rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 bg-white relative">
         {/* Internal content wrapper for padding */}
         <div id="report-content" className="p-8 md:p-16 relative bg-white">
            
            {/* Top accent - Hidden in Word export via inline styles if needed, but useful for visuals */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600"></div>
            
            {/* Report Header */}
            <div className="relative z-10 mb-12 border-b-2 border-slate-100 pb-10" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex justify-between items-start mb-6">
                   <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-black bg-slate-900 text-white shadow-lg shadow-slate-200">
                      {level}
                   </span>
                   <div className="flex items-center gap-2 text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1 rounded-lg">
                     <Calendar className="w-4 h-4" />
                     <span>{new Date().toLocaleDateString('ar-BH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                   </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6">
                    {title}
                </h1>
                <div className="inline-flex items-center gap-3 bg-indigo-50 px-5 py-3 rounded-xl border border-indigo-100">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <span className="text-slate-700 font-bold">النظرية المعتمدة:</span>
                    <span className="text-indigo-700 font-black text-lg">{theory.name}</span>
                </div>
            </div>

            {/* Justification */}
            <div className="relative z-10 mb-14" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-2xl font-black text-slate-900">مبررات المواءمة النظرية</h3>
                </div>
                <div className="text-slate-700 leading-9 text-lg text-justify font-medium bg-slate-50/50 p-8 rounded-2xl border border-slate-100/80">
                    {report.theory_integration.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={index > 0 ? "mt-8 pt-8 border-t border-slate-200/60" : ""}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            {/* Variables */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-14" style={{ pageBreakInside: 'avoid' }}>
                <div className="bg-emerald-50/80 border border-emerald-100 rounded-3xl p-8 relative overflow-hidden group">
                    <h4 className="text-emerald-800 font-extrabold mb-4 text-sm uppercase tracking-wider relative z-10">المتغير المستقل</h4>
                    <p className="text-emerald-950 font-bold text-xl leading-relaxed relative z-10">{report.independent_variable}</p>
                </div>
                <div className="bg-rose-50/80 border border-rose-100 rounded-3xl p-8 relative overflow-hidden group">
                    <h4 className="text-rose-800 font-extrabold mb-4 text-sm uppercase tracking-wider relative z-10">المتغير التابع</h4>
                    <p className="text-rose-950 font-bold text-xl leading-relaxed relative z-10">{report.dependent_variable}</p>
                </div>
            </div>

            {/* Hypotheses Section */}
            <div className="relative z-10 space-y-10">
                
                {/* Theory Hypotheses */}
                <div style={{ pageBreakInside: 'avoid' }}>
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-amber-500" />
                            <h3 className="text-2xl font-black text-slate-900">الفرضيات الأساسية للنظرية</h3>
                        </div>
                    </div>
                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
                        <ul className="space-y-4">
                            {report.theory_hypotheses.map((hypothesis, idx) => (
                                <li key={idx} className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-amber-400"></div>
                                    <p className="text-slate-700 font-bold text-lg leading-relaxed">
                                        {hypothesis}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Study Hypotheses */}
                <div style={{ pageBreakInside: 'avoid' }}>
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                         <div className="flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-indigo-500" />
                            <h3 className="text-2xl font-black text-slate-900">فرضيات الدراسة المقترحة</h3>
                         </div>
                    </div>
                    <ul className="space-y-4">
                        {report.study_hypotheses.map((hypothesis, idx) => (
                            <li key={idx} className="flex gap-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm items-start">
                                <span className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white font-black rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 text-lg">
                                    {idx + 1}
                                </span>
                                <p className="text-slate-700 font-bold text-lg leading-relaxed pt-1">
                                    {hypothesis}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Footer for Report with Disclaimer */}
            <div className="mt-16 pt-8 border-t-2 border-slate-50 text-center relative z-10" style={{ pageBreakInside: 'avoid' }}>
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-2 text-amber-600 font-black text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>تنويه وإخلاء مسؤولية</span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        تم إنشاء هذا التقرير تلقائياً بواسطة نظام المواءمة النظرية الذكي عن طريق الذكاء الإصطناعي. 
                        قد يحتوي التقرير على أخطاء أو معلومات غير دقيقة، لذا يجب على المستخدم مراجعة المعلومات 
                        والتحقق من صحتها والتفاصيل الواردة واستخدامها على مسؤوليته الشخصية.
                    </p>
                 </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default StepReport;
