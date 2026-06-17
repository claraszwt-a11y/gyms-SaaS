"use client";

import {
  ResponsiveContainer,
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

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="nome" />
            <Tooltip />
           <Bar
  dataKey="alunos"
  fill="#22c55e"
  radius={[10, 10, 0, 0]}
/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}