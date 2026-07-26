"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface FinancialProfile {
  monthly_income: number;
  monthly_expenses: number;
  savings: number;
  loans: number;
  monthly_emi?: number;
  insurance?: number;
}

interface FinancialChartsProps {
  profile: FinancialProfile | null;
  healthScore: number;
}

export default function FinancialCharts({ profile, healthScore }: FinancialChartsProps) {
  const income = profile?.monthly_income || 50000;
  const expenses = profile?.monthly_expenses || 20000;
  const emi = profile?.monthly_emi || 0;
  const surplus = Math.max(income - expenses - emi, 0);

  // Pie chart data
  const pieData = useMemo(() => [
    { name: "Living Expenses", value: expenses, color: "#f97316" }, // Orange
    { name: "Loan EMI", value: emi > 0 ? emi : 0, color: "#ef4444" }, // Red
    { name: "Monthly Savings/Surplus", value: surplus, color: "#10b981" }, // Emerald
  ].filter(d => d.value > 0), [expenses, emi, surplus]);

  // 12-Month Accumulation Projection Data
  const projectionData = useMemo(() => {
    const currentSavings = profile?.savings || 10000;
    const monthlyAddition = surplus;
    const months = ["Now", "Month 2", "Month 4", "Month 6", "Month 8", "Month 10", "1 Year"];
    
    return months.map((month, idx) => {
      const projected = currentSavings + (monthlyAddition * (idx * 2));
      return {
        month,
        "Projected Savings (₹)": Math.round(projected),
      };
    });
  }, [profile?.savings, surplus]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
      
      {/* Chart 1: Income Allocation Donut */}
      <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>📊</span> Monthly Cashflow Allocation
              </h3>
              <p className="text-xs text-slate-400">
                Breakdown of Net Income (₹{income.toLocaleString()})
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-400 border border-blue-500/30">
              Live Breakdown
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => {
                    const num = typeof val === "number" ? val : 0;
                    return [`₹${num.toLocaleString()}`, "Amount"];
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-center">
          {pieData.map((item) => (
            <div key={item.name} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-slate-400 truncate">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-200">
                ₹{item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: 12-Month Wealth Projection Area Chart */}
      <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>🚀</span> 12-Month Savings Trajectory
              </h3>
              <p className="text-xs text-slate-400">
                Estimated savings growth based on ₹{surplus.toLocaleString()}/mo surplus
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              Health Index: {healthScore}/100
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: unknown) => {
                    const num = typeof val === "number" ? val : 0;
                    return [`₹${num.toLocaleString()}`, "Projected Total"];
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Projected Savings (₹)"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#savingsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs mt-4">
          <span className="text-slate-400">💡 FinPilot Tip:</span>
          <span className="text-blue-400 font-medium">
            Invest surplus into SIP index funds to double growth compound speed.
          </span>
        </div>
      </div>

    </div>
  );
}
