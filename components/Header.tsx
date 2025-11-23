
import React from "react";
import { FlaskConical } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-2 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 transition-all duration-300 supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between gap-4 relative">
          
          {/* Branding - Right side (Start in RTL) */}
          <div className="flex items-center gap-3 z-10 select-none hover:opacity-90 transition-opacity cursor-default flex-shrink-0">
             <img 
               src="https://drive.google.com/thumbnail?id=1uEEM3KvDl2vrTEF25p3HBvCOXQF3KsGW&sz=w1000" 
               alt="مركز بو جود" 
               className="h-16 md:h-24 w-auto object-contain drop-shadow-md"
             />
          </div>

          {/* Title - Left side (End in RTL) */}
          <div className="text-left w-full pointer-events-none flex-grow flex flex-col items-end justify-center">
            <h1 className="text-lg sm:text-xl md:text-4xl font-black text-slate-800 tracking-tight pointer-events-auto drop-shadow-sm bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight py-0.5">
              نظام مواءمة النظرية الذكي
            </h1>
            
            {/* Beta Badge */}
            <div className="pointer-events-auto mt-1 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/50 text-amber-600/90 text-[10px] md:text-xs font-bold tracking-wider shadow-[0_2px_8px_rgba(245,158,11,0.1)] hover:shadow-md hover:scale-105 transition-all cursor-help select-none">
                    <FlaskConical className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />
                    <span dir="ltr" className="font-mono pt-0.5">BETA v0.02</span>
                </span>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;