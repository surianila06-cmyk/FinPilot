"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function getColor(score: number): string {
  if (score >= 85) return "#10b981"; // emerald
  if (score >= 70) return "#3b82f6"; // blue
  if (score >= 50) return "#f59e0b"; // amber
  if (score >= 30) return "#f97316"; // orange
  return "#ef4444"; // red
}

function getLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Below Avg";
  return "Critical";
}

export default function ScoreGauge({ score, size = 180, strokeWidth = 14 }: ScoreGaugeProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (score - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // We draw 270° of a circle (three quarters)
  const arc = circumference * 0.75;
  const dashOffset = arc - (arc * displayed) / 100;
  const color = getColor(score);
  const label = getLabel(score);

  // Rotation: start from 135° (bottom-left) so the arc goes 270° to bottom-right
  const rotation = 135;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="drop-shadow-lg"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Animated foreground arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${color}80)`,
              transition: "stroke-dashoffset 0.05s linear",
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "rotate(0deg)" }}
        >
          <span className="text-4xl font-black text-slate-100 leading-none tabular-nums">
            {displayed}
          </span>
          <span className="text-xs text-slate-400 mt-1">/ 100</span>
        </div>
      </div>

      <span
        className="text-sm font-bold px-3 py-1 rounded-full border"
        style={{
          color,
          borderColor: `${color}40`,
          backgroundColor: `${color}10`,
        }}
      >
        {label}
      </span>
    </div>
  );
}
