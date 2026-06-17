import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/Sidebar";
import { AlunosTable } from "@/components/AlunosTable";
import { Card } from "@/components/Card";
import { calcularResumoAlunos } from "@/services/aluno.service";

export default async function AlunosPage() {
  const alunos = await prisma.aluno.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const {
    totalAlunos,
    alunosAtivos,
    alunosVencidos,
    alunosPremium,
    taxaInadimplencia,
  } = calcularResumoAlunos(alunos);

  const cards = [
    [
      "Total de alunos",
      totalAlunos.toString(),
      "Cadastrados no sistema",
    ],
    [
      "Alunos ativos",
      alunosAtivos.toString(),
      "Mensalidades em dia",
    ],
    [
      "Alunos vencidos",
      alunosVencidos.toString(),
      "Precisam de atenção",
    ],
    [
      "Plano Premium",
      alunosPremium.toString(),
      "Plano mais usado",
    ],
    [
      "Inadimplência",
      `${taxaInadimplencia}%`,
      "Taxa atual",
    ],
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 pb-28 md:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Gestão de alunos
                </p>

                <h1 className="text-4xl font-bold">
                  Alunos
                </h1>
              </div>

              <Link
                href="/alunos/novo"
                className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black hover:bg-zinc-200"
              >
                + Novo aluno
              </Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-5">
              {cards.map(([label, value, detail]) => (
                <Card
                  key={label}
                  title={label}
                  value={value}
                  description={detail}
                />
              ))}
            </div>

            <AlunosTable alunos={alunos} />
          </div>
        </section>
      </div>
    </main>
  );
}