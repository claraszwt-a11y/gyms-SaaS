"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { nome: "Jan", alunos: 20 },
  { nome: "Fev", alunos: 35 },
  { nome: "Mar", alunos: 42 },
  { nome: "Abr", alunos: 55 },
  { nome: "Mai", alunos: 70 },
];

export default function DashboardCharts() {
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