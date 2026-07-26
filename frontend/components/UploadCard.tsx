"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  loading: boolean;
  onAnalyze: () => void;
}

export default function UploadCard({
  onFileSelect,
  selectedFile,
  loading,
  onAnalyze,
}: UploadCardProps) {
  const [docCategory, setDocCategory] = useState("salary_slip");
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { id: "salary_slip", label: "Salary Slip", desc: "Monthly pay slip PDF" },
    { id: "bank_statement", label: "Bank Statement", desc: "Transactions & balance" },
    { id: "tax_form", label: "Tax Form 16", desc: "Annual income tax summary" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        onFileSelect(droppedFile);
      } else {
        alert("Please select or drop a valid PDF document.");
      }
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden border border-slate-800">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -z-10" />

      {/* Category selector */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          1. Select Document Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setDocCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                docCategory === cat.id
                  ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className="block text-xs font-bold">{cat.label}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drag and drop box */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          2. Upload PDF Document
        </label>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer relative ${
            dragActive
              ? "border-blue-400 bg-blue-500/10 scale-[1.01]"
              : selectedFile
              ? "border-emerald-500/50 bg-emerald-950/20"
              : "border-slate-700/80 hover:border-slate-500 bg-slate-900/40"
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files?.length) {
                onFileSelect(e.target.files[0]);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform ${
              selectedFile ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-600/20 text-blue-400"
            }`}>
              {selectedFile ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
            </div>

            {selectedFile ? (
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PDF Selected
                </span>
                <p className="text-sm font-bold text-slate-100 mt-2 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Click or drag another file to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drag and drop your PDF here, or <span className="text-blue-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports multi-page Salary Slips & Bank Statements (Max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis action button */}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={!selectedFile || loading}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
          !selectedFile || loading
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25 hover:scale-[1.01]"
        }`}
      >
        {loading ? (
          <>
            <Cpu className="w-5 h-5 animate-spin text-blue-300" />
            <span>Parsing Document & Extracting Profile...</span>
          </>
        ) : (
          <>
            <Cpu className="w-5 h-5 text-blue-300" />
            <span>Extract & Run AI Financial Analysis</span>
          </>
        )}
      </button>

      {/* Security footer note */}
      <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
        <span>Files are processed securely. Your financial data stays private.</span>
      </div>
    </div>
  );
}
