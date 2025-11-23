
export enum AcademicLevel {
  Bachelor = "بكالوريوس",
  Master = "ماجستير",
  PhD = "دكتوراة"
}

export type ResearchFoundation = "إعلامي" | "اجتماعي" | "اقتصادي" | "تربوي" | "نفسي" | "إداري" | "تقني" | "قانوني" | "أخرى";

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

export interface ComparisonResult {
  common_ground: string; // Points of similarity
  key_differences: string; // Critical differences
  analysis: {
    theory_name: string;
    pros: string; // Why it fits this title
    cons: string; // What it might miss
  }[];
  recommendation: string; // Which one is slightly better and why
}

export interface AppState {
  step: 1 | 2 | 3;
  academicLevel: AcademicLevel;
  researchFoundation: string; // New field
  researchTitle: string;
  suggestedTheories: Theory[];
  selectedTheory: Theory | null;
  finalReport: Report | null;
  isLoading: boolean;
  error: string | null;
}
