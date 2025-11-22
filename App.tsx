import React, { useState } from "react";
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
  researchTitle: "",
  suggestedTheories: [],
  selectedTheory: null,
  finalReport: null,
  isLoading: false,
  error: null,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);

  const handleInputSubmit = async (title: string, level: AcademicLevel) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, researchTitle: title, academicLevel: level }));
    
    try {
      const theories = await getTheorySuggestions(title, level);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        suggestedTheories: theories,
        step: 2,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "حدث خطأ أثناء الاتصال بالخادم الذكي. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
      }));
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
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "فشل إنشاء التقرير النهائي. يرجى المحاولة لاحقاً.",
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
      if (state.step === 1) return "جاري تحليل العنوان واقتراح النظريات العلمية المناسبة...";
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
                <div className="bg-rose-50 text-rose-900 p-6 rounded-2xl mb-8 text-center border border-rose-200 shadow-sm font-bold animate-in fade-in slide-in-from-top-4">
                    {state.error}
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

      {state.isLoading && <Loading message={getLoadingMessage()} />}
    </div>
  );
};

export default App;