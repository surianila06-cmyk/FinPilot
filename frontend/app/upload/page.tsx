"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadCard from "@/components/UploadCard";
import { uploadPDF } from "@/lib/api";
import { ArrowRight, RefreshCw, Cpu, FileCheck } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [extractedData, setExtractedData] = useState<Record<string, unknown> | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setStatusMessage("Connecting to server...");
      const result = await uploadPDF(file, (msg) => setStatusMessage(msg));

      // Store in localStorage for persistence
      localStorage.setItem("financialProfile", JSON.stringify(result.financial_profile));
      localStorage.setItem("financialScore", JSON.stringify(result.financial_score));

      setExtractedData(result);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setStatusMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Cpu className="w-3.5 h-3.5" />
            AI Document Extraction
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Upload Financial Document
          </h1>
          <p className="text-sm text-slate-400">
            Upload your Salary Slip, Bank Statement, or Form 16 PDF. FinPilot AI will automatically parse key income and expense metrics.
          </p>
        </div>

        {/* Upload Card or Extracted Review Card */}
        {!extractedData ? (
          <UploadCard
            onFileSelect={setFile}
            selectedFile={file}
            loading={loading}
            statusMessage={statusMessage}
            onAnalyze={handleUpload}
          />
        ) : (
          /* Extracted Data Review Panel */
          <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-8 border border-emerald-500/30 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Document Parsed Successfully!</h3>
                  <p className="text-xs text-slate-400">{extractedData.filename as string}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                Score: {
                  typeof extractedData.financial_score === "object" && extractedData.financial_score !== null
                    ? String((extractedData.financial_score as { score?: number }).score ?? 0)
                    : String(extractedData.financial_score ?? 0)
                }/100
              </span>
            </div>

            {/* Extracted Profile Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block uppercase font-semibold">Monthly Income</span>
                <span className="text-base font-extrabold text-slate-100">
                  ₹{((extractedData.financial_profile as Record<string, number>)?.monthly_income || 0).toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block uppercase font-semibold">Monthly Expenses</span>
                <span className="text-base font-extrabold text-amber-400">
                  ₹{((extractedData.financial_profile as Record<string, number>)?.monthly_expenses || 0).toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block uppercase font-semibold">Liquid Savings</span>
                <span className="text-base font-extrabold text-emerald-400">
                  ₹{((extractedData.financial_profile as Record<string, number>)?.savings || 0).toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block uppercase font-semibold">Monthly EMI / Debt</span>
                <span className="text-base font-extrabold text-rose-400">
                  ₹{((extractedData.financial_profile as Record<string, number>)?.monthly_emi || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setExtractedData(null);
                  setFile(null);
                }}
                className="flex-1 py-3 rounded-xl glass-card text-slate-300 font-semibold text-xs hover:bg-slate-800 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Re-upload File
              </button>

              <button
                onClick={handleProceedToDashboard}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
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