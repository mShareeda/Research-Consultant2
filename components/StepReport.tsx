
import React from "react";
import { Report, Theory, AcademicLevel } from "../types";
import { RefreshCw, FileText, Layers, Download, Calendar, Lightbulb, GraduationCap } from "lucide-react";

interface StepReportProps {
  report: Report;
  theory: Theory;
  title: string;
  level: AcademicLevel;
  onReset: () => void;
}

declare global {
  interface Window {
    html2pdf: any;
  }
}

const StepReport: React.FC<StepReportProps> = ({ report, theory, title, level, onReset }) => {
  
  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    if (!element || !window.html2pdf) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Research-Alignment-${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    window.html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-700 pb-10">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/50 sticky top-24 z-30">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-200">
                <FileText className="w-5 h-5"/>
            </div>
            التقرير النهائي للمواءمة
        </h2>
        <div className="flex gap-3 w-full md:w-auto">
           <button
            onClick={handleExportPDF}
            className="flex-1 md:flex-none justify-center px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl flex items-center gap-2 transition-all text-sm font-bold shadow-lg shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-4 h-4" />
            تصدير PDF
          </button>
          <button
            onClick={onReset}
            className="flex-1 md:flex-none justify-center px-6 py-3 text-slate-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200 hover:shadow-sm rounded-xl flex items-center gap-2 transition-all text-sm font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            بحث جديد
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div id="report-content" className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600"></div>
        
        {/* Watermark/BG Decor */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-0 pointer-events-none mix-blend-multiply"></div>

        {/* Report Header */}
        <div className="relative z-10 mb-12 border-b-2 border-slate-100 pb-10">
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
        <div className="relative z-10 mb-14 break-inside-avoid">
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
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 break-inside-avoid">
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <h4 className="text-emerald-800 font-extrabold mb-4 text-sm uppercase tracking-wider relative z-10">المتغير المستقل</h4>
                <p className="text-emerald-950 font-bold text-xl leading-relaxed relative z-10">{report.independent_variable}</p>
            </div>
            <div className="bg-rose-50/80 border border-rose-100 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <h4 className="text-rose-800 font-extrabold mb-4 text-sm uppercase tracking-wider relative z-10">المتغير التابع</h4>
                <p className="text-rose-950 font-bold text-xl leading-relaxed relative z-10">{report.dependent_variable}</p>
            </div>
        </div>

        {/* Hypotheses Section */}
        <div className="relative z-10 break-inside-avoid space-y-10">
            
            {/* Theory Hypotheses */}
            <div>
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
            <div>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                     <div className="flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-indigo-500" />
                        <h3 className="text-2xl font-black text-slate-900">فرضيات الدراسة المقترحة</h3>
                     </div>
                </div>
                <ul className="space-y-4">
                    {report.study_hypotheses.map((hypothesis, idx) => (
                        <li key={idx} className="flex gap-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow items-start">
                            <span className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white font-black rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 text-lg transform -rotate-3">
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

        {/* Footer for Report */}
        <div className="mt-16 pt-8 border-t-2 border-slate-50 text-center relative z-10">
             <p className="text-slate-400 text-sm font-bold bg-slate-50 inline-block px-4 py-2 rounded-full">
                تم إنشاء هذا التقرير تلقائياً بواسطة نظام المواءمة النظرية الذكي عن طريق الذكاء الإصطناعي
             </p>
        </div>

      </div>
    </div>
  );
};

export default StepReport;
