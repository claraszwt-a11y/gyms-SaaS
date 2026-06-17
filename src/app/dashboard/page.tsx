import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/Card";
import { calcularDashboard } from "@/services/dashboard.service";
import DashboardCharts from "@/components/DashboardCharts";

export default async function DashboardPage() {
  const alunos = await prisma.aluno.findMany();

  const {
    totalAlunos,
    alunosAtivos,
    alunosVencidos,
    alunosPremium,
    receitaPrevista,
  } = calcularDashboard(alunos);

  const cards = [
    ["Total de alunos", totalAlunos.toString(), "Alunos cadastrados"],
    ["Alunos ativos", alunosAtivos.toString(), "Mensalidades em dia"],
    ["Alunos vencidos", alunosVencidos.toString(), "Precisam de atenção"],
    [
      "Receita prevista",
      receitaPrevista.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      "Baseada nos alunos ativos",
    ],
  ];
  [
  "Alunos Premium",
  alunosPremium.toString(),
  "Plano mais vendido",
]
  
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 pb-28 md:p-10">
          <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-zinc-500">
                Bem-vinda ao GYMS Premium
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                Dashboard executivo
              </h2>
            </div>

            <Link
              href="/alunos/novo"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Novo aluno
            </Link>
          </header>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {cards.map(([label, value, detail]) => (
              <Card
                key={label}
                title={label}
                value={value}
                description={detail}
              />
            ))}
          </div>

          <div className="mt-8">
            <DashboardCharts />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    Visão da academia
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Dados reais puxados do banco
                  </p>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                  Hoje
                </span>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-black/30 p-5">
                  <p className="text-sm text-zinc-500">
                    Plano Premium
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {alunosPremium}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/30 p-5">
                  <p className="text-sm text-zinc-500">
                    Taxa ativa
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {totalAlunos === 0
                      ? "0%"
                      : `${Math.round(
                          (alunosAtivos / totalAlunos) * 100
                        )}%`}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/30 p-5">
                  <p className="text-sm text-zinc-500">
                    Atenção financeira
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {alunosVencidos}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-xl font-bold">
                Alertas inteligentes
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Pontos que precisam de atenção
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-medium">
                    {alunosVencidos} alunos vencidos
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Financeiro
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-medium">
                    {alunosAtivos} alunos ativos
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Operação
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-medium">
                    Receita prevista de{" "}
                    {receitaPrevista.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Previsão mensal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}