
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StepInput from "./components/StepInput";
import StepTheories from "./components/StepTheories";
import StepReport from "./components/StepReport";
import Loading from "./components/Loading";
import { AppState, AcademicLevel, Theory, Report } from "./types";
import { getTheorySuggestions, getFinalReport } from "./services/gemini";

const initialState: AppState = {
  step: 1,
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

  const handleInputSubmit = async (title: string, level: AcademicLevel, foundation: string) => {
    setState((prev) => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      researchTitle: title, 
      academicLevel: level,
      researchFoundation: foundation
    }));
    
    try {
      const theories = await getTheorySuggestions(title, level, foundation);
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
        error: error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      }));
    }
  };

  const handleLoadMoreTheories = async () => {
    setIsLoadingMore(true);
    try {
        const existingNames = state.suggestedTheories.map(t => t.name);
        const newTheories = await getTheorySuggestions(
            state.researchTitle, 
            state.academicLevel, 
            state.researchFoundation,
            existingNames
        );
        
        setState(prev => ({
            ...prev,
            suggestedTheories: [...prev.suggestedTheories, ...newTheories]
        }));
    } catch (error: any) {
         setState((prev) => ({
            ...prev,
            error: error.message || "فشل تحميل المزيد من النظريات.",
          }));
    } finally {
        setIsLoadingMore(false);
    }
  };

  const handleTheorySelect = async (theory: Theory) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, selectedTheory: theory }));

    try {
      const report = await getFinalReport(
        state.researchTitle,
        state.academicLevel,
        theory
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
        error: error.message || "فشل إنشاء التقرير النهائي. يرجى المحاولة لاحقاً.",
      }));
    }
  };

  const resetApp = () => {
    setState(initialState);
  };

  const goBackToInput = () => {
      setState(prev => ({ ...prev, step: 1, error: null }));
  }

  const getLoadingMessage = () => {
      if (isLoadingMore) return "جاري البحث عن نظريات إضافية متنوعة...";
      if (state.step === 1) return `جاري تحليل العنوان بناءً على الأسس ${state.researchFoundation || 'العلمية'} واقتراح النظريات...`;
      if (state.step === 2) return "جاري صياغة الفرضيات ومواءمة الإطار النظري...";
      return "جاري المعالجة...";
  };

  return (
    <div className="min-h-screen w-full pb-0 flex flex-col bg-slate-50/50">
      {/* Header is now outside the main container constraints */}
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <main className="relative mt-8">
            {state.error && (
                <div className="bg-rose-50 text-rose-900 p-6 rounded-2xl mb-8 text-center border border-rose-200 shadow-sm font-bold animate-in fade-in slide-in-from-top-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <span>{state.error}</span>
                </div>
            )}

            {state.step === 1 && (
                <StepInput onSubmit={handleInputSubmit} />
            )}

            {state.step === 2 && (
                <StepTheories 
                    theories={state.suggestedTheories} 
                    onSelect={handleTheorySelect} 
                    onBack={goBackToInput}
                    onLoadMore={handleLoadMoreTheories}
                    title={state.researchTitle}
                />
            )}

            {state.step === 3 && state.finalReport && state.selectedTheory && (
                <StepReport 
                    report={state.finalReport}
                    theory={state.selectedTheory}
                    title={state.researchTitle}
                    level={state.academicLevel}
                    onReset={resetApp}
                />
            )}
        </main>
      </div>
      
      <footer className="w-full py-10 text-center mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
          <p className="text-slate-700 font-black text-sm">© مركز بو جود للاستشارات البحثية. جميع الحقوق محفوظة</p>
          <p className="text-slate-400 text-xs font-bold mt-2 font-mono tracking-widest opacity-60 hover:opacity-100 transition-opacity" dir="ltr">@mShareeda 2025</p>
      </footer>

      {(state.isLoading || isLoadingMore) && <Loading message={getLoadingMessage()} />}
    </div>
  );
};

export default App;
