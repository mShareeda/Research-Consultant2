
import React from "react";
import { FlaskConical } from "lucide-react";
import { Language } from "../types";
import { translations } from "../utils/translations";

interface HeaderProps {
    lang: Language;
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <header className="w-full py-2 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 transition-all duration-300 supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-row items-center justify-between gap-4 relative ${lang === 'ar' ? '' : 'flex-row-reverse'}`}>
          
          {/* Branding - Right side in Arabic, Left in English (Swapped via flex-row-reverse) */}
          <div className="flex items-center gap-3 z-10 select-none hover:opacity-90 transition-opacity cursor-default flex-shrink-0">
             <img 
               src="https://drive.google.com/thumbnail?id=1uEEM3KvDl2vrTEF25p3HBvCOXQF3KsGW&sz=w1000" 
               referrerPolicy="no-referrer"
               alt="Logo" 
               className="h-20 md:h-32 w-auto min-w-[120px] object-contain drop-shadow-md"
             />
          </div>

          {/* Title */}
          <div className={`w-full pointer-events-none flex-grow flex flex-col justify-center ${lang === 'ar' ? 'items-end text-left' : 'items-start text-left'}`}>
            <h1 className="text-lg sm:text-xl md:text-4xl font-black text-slate-800 tracking-tight pointer-events-auto drop-shadow-sm bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-relaxed py-3 md:py-4">
              {t.appTitle}
            </h1>
            
            {/* Beta Badge */}
            <div className={`pointer-events-auto mt-0 animate-in fade-in duration-700 delay-300 ${lang === 'ar' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'}`}>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/50 text-amber-600/90 text-[10px] md:text-xs font-bold tracking-wider shadow-[0_2px_8px_rgba(245,158,11,0.1)] hover:shadow-md hover:scale-105 transition-all cursor-help select-none">
                    <FlaskConical className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />
                    <span dir="ltr" className="font-mono pt-0.5">{t.beta}</span>
                </span>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
