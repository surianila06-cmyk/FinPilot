export interface FinancialProfile {
  monthly_income: number;
  monthly_expenses: number;
  savings: number;
  loans: number;
  monthly_emi: number;
  insurance: number;
  financial_score?: number;
  document_type?: string;
  liquid_savings?: number;
  savings_source?: string | null;
  investments?: number;
  active_loans?: number;
  reasoning?: {
    loan_detection?: string;
    income_detection?: string;
    expense_detection?: string;
  };
}

export interface UploadResponse {
  filename: string;
  pages: number;
  financial_profile: FinancialProfile;
  financial_score: number;
  score_label?: string;
  is_fallback?: boolean;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  status?: string;
  expense_ratio?: number;
  emi_ratio?: number;
  goal_amount?: number;
  goal_label?: string;
  recommended_sip?: number;
  projection_10y?: number;
}

export interface MessageItem {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}

export type ScoreLabel = "Excellent" | "Good" | "Average" | "Below Average" | "Critical";

export interface HealthScoreBreakdown {
  score: number;
  label: ScoreLabel;
  color: string;
}

export function getScoreBreakdown(score: number): HealthScoreBreakdown {
  if (score >= 85) return { score, label: "Excellent", color: "#10b981" };
  if (score >= 70) return { score, label: "Good", color: "#3b82f6" };
  if (score >= 50) return { score, label: "Average", color: "#f59e0b" };
  if (score >= 30) return { score, label: "Below Average", color: "#f97316" };
  return { score, label: "Critical", color: "#ef4444" };
}
