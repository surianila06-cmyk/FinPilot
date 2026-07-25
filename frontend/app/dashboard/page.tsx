"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FinancialCard from "@/components/FinancialCard";
import Navbar from "@/components/Navbar";

import {
  CircleDollarSign,
  Wallet,
  PiggyBank,
  Landmark,
} from "lucide-react";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("financialProfile");
    const storedScore = localStorage.getItem("financialScore");

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    if (storedScore) {
      setScore(JSON.parse(storedScore));
    }
  }, []);

  const healthScore = score?.score ?? score ?? 0;

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-10">

        {/* Header */}

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

        {/* Cards */}

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
              profile?.savings > 0
                ? `₹${profile.savings.toLocaleString()}`
                : "Not Available"
            }
            icon={<PiggyBank size={32} color="#16a34a" />}
          />

          <FinancialCard
            title="Monthly Expenses"
            value={
              profile?.monthly_expenses > 0
                ? `₹${profile.monthly_expenses.toLocaleString()}`
                : "Not Available"
            }
            icon={<Wallet size={32} color="#ea580c" />}
          />

          <FinancialCard
            title="Loans"
            value={
              profile?.loans > 0
                ? `₹${profile.loans.toLocaleString()}`
                : "No Active Loans"
            }
            icon={<Landmark size={32} color="#dc2626" />}
          />

        </div>

        {/* Financial Health Score */}

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
              style={{
                width: `${healthScore}%`,
              }}
            ></div>
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

          <p className="text-gray-500 mt-2">
            This score is calculated based on your income, expenses, savings,
            loans and insurance details.
          </p>

        </div>

        {/* AI Insights */}

        <div className="bg-white rounded-2xl shadow-lg mt-10 p-8">

          <h2 className="text-2xl font-bold text-blue-600">
            💡 AI Insights
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
              <span className="text-2xl">💰</span>

              <div>
                <p className="font-semibold">Monthly Income</p>

                <p className="text-gray-600">
                  {profile?.monthly_income
                    ? `₹${profile.monthly_income.toLocaleString()}`
                    : "Not Available"}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl">
              <span className="text-2xl">📊</span>

              <div>
                <p className="font-semibold">
                  Estimated Monthly Expenses
                </p>

                <p className="text-gray-600">
                  {profile?.monthly_expenses
                    ? `₹${profile.monthly_expenses.toLocaleString()}`
                    : "Not Available"}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
              <span className="text-2xl">🛡</span>

              <div>
                <p className="font-semibold">Insurance</p>

                <p className="text-gray-600">
                  {profile?.insurance
                    ? `₹${profile.insurance.toLocaleString()}`
                    : "Not Available"}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
              <span className="text-2xl">🏦</span>

              <div>
                <p className="font-semibold">Loan Status</p>

                <p className="text-gray-600">
                  {profile?.loans > 0
                    ? `Outstanding Loan: ₹${profile.loans.toLocaleString()}`
                    : "No Active Loans"}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* AI Financial Summary */}

<div className="bg-white rounded-2xl shadow-lg mt-10 p-8">

  <h2 className="text-2xl font-bold text-blue-600">
    AI Financial Summary
  </h2>

  <div className="mt-5 space-y-4">

    <div className="bg-blue-50 rounded-xl p-4">
      ✅ Stable Monthly Income Detected
    </div>

    <div className="bg-green-50 rounded-xl p-4">
      ✅ Financial Health Score: {healthScore}/100
    </div>

    <div className="bg-yellow-50 rounded-xl p-4">
      💡 Build an emergency fund covering at least 6 months of expenses.
    </div>

    <div className="bg-purple-50 rounded-xl p-4">
      📈 Continue monitoring your income and spending using FinPilot AI.
    </div>

  </div>

</div>

       

      </div>

    </main>
  );
}