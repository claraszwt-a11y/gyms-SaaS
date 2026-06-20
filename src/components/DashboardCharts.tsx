"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  nome: string;
  alunos: number;
};

type Props = {
  data: ChartData[];
};

export default function DashboardCharts({ data }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        Crescimento da academia
      </h2>

      <div className="h-[350px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    ...
  </ResponsiveContainer>
</div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 30,
              right: 30,
              left: 10,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="nome"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#a1a1aa",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#7CFF5B",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                color: "#fff",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
              labelStyle={{
                color: "#ffffff",
                fontWeight: 700,
              }}
              itemStyle={{
                color: "#7CFF5B",
                fontWeight: 700,
              }}
            />

            <Line
              type="monotone"
              dataKey="alunos"
              stroke="#7CFF5B"
              strokeWidth={4}
              dot={{
                r: 5,
                fill: "#7CFF5B",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                fill: "#7CFF5B",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}