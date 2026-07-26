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
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />

      <div className="p-10">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-blue-600">
              Financial Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back! Here's your financial overview.
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
            value="₹75,000"
            icon={<CircleDollarSign size={32} color="#2563eb" />}
          />

          <FinancialCard
            title="Savings"
            value="₹2,50,000"
            icon={<PiggyBank size={32} color="#16a34a" />}
          />

          <FinancialCard
            title="Monthly Expenses"
            value="₹30,000"
            icon={<Wallet size={32} color="#ea580c" />}
          />

          <FinancialCard
            title="Loans"
            value="₹5,00,000"
            icon={<Landmark size={32} color="#dc2626" />}
          />

        </div>

        {/* Health Score */}

        <div className="bg-white rounded-2xl shadow-lg mt-10 p-10">

          <h2 className="text-2xl font-bold text-green-600">
            Financial Health Score
          </h2>

          <p className="text-7xl font-bold mt-8">
            84
          </p>

          <div className="w-full bg-gray-200 rounded-full h-5 mt-6">

            <div
              className="bg-green-500 h-5 rounded-full"
              style={{ width: "84%" }}
            ></div>

          </div>

          <p className="text-gray-500 mt-4">
            Excellent Financial Stability
          </p>

        </div>

      </div>

    </main>
  );
}