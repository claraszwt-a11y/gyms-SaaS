"use client";

import { BarChart, Bar, XAxis, Tooltip } from "recharts";

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
      <h2 className="mb-4 text-xl font-bold">
        Crescimento da academia
      </h2>

      <div className="w-full overflow-x-auto">
        <BarChart width={760} height={288} data={data}>
          <XAxis dataKey="nome" />
          <Tooltip />
          <Bar
            dataKey="alunos"
            fill="#22c55e"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </div>
    </div>
  );
}