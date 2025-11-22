import React, { useState } from "react";
import { AcademicLevel } from "../types";
import { ArrowLeft, Sparkles, BookOpen, GraduationCap, ScrollText } from "lucide-react";

interface StepInputProps {
  onSubmit: (title: string, level: AcademicLevel) => void;
}

const StepInput: React.FC<StepInputProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<AcademicLevel>(AcademicLevel.Master);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length > 10) {
      setIsSubmitting(true);
      onSubmit(title, level);
    }
  };

  const levels = [
    { id: AcademicLevel.Bachelor, icon: BookOpen, label: "بكالوريوس", desc: "دراسة تطبيقية" },
    { id: AcademicLevel.Master, icon: ScrollText, label: "ماجستير", desc: "دراسة تحليلية" },
    { id: AcademicLevel.PhD, icon: GraduationCap, label: "دكتوراة", desc: "أصالة علمية" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-[2rem] shadow-card border border-white/50 p-6 md:p-10 animate-in slide-in-from-bottom-4 duration-500 ring-1 ring-slate-100">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">بيانات الدراسة الأساسية</h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto text-balance">
            أدخل عنوان بحثك لنقوم بتحليله واقتراح النظريات العلمية الأنسب التي تدعم متغيرات دراستك.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Academic Level Section */}
          <div className="space-y-4">
            <label className="block text-sm font-extrabold text-slate-900 mr-1">
              المستوى الأكاديمي
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {levels.map((lvl) => {
                const Icon = lvl.icon;
                const isSelected = level === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id)}
                    className={`relative p-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 group border-2 ${
                      isSelected
                        ? "bg-indigo-50/50 border-indigo-600 shadow-glow transform scale-105"
                        : "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 hover:scale-[1.02]"
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50"}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className={`font-bold text-lg ${isSelected ? "text-indigo-900" : "text-slate-600"}`}>
                        {lvl.label}
                      </div>
                    </div>
                    {isSelected && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Research Title Section */}
          <div className="space-y-4">
            <label className="block text-sm font-extrabold text-slate-900 mr-1">
              عنوان البحث المقترح
            </label>
            <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-xl transition-opacity opacity-0 group-focus-within:opacity-100"></div>
                <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="relative w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all min-h-[160px] text-right text-lg font-medium leading-loose resize-none shadow-inner"
                    placeholder="مثال: أثر استخدام تطبيقات الذكاء الاصطناعي التوليدي على الكفاءة البحثية لدى طلبة الدراسات العليا في مملكة البحرين..."
                    required
                />
                <div className={`absolute bottom-4 left-4 text-xs font-bold px-2 py-1 rounded-md border transition-all ${
                  title.length > 10 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-400 bg-white/80 border-slate-100"
                }`}>
                    {title.length} حرف
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={title.trim().length < 10 || isSubmitting}
            className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 group transition-all duration-300 relative overflow-hidden
              ${title.trim().length >= 10 && !isSubmitting
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
          >
            <span className="relative z-10">{isSubmitting ? "جاري البدء..." : "بدء التحليل الذكي"}</span>
            {title.trim().length >= 10 && !isSubmitting ? (
               <Sparkles className="w-6 h-6 group-hover:animate-pulse relative z-10" />
            ) : (
               <ArrowLeft className="w-6 h-6 relative z-10" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StepInput;