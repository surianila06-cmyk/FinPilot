export interface FinancialProfile {
  monthly_income: number;
  monthly_expenses: number;
  savings: number;
  loans: number;
  monthly_emi?: number;
  insurance?: number;
  financial_score?: number;
}

export interface FinancialScoreResponse {
  filename?: string;
  pages?: number;
  financial_profile: FinancialProfile;
  financial_score: number | { score: number };
  is_fallback?: boolean;
}

export interface ChatMessageItem {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}
