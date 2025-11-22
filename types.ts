
export enum AcademicLevel {
  Bachelor = "بكالوريوس",
  Master = "ماجستير",
  PhD = "دكتوراة"
}

export interface Theory {
  name: string;
  match_reason: string;
}

export interface Report {
  theory_integration: string;
  independent_variable: string;
  dependent_variable: string;
  theory_hypotheses: string[];
  study_hypotheses: string[];
}

export interface AppState {
  step: 1 | 2 | 3;
  academicLevel: AcademicLevel;
  researchTitle: string;
  suggestedTheories: Theory[];
  selectedTheory: Theory | null;
  finalReport: Report | null;
  isLoading: boolean;
  error: string | null;
}
