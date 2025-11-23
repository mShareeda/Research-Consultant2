
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StepInput from "./components/StepInput";
import StepTheories from "./components/StepTheories";
import StepReport from "./components/StepReport";
import Loading from "./components/Loading";
import { AppState, AcademicLevel, Theory, Report, Language } from "./types";
import { getTheorySuggestions, getFinalReport } from "./services/gemini";
import { translations } from "./utils/translations";

const initialState: AppState = {
  language: null,
  step: 0,
  academicLevel: AcademicLevel.Master,
  researchFoundation: "",
  researchTitle: "",
  suggestedTheories: [],
  selectedTheory: null,
  finalReport: null,
  isLoading: false,
  error: null,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Automatically scroll to top when the step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.step]);

  // Handle Document Direction based on language
  useEffect(() => {
      const dir = state.language === 'en' ? 'ltr' : 'rtl';
      document.documentElement.dir = dir;
      document.documentElement.lang = state.language || 'ar';
  }, [state.language]);

  const selectLanguage = (lang: Language) => {
      setState(prev => ({ ...prev, language: lang, step: 1 }));
  };

  const handleInputSubmit = async (title: string, level: AcademicLevel, foundation: string) => {
    if (!state.language) return;

    setState((prev) => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      researchTitle: title, 
      academicLevel: level,
      researchFoundation: foundation
    }));
    
    try {
      const theories = await getTheorySuggestions(title, level, foundation, state.language);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        suggestedTheories: theories,
        step: 2,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Unknown error",
      }));
    }
  };

  const handleLoadMoreTheories = async () => {
    if (!state.language) return;
    setIsLoadingMore(true);
    try {
        const existingNames = state.suggestedTheories.map(t => t.name);
        const newTheories = await getTheorySuggestions(
            state.researchTitle, 
            state.academicLevel, 
            state.researchFoundation,
            state.language,
            existingNames
        );
        
        setState(prev => ({
            ...prev,
            suggestedTheories: [...prev.suggestedTheories, ...newTheories]
        }));
    } catch (error: any) {
         setState((prev) => ({
            ...prev,
            error: error.message || "Failed to load more theories.",
          }));
    } finally {
        setIsLoadingMore(false);
    }
  };

  const handleTheorySelect = async (theory: Theory) => {
    if (!state.language) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null, selectedTheory: theory }));

    try {
      const report = await getFinalReport(
        state.researchTitle,
        state.academicLevel,
        theory,
        state.language
      );
      setState((prev) => ({
        ...prev,
        isLoading: false,
        finalReport: report,
        step: 3,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to generate report.",
      }));
    }
  };

  const resetApp = () => {
    setState({ ...initialState, language: state.language, step: 1 });
  };

  const goBackToInput = () => {
      setState(prev => ({ ...prev, step: 1, error: null }));
  }

  const getLoadingMessage = () => {
      if (!state.language) return "Loading...";
      const t = translations[state.language];

      if (isLoadingMore) return state.language === 'ar' ? "جاري البحث عن نظريات إضافية متنوعة..." : "Searching for more theories...";
      if (state.step === 1) return t.loadingWait;
      if (state.step === 2) return state.language === 'ar' ? "جاري صياغة الفرضيات ومواءمة الإطار النظري..." : "Formulating hypotheses and aligning theoretical framework...";
      return t.loadingWait;
  };

  // Step 0: Language Selection Screen
  if (state.step === 0) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
             </div>

             <div className="relative z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/50 max-w-lg w-full text-center space-y-10 animate-in zoom-in duration-500">
                 <div className="flex flex-col items-center gap-6">
                    <img 
                      src="https://drive.google.com/thumbnail?id=1uEEM3KvDl2vrTEF25p3HBvCOXQF3KsGW&sz=w1000" 
                      alt="Logo" 
                      className="h-28 mx-auto object-contain drop-shadow-md"
                    />
                    <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        نظام مواءمة النظرية الذكي
                    </h1>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-2">
                     <button 
                        onClick={() => selectLanguage('ar')}
                        className="group relative overflow-hidden bg-white border-2 border-slate-100 hover:border-indigo-500 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 flex items-center justify-center"
                     >
                         <div>
                            <div className="font-bold text-2xl text-slate-800 group-hover:text-indigo-600">العربية</div>
                            <div className="text-xs text-slate-400 mt-2">واجهة عربية</div>
                         </div>
                     </button>

                     <button 
                        onClick={() => selectLanguage('en')}
                        className="group relative overflow-hidden bg-white border-2 border-slate-100 hover:border-indigo-500 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 flex items-center justify-center"
                     >
                         <div>
                            <div className="font-bold text-2xl text-slate-800 group-hover:text-indigo-600">English</div>
                            <div className="text-xs text-slate-400 mt-2">English Interface</div>
                         </div>
                     </button>
                 </div>
             </div>
        </div>
      );
  }

  return (
    <div className={`min-h-screen w-full pb-0 flex flex-col bg-slate-50/50 ${state.language === 'ar' ? 'font-sans' : ''}`}>
      {/* Header is now outside the main container constraints */}
      <Header lang={state.language!} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <main className="relative mt-8">
            {state.error && (
                <div className="bg-rose-50 text-rose-900 p-6 rounded-2xl mb-8 text-center border border-rose-200 shadow-sm font-bold animate-in fade-in slide-in-from-top-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <span>{state.error}</span>
                </div>
            )}

            {state.step === 1 && (
                <StepInput onSubmit={handleInputSubmit} lang={state.language!} />
            )}

            {state.step === 2 && (
                <StepTheories 
                    theories={state.suggestedTheories} 
                    onSelect={handleTheorySelect} 
                    onBack={goBackToInput}
                    onLoadMore={handleLoadMoreTheories}
                    title={state.researchTitle}
                    lang={state.language!}
                />
            )}

            {state.step === 3 && state.finalReport && state.selectedTheory && (
                <StepReport 
                    report={state.finalReport}
                    theory={state.selectedTheory}
                    title={state.researchTitle}
                    level={state.academicLevel}
                    onReset={resetApp}
                    lang={state.language!}
                />
            )}
        </main>
      </div>
      
      <footer className="w-full py-10 text-center mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
          <p className="text-slate-700 font-black text-sm">{translations[state.language!].footerRights}</p>
          <p className="text-slate-400 text-xs font-bold mt-2 font-mono tracking-widest opacity-60 hover:opacity-100 transition-opacity" dir="ltr">@mShareeda 2025</p>
      </footer>

      {(state.isLoading || isLoadingMore) && <Loading message={getLoadingMessage()} lang={state.language!} />}
    </div>
  );
};

export default App;
