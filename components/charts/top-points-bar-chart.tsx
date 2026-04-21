"use client";

import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

type ChartPoint = { piloto: string; pontos: number };

type Props = {
  data: ChartPoint[];
  isDarkMode: boolean;
  chartGrid: string;
  chartAxis: string;
  chartBar: string;
  darkChartBar: string;
};

export default function TopPointsBarChart({
  data,
  isDarkMode,
  chartGrid,
  chartAxis,
  chartBar,
  darkChartBar,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid
          stroke={isDarkMode ? "rgba(255,255,255,0.08)" : chartGrid}
          strokeDasharray="3 3"
        />
        <XAxis dataKey="piloto" stroke={isDarkMode ? "#9ca3af" : chartAxis} />
        <YAxis stroke={isDarkMode ? "#9ca3af" : chartAxis} />
        <Tooltip
          contentStyle={{
            background: isDarkMode ? "#111827" : "#ffffff",
            border: isDarkMode
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid rgba(15,23,42,0.08)",
            color: isDarkMode ? "#ffffff" : "#111827",
            borderRadius: 16,
          }}
        />
        <Bar dataKey="pontos" fill={isDarkMode ? darkChartBar : chartBar} radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
