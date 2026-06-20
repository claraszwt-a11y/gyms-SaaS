import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/Card";
import { calcularDashboard } from "@/services/dashboard.service";
import DashboardCharts from "@/components/DashboardCharts";

function gerarDadosGrafico(alunos: { createdAt: Date }[]) {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const totalAlunos = alunos.length;

  return meses.map((mes, index) => {
    const base = Math.max(1, totalAlunos - (5 - index));

    return {
      nome: mes,
      alunos: index === meses.length - 1 ? totalAlunos : base,
    };
  });
}

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data));
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function DashboardPage() {
  const alunos = await prisma.aluno.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const ultimosAlunos = await prisma.aluno.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const ultimosPagamentos = await prisma.pagamento.findMany({
    include: {
      aluno: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const ultimosCheckins = await prisma.checkin.findMany({
    include: {
      aluno: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const alunosComCheckins = await prisma.aluno.findMany({
    include: {
      checkins: true,
    },
  });

  const rankingFrequencia = alunosComCheckins
    .map((aluno) => ({
      nome: aluno.nome,
      total: aluno.checkins.length,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const {
    totalAlunos,
    alunosAtivos,
    alunosVencidos,
    alunosPremium,
    receitaPrevista,
  } = calcularDashboard(alunos);

  const dadosGrafico = gerarDadosGrafico(alunos);

  const atividades = [
    ...ultimosAlunos.map((aluno) => ({
      id: `aluno-${aluno.id}`,
      tipo: "Aluno",
      titulo: `${aluno.nome} foi cadastrado`,
      descricao: `Plano ${aluno.plano}`,
      data: aluno.createdAt,
      icone: "➕",
    })),
    ...ultimosPagamentos.map((pagamento) => ({
      id: `pagamento-${pagamento.id}`,
      tipo: "Pagamento",
      titulo: `${pagamento.aluno.nome} pagou ${formatarMoeda(
        pagamento.valor
      )}`,
      descricao: pagamento.status,
      data: pagamento.createdAt,
      icone: "💰",
    })),
    ...ultimosCheckins.map((checkin) => ({
      id: `checkin-${checkin.id}`,
      tipo: "Check-in",
      titulo: `${checkin.aluno.nome} realizou check-in`,
      descricao: "Presença registrada",
      data: checkin.createdAt,
      icone: "✅",
    })),
  ]
    .sort((a, b) => b.data.getTime() - a.data.getTime())
    .slice(0, 6);

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
              className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-black transition hover:bg-white"
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
            <DashboardCharts data={dadosGrafico} />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Últimas atividades</h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Movimentações recentes da academia
                  </p>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                  Ao vivo
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {atividades.map((atividade) => (
                  <div
                    key={atividade.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400/10 text-xl">
                      {atividade.icone}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{atividade.titulo}</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {atividade.tipo} • {atividade.descricao}
                      </p>
                    </div>

                    <span className="text-xs text-zinc-500">
                      {formatarData(atividade.data)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-xl font-bold">Alertas inteligentes</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Pontos que precisam de atenção
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-medium">
                    {alunosVencidos} alunos vencidos
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">Financeiro</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-medium">{alunosAtivos} alunos ativos</p>
                  <p className="mt-1 text-xs text-zinc-500">Operação</p>
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

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
              <h3 className="text-xl font-bold">🏆 Ranking de frequência</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Alunos mais presentes na academia
              </p>

              <div className="mt-6 space-y-3">
                {rankingFrequencia.map((aluno, index) => (
                  <div
                    key={`${aluno.nome}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 font-bold text-lime-400">
                        #{index + 1}
                      </div>

                      <div>
                        <p className="font-medium">{aluno.nome}</p>
                        <p className="text-xs text-zinc-500">Frequência</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-lime-400">
                        {aluno.total}
                      </p>
                      <p className="text-xs text-zinc-500">check-ins</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 p-6">
              <h3 className="text-xl font-bold text-lime-400">
                Destaque do mês
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                {rankingFrequencia[0]
                  ? `${rankingFrequencia[0].nome} lidera com ${rankingFrequencia[0].total} check-ins.`
                  : "Ainda não há check-ins suficientes."}
              </p>

              <div className="mt-6 rounded-2xl bg-black/30 p-4">
                <p className="text-sm text-zinc-500">Engajamento</p>
                <p className="mt-2 text-3xl font-bold">
                  {rankingFrequencia.reduce(
                    (total, aluno) => total + aluno.total,
                    0
                  )}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  check-ins registrados
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}