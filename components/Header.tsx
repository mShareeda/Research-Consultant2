import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-3 md:py-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 transition-all duration-300 supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between gap-4 relative min-h-[60px] md:min-h-[100px]">
          
          {/* Branding - Right side (Start in RTL) */}
          <div className="flex items-center gap-3 z-10 select-none hover:opacity-90 transition-opacity cursor-default flex-shrink-0">
             <img 
               src="https://drive.google.com/thumbnail?id=1GcTNPrUlPYbztGJ9SdNMEpjykXNMQYjP&sz=w1000" 
               alt="مركز بو جود" 
               className="h-16 md:h-28 w-auto object-contain drop-shadow-md"
             />
          </div>

          {/* Title */}
          <div className="text-left md:text-center w-full md:absolute md:left-0 md:right-0 md:mx-auto pointer-events-none flex-grow">
            <h1 className="text-lg sm:text-xl md:text-4xl font-black text-slate-800 tracking-tight pointer-events-auto drop-shadow-sm bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight py-1">
              نظام مواءمة النظرية الذكي
            </h1>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;