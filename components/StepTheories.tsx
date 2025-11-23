
import React, { useState } from "react";
import { Theory, ComparisonResult } from "../types";
import { CheckCircle2, ArrowRight, Lightbulb, Sparkle, Scale, X, Loader2, CheckSquare, Square, PlusCircle, BookOpen, AlertTriangle } from "lucide-react";
import { compareTheories } from "../services/gemini";

interface StepTheoriesProps {
  theories: Theory[];
  onSelect: (theory: Theory) => void;
  onBack: () => void;
  onLoadMore: () => void;
  title?: string; // Passed to use in comparison
}

const StepTheories: React.FC<StepTheoriesProps> = ({ theories, onSelect, onBack, onLoadMore, title = "" }) => {
  const [selectedForCompare, setSelectedForCompare] = useState<Theory[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleCompareSelection = (theory: Theory) => {
    if (selectedForCompare.find(t => t.name === theory.name)) {
      setSelectedForCompare(prev => prev.filter(t => t.name !== theory.name));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare(prev => [...prev, theory]);
      }
    }
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) return;
    
    setIsComparing(true);
    setComparisonError(null);
    setShowModal(true);
    try {
        const result = await compareTheories(title, selectedForCompare);
        setComparisonResult(result);
    } catch (error: any) {
        console.error("Comparison failed", error);
        setComparisonError(error.message || "حدث خطأ أثناء مقارنة النظريات. يرجى المحاولة مرة أخرى.");
    } finally {
        setIsComparing(false);
    }
  };

  const closeModal = () => {
      setShowModal(false);
      setComparisonResult(null);
      setComparisonError(null);
  }

  return (
    <div className="w-full space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-slate-200 pb-6 gap-4 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                <Sparkle className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-black text-slate-900">النظريات المقترحة</h2>
          </div>

          {title && (
             <div className="mt-4 mb-4 p-4 bg-white border border-indigo-100 rounded-2xl shadow-sm ring-1 ring-indigo-50">
                <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg mt-1">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-indigo-500 block mb-1">عنوان الدراسة:</span>
                        <p className="text-slate-900 font-bold text-lg leading-relaxed">{title}</p>
                    </div>
                </div>
             </div>
          )}

          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            بناءً على تحليل عنوان دراستك، نوصي باعتماد أحد الأطر النظرية التالية. يمكنك اختيار نظريتين أو أكثر للمقارنة بينهم.
          </p>
        </div>
        <button 
            onClick={onBack}
            className="hidden md:flex text-slate-500 hover:text-indigo-600 hover:bg-white px-4 py-2.5 rounded-xl items-center gap-2 text-sm font-bold transition-all border border-transparent hover:border-indigo-100 hover:shadow-sm self-start md:self-center mt-2"
        >
            <ArrowRight className="w-4 h-4" />
            تعديل العنوان
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {theories.map((theory, idx) => {
          const isSelectedForCompare = !!selectedForCompare.find(t => t.name === theory.name);
          return (
            <div
                key={idx}
                style={{ animationDelay: `${idx * 150}ms` }}
                className={`bg-white rounded-[2rem] p-2 shadow-card hover:shadow-card-hover border transition-all duration-500 flex flex-col group h-full opacity-0 animate-fade-in-up relative
                ${isSelectedForCompare ? "border-indigo-400 ring-4 ring-indigo-50" : "border-slate-100"}`}
            >
                {/* Compare Checkbox */}
                <button 
                    onClick={() => toggleCompareSelection(theory)}
                    className={`absolute top-4 left-4 z-20 p-2 rounded-xl transition-all ${isSelectedForCompare ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500"}`}
                    title="أضف للمقارنة"
                >
                    {isSelectedForCompare ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                </button>

                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4 pr-2">
                        <div className="bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white p-3 rounded-2xl flex-shrink-0 transition-colors duration-300">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight pt-1 group-hover:text-indigo-700 transition-colors">{theory.name}</h3>
                    </div>

                    <div className="bg-slate-50/80 p-5 rounded-2xl mb-6 flex-grow border border-slate-100/50">
                    <p className="text-sm text-slate-600 leading-7 font-medium text-justify">
                        {theory.match_reason}
                    </p>
                    </div>
                    
                    <button
                    onClick={() => onSelect(theory)}
                    className="mt-auto w-full bg-white border-2 border-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-200 active:scale-95"
                    >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>اعتماد النظرية</span>
                    </button>
                </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pb-20 pt-4">
        <button
          onClick={onLoadMore}
          className="bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 hover:border-indigo-300 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow-md group"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>اقتراح نظريات أخرى</span>
        </button>
      </div>

      {/* Floating Compare Button */}
      {selectedForCompare.length >= 2 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
              <button 
                onClick={handleCompare}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-lg border border-slate-700 hover:-translate-y-1 transition-all"
              >
                  <Scale className="w-5 h-5" />
                  <span>مقارنة النظريات المحددة ({selectedForCompare.length})</span>
              </button>
          </div>
      )}
      
      {/* Mobile Back Button */}
      <div className="md:hidden flex justify-center pb-8">
          <button 
              onClick={onBack}
              className="text-slate-500 hover:text-indigo-600 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm"
          >
              <ArrowRight className="w-4 h-4" />
              العودة للخطوة السابقة
          </button>
      </div>

      {/* Comparison Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 relative">
                
                {/* Close Button */}
                <button 
                    onClick={closeModal} 
                    className="absolute top-4 left-4 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                        <div className="bg-indigo-600 p-3 rounded-xl text-white">
                            <Scale className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">مقارنة النظريات</h2>
                            <p className="text-slate-500 font-medium">تحليل مقارن لمساعدتك في اتخاذ القرار الأنسب</p>
                        </div>
                    </div>

                    {isComparing ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                            <h3 className="text-xl font-bold text-slate-800">جاري إجراء المقارنة الذكية...</h3>
                            <p className="text-slate-500 mt-2">يقوم الذكاء الاصطناعي الآن بوزن نقاط القوة والضعف لكل نظرية</p>
                        </div>
                    ) : comparisonError ? (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
                             <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                                 <AlertTriangle className="w-8 h-8" />
                             </div>
                             <h3 className="text-xl font-bold text-rose-900 mb-2">تعذر إتمام المقارنة</h3>
                             <p className="text-rose-700 mb-6">{comparisonError}</p>
                             <button 
                                onClick={handleCompare}
                                className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 transition-colors"
                             >
                                 إعادة المحاولة
                             </button>
                        </div>
                    ) : comparisonResult ? (
                        <div className="space-y-8">
                            
                            {/* Summary Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                    <h4 className="font-extrabold text-emerald-800 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" /> القواسم المشتركة
                                    </h4>
                                    <p className="text-slate-700 leading-relaxed font-medium text-sm text-justify">
                                        {comparisonResult.common_ground}
                                    </p>
                                </div>
                                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                                    <h4 className="font-extrabold text-rose-800 mb-3 flex items-center gap-2">
                                        <Scale className="w-5 h-5" /> نقاط الاختلاف الجوهرية
                                    </h4>
                                    <p className="text-slate-700 leading-relaxed font-medium text-sm text-justify">
                                        {comparisonResult.key_differences}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Table-like Grid */}
                            <div className="grid grid-cols-1 gap-6">
                                {comparisonResult.analysis.map((item, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                            <h3 className="font-black text-lg text-indigo-900">{item.theory_name}</h3>
                                        </div>
                                        <div className="p-6 grid md:grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-2 inline-block">نقاط القوة</span>
                                                <p className="text-slate-600 text-sm leading-6 font-medium">{item.pros}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded mb-2 inline-block">التحديات</span>
                                                <p className="text-slate-600 text-sm leading-6 font-medium">{item.cons}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recommendation */}
                            <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200">
                                <h3 className="text-xl font-black mb-3 flex items-center gap-2">
                                    <Sparkle className="w-5 h-5" /> التوصية الذكية
                                </h3>
                                <p className="leading-8 font-medium text-indigo-50 text-justify">
                                    {comparisonResult.recommendation}
                                </p>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StepTheories;
