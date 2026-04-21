"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

type RadarPoint = { metric: string; A: number; B: number };

type Props = {
  data: RadarPoint[];
  nameA: string;
  nameB: string;
  isDarkMode: boolean;
  chartBar: string;
};

export default function DuelRadarChart({ data, nameA, nameB, isDarkMode, chartBar }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: isDarkMode ? "#a1a1aa" : "#71717a", fontSize: 11 }}
        />
        <Radar
          name={nameA}
          dataKey="A"
          stroke={chartBar || "#f97316"}
          fill={chartBar || "#f97316"}
          fillOpacity={0.3}
        />
        <Radar name={nameB} dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
