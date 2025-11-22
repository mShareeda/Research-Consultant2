import React from "react";
import { Theory } from "../types";
import { CheckCircle2, ArrowRight, Lightbulb, Sparkle } from "lucide-react";

interface StepTheoriesProps {
  theories: Theory[];
  onSelect: (theory: Theory) => void;
  onBack: () => void;
}

const StepTheories: React.FC<StepTheoriesProps> = ({ theories, onSelect, onBack }) => {
  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                <Sparkle className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-black text-slate-900">النظريات المقترحة</h2>
          </div>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            بناءً على تحليل عنوان دراستك، نوصي باعتماد أحد الأطر النظرية التالية لأنها توفر أفضل تفسير للعلاقة بين المتغيرات.
          </p>
        </div>
        <button 
            onClick={onBack}
            className="hidden md:flex text-slate-500 hover:text-indigo-600 hover:bg-white px-4 py-2.5 rounded-xl items-center gap-2 text-sm font-bold transition-all border border-transparent hover:border-indigo-100 hover:shadow-sm self-start md:self-end"
        >
            <ArrowRight className="w-4 h-4" />
            تعديل العنوان
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {theories.map((theory, idx) => (
          <div
            key={idx}
            style={{ animationDelay: `${idx * 150}ms` }}
            className="bg-white rounded-[2rem] p-2 shadow-card hover:shadow-card-hover hover:translate-y-[-4px] border border-slate-100 transition-all duration-500 flex flex-col group h-full opacity-0 animate-fade-in-up"
          >
            <div className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
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
        ))}
      </div>
      
      <div className="md:hidden flex justify-center pt-4">
          <button 
              onClick={onBack}
              className="text-slate-500 hover:text-indigo-600 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm"
          >
              <ArrowRight className="w-4 h-4" />
              العودة للخطوة السابقة
          </button>
      </div>
    </div>
  );
};

export default StepTheories;