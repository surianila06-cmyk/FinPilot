"use client";

import { useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FinancialCard from "@/components/FinancialCard";
import {
  CircleDollarSign,
  Wallet,
  PiggyBank,
  Landmark,
} from "lucide-react";

interface FinancialProfile {
  monthly_income: number;
  monthly_expenses: number;
  savings: number;
  loans: number;
  insurance: number;
}

export default function Dashboard() {
  const profile = useMemo<FinancialProfile | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem("financialProfile");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const score = useMemo<number>(() => {
    if (typeof window === "undefined") return 0;

    const stored = localStorage.getItem("financialScore");

    if (!stored) return 0;

    const parsed = JSON.parse(stored);

    return typeof parsed === "object"
      ? parsed.score ?? 0
      : parsed;
  }, []);

  const healthScore = score;

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-10">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              Financial Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              AI-generated financial overview
            </p>
          </div>

          <Link href="/chat">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
              Ask FinPilot AI
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <FinancialCard
            title="Monthly Income"
            value={
              profile?.monthly_income
                ? `₹${profile.monthly_income.toLocaleString()}`
                : "Not Available"
            }
            icon={<CircleDollarSign size={32} color="#2563eb" />}
          />

          <FinancialCard
            title="Savings"
            value={
              profile?.savings
                ? `₹${profile.savings.toLocaleString()}`
                : "Not Available"
            }
            icon={<PiggyBank size={32} color="#16a34a" />}
          />

          <FinancialCard
            title="Monthly Expenses"
            value={
              profile?.monthly_expenses
                ? `₹${profile.monthly_expenses.toLocaleString()}`
                : "Not Available"
            }
            icon={<Wallet size={32} color="#ea580c" />}
          />

          <FinancialCard
            title="Loans"
            value={
              profile?.loans
                ? `₹${profile.loans.toLocaleString()}`
                : "No Active Loans"
            }
            icon={<Landmark size={32} color="#dc2626" />}
          />

        </div>

        <div className="bg-white rounded-2xl shadow-lg mt-10 p-10">

          <h2 className="text-2xl font-bold text-green-600">
            Financial Health Score
          </h2>

          <p className="text-7xl font-bold mt-8">
            {healthScore}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-5 mt-6">
            <div
              className="bg-green-500 h-5 rounded-full"
              style={{ width: `${healthScore}%` }}
            />
          </div>

          <p className="text-gray-600 mt-4 text-lg font-semibold">
            {healthScore >= 80
              ? "🟢 Excellent Financial Health"
              : healthScore >= 60
              ? "🟡 Good Financial Health"
              : healthScore >= 40
              ? "🟠 Average Financial Health"
              : "🔴 Needs Improvement"}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-lg mt-10 p-8">

          <h2 className="text-2xl font-bold text-blue-600">
            💡 AI Insights
          </h2>

          <div className="mt-6 space-y-4">

            <div className="bg-blue-50 rounded-xl p-4">
              💰 Monthly Income:{" "}
              {profile?.monthly_income
                ? `₹${profile.monthly_income.toLocaleString()}`
                : "Not Available"}
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              📊 Monthly Expenses:{" "}
              {profile?.monthly_expenses
                ? `₹${profile.monthly_expenses.toLocaleString()}`
                : "Not Available"}
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              🛡 Insurance:{" "}
              {profile?.insurance
                ? `₹${profile.insurance.toLocaleString()}`
                : "Not Available"}
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              🏦 Loan Status:{" "}
              {profile?.loans
                ? `₹${profile.loans.toLocaleString()}`
                : "No Active Loans"}
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}