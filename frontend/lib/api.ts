import type { UploadResponse, ChatResponse, ChatHistoryItem } from "@/types/financial";

// ── Backend URL ──────────────────────────────────────────────────────────────
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://finpilot-backend-jodg.onrender.com";

console.log("API URL:", BASE_URL);
// Render free-tier cold starts can exceed 60s; keep the browser timeout long enough.
const DEFAULT_TIMEOUT_MS = 120000;

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// ── Ping ─────────────────────────────────────────────────────────────────────
export async function pingBackend(timeoutMs = 25000): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/health`, {}, timeoutMs);
    return res.ok;
  } catch {
    return false;
  }
}

// ── Upload PDF ────────────────────────────────────────────────────────────────
export async function uploadPDF(
  file: File,
  onStatus?: (msg: string) => void
): Promise<UploadResponse> {
  const MAX_RETRIES = 3;

  // Warm the backend instance before uploading (Render free tier spins down on idle).
  await pingBackend();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1 && onStatus) {
        onStatus(`Waking up server… Attempt ${attempt}/${MAX_RETRIES}`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetchWithTimeout(`${BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody.detail || errBody.message || `Upload failed (${response.status})`;
        throw new ApiError(msg, response.status);
      }

      return (await response.json()) as UploadResponse;
    } catch (err) {
      console.warn(`[api] Upload attempt ${attempt} failed:`, err);
      if (attempt === MAX_RETRIES) {
        throw err instanceof Error ? err : new Error("Upload failed after retries.");
      }
      await new Promise((r) => setTimeout(r, 4000));
    }
  }

  throw new Error("Upload failed after retries.");
}

// ── Chat ──────────────────────────────────────────────────────────────────────
function clientFallbackChat(question: string, profile: Record<string, unknown>): ChatResponse {
  const q = question.toLowerCase();
  const income = Number(profile.monthly_income) || 75000;
  const savings = Number(profile.savings) || 350000;
  const expenses = Number(profile.monthly_expenses) || 25000;
  const emi = Number(profile.monthly_emi) || 0;
  const surplus = income - expenses - emi;

  if (q.includes("gold") || q.includes("sgb")) {
    return {
      message: `✅ Gold is an excellent inflation hedge.\n\nSavings: ₹${savings.toLocaleString()}\n\n• Allocate 5–10% of savings to gold.\n• Sovereign Gold Bonds offer 2.5% interest + tax-free gains on maturity.\n• Start Digital Gold SIPs from ₹100/month.\n\nDiversify wisely and grow steadily! 💛`,
    };
  } else if (q.includes("sip") || q.includes("invest") || q.includes("mutual fund")) {
    const sip = Math.max(500, Math.round(surplus * 0.3));
    return {
      message: `💡 Investing is the smartest move right now!\n\nMonthly Surplus: ₹${surplus.toLocaleString()}\nRecommended SIP: ₹${sip.toLocaleString()}/month\n\n• Nifty 50 Index Funds: ~12% CAGR historically.\n• Use Zerodha Coin or Groww for direct plans (zero commission).\n\nStart today — time beats timing! 📈`,
    };
  } else if (q.includes("bike") || q.includes("car") || q.includes("vehicle")) {
    return {
      message: `✅ A vehicle purchase is achievable with your surplus of ₹${surplus.toLocaleString()}/month.\n\n• Keep vehicle EMI under 15% of income (≤ ₹${(income * 0.15).toLocaleString()}/month).\n• Aim for 30%+ down payment to reduce interest.\n\nPlan well and drive confidently! 🚗`,
    };
  } else if (q.includes("loan") || q.includes("emi")) {
    return {
      message: `⚠ Be strategic about new debt.\n\nMonthly Income: ₹${income.toLocaleString()}\n\n• Keep total EMIs below 35% of net income (≤ ₹${(income * 0.35).toLocaleString()}/month).\n• Compare PSU vs private bank rates before committing.\n\nSmart borrowing protects your financial freedom! 📊`,
    };
  } else {
    return {
      message: `💡 FinPilot Financial Snapshot:\n\nIncome: ₹${income.toLocaleString()} | Surplus: ₹${surplus.toLocaleString()}\nSavings: ₹${savings.toLocaleString()}\n\n• Save at least 20% of income monthly.\n• Maintain 6 months of expenses as emergency reserves.\n• Start a Nifty 50 Index Fund SIP.\n\nYou're on the right track — keep building! 🌟`,
    };
  }
}

export async function chatWithAI(
  question: string,
  profile: Record<string, unknown>,
  chatHistory: ChatHistoryItem[] = []
): Promise<ChatResponse> {
  const MAX_RETRIES = 2;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(
        `${BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, profile, chat_history: chatHistory }),
        },
        30000
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new ApiError(errBody.detail || `Chat failed (${response.status})`, response.status);
      }

      return (await response.json()) as ChatResponse;
    } catch (err) {
      console.warn(`[api] Chat attempt ${attempt} failed:`, err);
      if (attempt === MAX_RETRIES) {
        return clientFallbackChat(question, profile);
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  return clientFallbackChat(question, profile);
}