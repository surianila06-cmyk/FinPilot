"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadCard from "@/components/UploadCard";
import ScoreGauge from "@/components/ScoreGauge";
import { uploadPDF } from "@/lib/api";
import type { UploadResponse } from "@/types/financial";
import {
  ArrowRight, RefreshCw, Cpu, FileCheck,
  CircleDollarSign, Wallet, PiggyBank, Landmark,
} from "lucide-react";

type Step = "upload" | "review";

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setUploadError(null);
    setStatusMessage("Connecting to server…");

    try {
      const data = await uploadPDF(file, (msg) => setStatusMessage(msg));
      if (!data.is_fallback) {
        localStorage.setItem("financialProfile", JSON.stringify(data.financial_profile));
        localStorage.setItem("financialScore", JSON.stringify(data.financial_score));
      }
      setResult(data);
      setStep("review");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("upload");
    setFile(null);
    setResult(null);
    setUploadError(null);
    setStatusMessage("");
  };

  const score = typeof result?.financial_score === "number" ? result.financial_score : 0;
  const fp = result?.financial_profile;

  const PROFILE_ROWS = fp
    ? [
        { label: "Monthly Income", value: `₹${fp.monthly_income.toLocaleString()}`, icon: CircleDollarSign, color: "text-blue-400" },
        { label: "Monthly Expenses", value: `₹${fp.monthly_expenses.toLocaleString()}`, icon: Wallet, color: "text-amber-400" },
        { label: "Liquid Savings", value: `₹${fp.savings.toLocaleString()}`, icon: PiggyBank, color: "text-emerald-400" },
        { label: "Active Loans", value: fp.loans > 0 ? `${fp.loans} active` : "None", icon: Landmark, color: "text-rose-400" },
        { label: "Monthly EMI", value: `₹${(fp.monthly_emi || 0).toLocaleString()}`, icon: Landmark, color: "text-orange-400" },
        { label: "Insurance", value: `₹${(fp.insurance || 0).toLocaleString()}`, icon: CircleDollarSign, color: "text-purple-400" },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Cpu className="w-3.5 h-3.5" /> AI Document Extraction
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Upload Financial Document
          </h1>
          <p className="text-sm text-slate-400">
            Upload your Salary Slip, Bank Statement, or Form 16. FinPilot AI will automatically
            parse income, expenses, EMIs, savings and generate a financial health score.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {(["upload", "review"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  step === s || (s === "upload" && step === "review")
                    ? "border-blue-500 bg-blue-600/20 text-blue-400"
                    : "border-slate-700 text-slate-600"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-xs font-medium capitalize ${step === s ? "text-blue-400" : "text-slate-600"}`}>
                {s === "upload" ? "Upload & Extract" : "Review Results"}
              </span>
              {i === 0 && <div className="w-10 h-px bg-slate-800" />}
            </div>
          ))}
        </div>

        {/* Upload step */}
        {step === "upload" && (
          <>
            <UploadCard
              onFileSelect={setFile}
              selectedFile={file}
              loading={loading}
              statusMessage={statusMessage}
              onAnalyze={handleUpload}
            />
            {uploadError && (
              <p className="text-center text-xs text-red-400 mt-4">{uploadError}</p>
            )}
          </>
        )}

        {/* Review step */}
        {step === "review" && result && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">

            {/* Header card */}
            <div className="glass-panel rounded-3xl p-8 border border-emerald-500/25">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-800/60 mb-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-100">
  {result.is_fallback ? "Backend Upload Failed" : "Document Parsed Successfully!"}
</h3>
                    <p className="text-xs text-slate-500 truncate">{result.filename}</p>
                    <p className="text-xs text-slate-600">{result.pages} page(s) processed</p>
                  </div>
                </div>
                {result.is_fallback && (
                  <span className="px-2.5 py-1 rounded-full text-xs bg-amber-950/60 text-amber-400 border border-amber-500/30 font-semibold flex-shrink-0">
                    Client Fallback
                  </span>
                )}
              </div>

              {/* Score + profile grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Financial Health Score
                  </span>
                  <ScoreGauge score={score} size={170} />
                  {result.score_label && (
                    <span className="text-xs text-slate-400 font-medium">{result.score_label}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {PROFILE_ROWS.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">{label}</span>
                      <span className={`text-sm font-bold ${color} flex items-center gap-1.5 mt-0.5`}>
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3.5 rounded-2xl glass-card text-slate-300 font-semibold text-sm hover:bg-slate-800/60 flex items-center justify-center gap-2 border border-slate-800"
              >
                <RefreshCw className="w-4 h-4" /> Upload Another
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                View Full Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}