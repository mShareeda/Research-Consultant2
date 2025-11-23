
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Language } from "../types";
import { translations } from "../utils/translations";

interface LoadingProps {
  message?: string;
  lang: Language;
}

const Loading: React.FC<LoadingProps> = ({ message, lang }) => {
  const [progress, setProgress] = useState(0);
  const t = translations[lang];

  useEffect(() => {
    // Simulate progress for better UX during AI processing
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 90) {
          return 90; // Cap at 90% until complete
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 90);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-8 animate-in zoom-in duration-300 max-w-md w-full text-center border border-white/20 ring-1 ring-black/5">
        
        <div className="relative">
            <div className="bg-indigo-50 p-5 rounded-full relative z-10">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="space-y-3 w-full">
            <h3 className="text-2xl font-black text-slate-900">{t.loadingProcessing}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {message || t.loadingWait}
            </p>
        </div>

        <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                <span>{t.loadingProgress}</span>
                <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner border border-slate-50">
                <div 
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 w-full h-full animate-[shimmer_1.5s_infinite] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)]"></div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Loading;
