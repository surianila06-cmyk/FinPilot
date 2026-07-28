"use client";

import { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import type { FinancialProfile } from "@/types/financial";

interface FinancialChartsProps {
  profile: FinancialProfile | null;
  healthScore: number;
}

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(8, 13, 26, 0.97)",
  borderColor: "rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#f1f5f9",
  fontSize: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

export default function FinancialCharts({ profile, healthScore }: FinancialChartsProps) {
  const income = profile?.monthly_income ?? 0;
  const expenses = profile?.monthly_expenses ?? 0;
  const emi = profile?.monthly_emi ?? 0;
  const insurance = profile?.insurance ?? 0;
  const surplus = Math.max(income - expenses - emi, 0);
  const savings = profile?.savings ?? 0;

  // ── Pie Chart: Income Allocation ─────────────────────────────────────
  const pieData = useMemo(
    () =>
      [
        { name: "Living Expenses", value: expenses, color: "#f97316" },
        { name: "Loan EMI", value: emi, color: "#ef4444" },
        { name: "Insurance", value: insurance, color: "#8b5cf6" },
        { name: "Surplus / Savings", value: surplus, color: "#10b981" },
      ].filter((d) => d.value > 0),
    [expenses, emi, insurance, surplus]
  );

  // ── Area Chart: 12-Month Savings Trajectory ───────────────────────────
  const projectionData = useMemo(() => {
    const labels = ["Now", "2M", "4M", "6M", "8M", "10M", "12M"];
    return labels.map((month, i) => ({
      month,
      "Savings (₹)": Math.round(savings + surplus * i * 2),
    }));
  }, [savings, surplus]);

  // ── Bar Chart: Monthly Breakdown ──────────────────────────────────────
  const barData = useMemo(
    () => [
      { category: "Income", amount: income, fill: "#3b82f6" },
      { category: "Expenses", amount: expenses, fill: "#f97316" },
      { category: "EMI", amount: emi, fill: "#ef4444" },
      { category: "Surplus", amount: surplus, fill: "#10b981" },
    ],
    [income, expenses, emi, surplus]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">

      {/* ── Chart 1: Donut (2/3 width on large) ── */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-6 flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            📊 Income Allocation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">₹{income.toLocaleString()} / month</p>
        </div>

        <div className="h-52 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    stroke="rgba(8,13,26,0.8)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: unknown) => [`₹${Number(v).toLocaleString()}`, "Amount"]}
                contentStyle={TOOLTIP_STYLE}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 space-y-1.5">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold text-slate-200">₹{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart 2: Area Chart ── */}
      <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              🚀 12-Month Savings Trajectory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Projecting ₹{surplus.toLocaleString()}/mo surplus
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            Score: {healthScore}/100
          </span>
        </div>

        <div className="h-52 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: unknown) => [`₹${Number(v).toLocaleString()}`, "Projected"]}
                contentStyle={TOOLTIP_STYLE}
              />
              <Area
                type="monotone"
                dataKey="Savings (₹)"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#savingsGrad)"
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "#60a5fa" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar mini-chart */}
        <div className="mt-6 pt-5 border-t border-slate-800/60">
          <h4 className="text-xs font-semibold text-slate-400 mb-3">📉 Monthly Breakdown</h4>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="category" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: unknown) => [`₹${Number(v).toLocaleString()}`, "Amount"]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
