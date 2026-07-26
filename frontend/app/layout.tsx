import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinPilot AI — Intelligent Financial Copilot",
  description:
    "Upload salary slips or bank statements. Get instant AI-powered financial health scores, personalized investment advice, loan eligibility checks, and wealth-building strategies.",
  keywords: [
    "Financial Planning India",
    "AI Financial Advisor",
    "Salary Slip Analysis",
    "Financial Health Score",
    "SIP Calculator",
    "Loan EMI Checker",
    "Gold Investment India",
    "Budget Planner",
  ],
  openGraph: {
    title: "FinPilot AI — Intelligent Financial Copilot",
    description: "AI-powered personal finance management for India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${inter.variable} font-sans min-h-full flex flex-col bg-[#080d1a] text-slate-100 selection:bg-blue-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
