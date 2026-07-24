"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPDF } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);

      const result = await uploadPDF(file);
      console.log("Backend Response:", result);

      // Save returned data for other pages
      localStorage.setItem(
        "financialProfile",
        JSON.stringify(result.financial_profile)
      );

      localStorage.setItem(
        "financialScore",
        JSON.stringify(result.financial_score)
      );
      console.log("Stored Profile:", localStorage.getItem("financialProfile"));
      console.log("Stored Score:", localStorage.getItem("financialScore"));
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Upload failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-blue-600 text-center">
          Upload Salary Slip
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Upload one PDF for AI financial analysis.
        </p>

        <div className="mt-10">

          <div className="border-2 border-dashed border-blue-400 rounded-xl p-10 text-center">

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFile(e.target.files[0]);
                }
              }}
            />

            {file && (
              <p className="mt-4 text-green-600 font-semibold">
                Selected: {file.name}
              </p>
            )}

          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg"
          >
            {loading ? "Analyzing..." : "Analyze with AI"}
          </button>

        </div>

      </div>

    </main>
  );
}