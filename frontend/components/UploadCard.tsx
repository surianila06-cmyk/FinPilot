"use client";

import { useState, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Sparkles,
  X,
} from "lucide-react";

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  loading: boolean;
  statusMessage?: string;
  onAnalyze: () => void;
}

const DOC_TYPES = [
  { id: "salary_slip", label: "Salary Slip", desc: "Monthly pay slip PDF", emoji: "💼" },
  { id: "bank_statement", label: "Bank Statement", desc: "Transactions & balance", emoji: "🏦" },
  { id: "form16", label: "Form 16", desc: "Annual tax summary", emoji: "📋" },
];

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function validateFile(file: File): string | null {
  if (file.type !== "application/pdf") return "Please select a valid PDF document.";
  if (file.size > MAX_SIZE_BYTES) return `File size exceeds ${MAX_SIZE_MB}MB limit.`;
  return null;
}

export default function UploadCard({
  onFileSelect,
  selectedFile,
  loading,
  statusMessage,
  onAnalyze,
}: UploadCardProps) {
  const [docType, setDocType] = useState("salary_slip");
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        return;
      }
      setFileError(null);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 max-w-xl mx-auto border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-blue-600/8 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Step 1: Document Type */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          1. Select Document Type
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DOC_TYPES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setDocType(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all focus:outline-none ${
                docType === cat.id
                  ? "bg-blue-600/15 border-blue-500/60 text-blue-300 shadow-md shadow-blue-500/10"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              <span className="text-lg block mb-1">{cat.emoji}</span>
              <span className="block text-xs font-bold">{cat.label}</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Upload Zone */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          2. Upload PDF Document
        </p>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-blue-400 bg-blue-500/8 scale-[1.01]"
              : selectedFile
              ? "border-emerald-500/50 bg-emerald-950/10"
              : fileError
              ? "border-red-500/50 bg-red-950/10"
              : "border-slate-700/60 hover:border-slate-600 bg-slate-900/30"
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="flex flex-col items-center space-y-3">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                selectedFile ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-600/15 text-blue-400"
              }`}
            >
              {selectedFile ? (
                <FileText className="w-8 h-8" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            {selectedFile ? (
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PDF Selected
                </span>
                <p className="text-sm font-bold text-slate-100 mt-2 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Click or drag to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drag & drop your PDF, or{" "}
                  <span className="text-blue-400 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Salary slips, bank statements, Form 16 · Max {MAX_SIZE_MB}MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File error */}
        {fileError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-2">
            <X className="w-3.5 h-3.5 flex-shrink-0" />
            {fileError}
          </div>
        )}
      </div>

      {/* Status banner */}
      {loading && statusMessage && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-blue-950/50 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Step 3: Analyze Button */}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={!selectedFile || loading}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
          !selectedFile || loading
            ? "bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/20 hover:scale-[1.01] hover:shadow-blue-500/30"
        }`}
      >
        {loading ? (
          <>
            <Cpu className="w-5 h-5 animate-spin text-blue-300" />
            Processing Document…
          </>
        ) : (
          <>
            <Cpu className="w-5 h-5 text-blue-200" />
            Extract &amp; Analyse Financial Profile
          </>
        )}
      </button>

      {/* Security note */}
      <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-xs text-slate-600">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
        Files are processed securely and never stored permanently.
      </div>
    </div>
  );
}
