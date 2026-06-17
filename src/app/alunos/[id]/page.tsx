import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { RegistrarPagamentoForm } from "@/components/RegistrarPagamentoForm";
import { RegistrarCheckinForm } from "@/components/RegistrarCheckinForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function formatarData(data: Date | null) {
  if (!data) return "Sem vencimento";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function estaVencido(data: Date | null) {
  if (!data) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencimento = new Date(data);
  vencimento.setHours(0, 0, 0, 0);

  return vencimento < hoje;
}

export default async function AlunoPage({ params }: Props) {
  const { id } = await params;

  const aluno = await prisma.aluno.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      pagamentos: {
        orderBy: {
          createdAt: "desc",
        },
      },
      checkins: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!aluno) {
    notFound();
  }

  async function renovarMensalidade() {
    "use server";

    const alunoAtual = await prisma.aluno.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!alunoAtual) {
      return;
    }

    const hoje = new Date();

    const novoVencimento = new Date(
      alunoAtual.vencimento && alunoAtual.vencimento > hoje
        ? alunoAtual.vencimento
        : hoje
    );

    novoVencimento.setDate(novoVencimento.getDate() + 30);

    await prisma.pagamento.create({
      data: {
        alunoId: alunoAtual.id,
        valor: 89.9,
        status: "Pago",
      },
    });

    await prisma.aluno.update({
      where: {
        id: alunoAtual.id,
      },
      data: {
        vencimento: novoVencimento,
      },
    });

    revalidatePath(`/alunos/${id}`);
    revalidatePath("/alunos");
    revalidatePath("/dashboard");
    revalidatePath("/financeiro");

    redirect(`/alunos/${id}`);
  }

  const vencido = estaVencido(aluno.vencimento);

  const pagamentosPagos = aluno.pagamentos.filter(
    (pagamento) => pagamento.status === "Pago"
  ).length;

  const pagamentosPendentes = aluno.pagamentos.filter(
    (pagamento) => pagamento.status === "Pendente"
  ).length;

  const ultimoCheckin = aluno.checkins[0]?.createdAt ?? null;

  const receitaGerada = aluno.pagamentos
    .filter((pagamento) => pagamento.status === "Pago")
    .reduce((total, pagamento) => total + pagamento.valor, 0);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 pb-28 md:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-zinc-500">Perfil do aluno</p>

                <h1 className="mt-2 text-4xl font-bold">{aluno.nome}</h1>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-sm ${
                      vencido
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {vencido ? "Vencido" : "Ativo"}
                  </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
                    {aluno.plano}
                  </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
                    Vencimento: {formatarData(aluno.vencimento)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/alunos/${aluno.id}/editar`}
                  className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black hover:bg-zinc-200"
                >
                  Editar aluno
                </Link>

                <form action={renovarMensalidade}>
                  <button className="w-full rounded-full bg-green-500 px-6 py-3 text-center font-semibold text-white hover:bg-green-600">
                    Renovar mensalidade
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-zinc-500">Email</p>
                <p className="mt-3 font-medium">{aluno.email}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-zinc-500">Telefone</p>
                <p className="mt-3 font-medium">
                  {aluno.telefone || "Não informado"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-zinc-500">Cadastrado em</p>
                <p className="mt-3 font-medium">
                  {formatarData(aluno.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-4">
              <Card
                title="Pagamentos pagos"
                value={pagamentosPagos.toString()}
                description="Histórico financeiro"
              />

              <Card
                title="Pendentes"
                value={pagamentosPendentes.toString()}
                description="Necessitam atenção"
              />

              <Card
                title="Check-ins"
                value={aluno.checkins.length.toString()}
                description="Presenças registradas"
              />

              <Card
                title="Receita gerada"
                value={formatarMoeda(receitaGerada)}
                description="Total pago pelo aluno"
              />
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <RegistrarPagamentoForm alunoId={aluno.id} />
              <RegistrarCheckinForm alunoId={aluno.id} />
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="mb-6 text-xl font-bold">Pagamentos</h2>

                <div className="space-y-3">
                  {aluno.pagamentos.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Nenhum pagamento registrado.
                    </p>
                  ) : (
                    aluno.pagamentos.map((pagamento) => (
                      <div
                        key={pagamento.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {formatarMoeda(pagamento.valor)}
                          </p>

                          <p className="text-sm text-zinc-500">
                            {formatarData(pagamento.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            pagamento.status === "Pago"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {pagamento.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="mb-6 text-xl font-bold">Check-ins</h2>

                <div className="space-y-3">
                  {aluno.checkins.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Nenhum check-in registrado.
                    </p>
                  ) : (
                    aluno.checkins.map((checkin) => (
                      <div
                        key={checkin.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 p-4"
                      >
                        <span>
                          {new Date(checkin.createdAt).toLocaleString("pt-BR")}
                        </span>

                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                          Presente
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-bold">Resumo rápido</h2>

              <p className="mt-3 text-zinc-400">
                Último check-in:{" "}
                {ultimoCheckin
                  ? new Date(ultimoCheckin).toLocaleString("pt-BR")
                  : "Nenhum check-in registrado"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}