
export enum AcademicLevel {
  Bachelor = "بكالوريوس",
  Master = "ماجستير",
  PhD = "دكتوراة"
}

export type ResearchFoundation = "إعلامي" | "اجتماعي" | "اقتصادي" | "تربوي" | "نفسي" | "إداري" | "تقني" | "قانوني" | "أخرى";

export type Language = 'ar' | 'en';

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
  language: Language | null; // New field
  step: 0 | 1 | 2 | 3; // Step 0 is language selection
  academicLevel: AcademicLevel;
  researchFoundation: string;
  researchTitle: string;
  suggestedTheories: Theory[];
  selectedTheory: Theory | null;
  finalReport: Report | null;
  isLoading: boolean;
  error: string | null;
}
