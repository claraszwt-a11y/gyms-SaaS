import Link from "next/link";
import Image from "next/image";
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

function formatarDataHora(data: Date) {
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

  const ranking = await prisma.aluno.findMany({
    include: {
      _count: {
        select: {
          checkins: true,
        },
      },
    },
    orderBy: {
      checkins: {
        _count: "desc",
      },
    },
    take: 5,
  });

  async function renovarMensalidade() {
    "use server";

    const alunoAtual = await prisma.aluno.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!alunoAtual) return;

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

  const telefoneLimpo = aluno.telefone?.replace(/\D/g, "");

  const mensagemWhatsApp = encodeURIComponent(
    `Olá ${aluno.nome}! Tudo bem? Aqui é da GYMS Premium. Sua mensalidade está com vencimento em ${formatarData(
      aluno.vencimento
    )}.`
  );

  const timeline = [
    {
      id: `cadastro-${aluno.id}`,
      icone: "👤",
      titulo: "Aluno cadastrado",
      descricao: `Plano ${aluno.plano}`,
      data: aluno.createdAt,
    },
    ...aluno.pagamentos.map((pagamento) => ({
      id: `pagamento-${pagamento.id}`,
      icone: pagamento.status === "Pago" ? "💰" : "⚠️",
      titulo:
        pagamento.status === "Pago"
          ? `Pagamento recebido: ${formatarMoeda(pagamento.valor)}`
          : `Pagamento pendente: ${formatarMoeda(pagamento.valor)}`,
      descricao: `Status: ${pagamento.status}`,
      data: pagamento.createdAt,
    })),
    ...aluno.checkins.map((checkin) => ({
      id: `checkin-${checkin.id}`,
      icone: "✅",
      titulo: "Check-in realizado",
      descricao: "Presença registrada na academia",
      data: checkin.createdAt,
    })),
  ].sort((a, b) => b.data.getTime() - a.data.getTime());

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 pb-28 md:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-lime-400/20 bg-gradient-to-br from-lime-400/10 via-white/[0.03] to-white/[0.02] p-6 shadow-2xl shadow-lime-500/5">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-lime-400/30 bg-lime-400/10 text-5xl font-black text-lime-400">
                    {aluno.foto ? (
                      <Image
                        src={aluno.foto}
                        alt={aluno.nome}
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      aluno.nome.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">Perfil premium</p>

                    <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                      {aluno.nome}
                    </h1>

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
                        Plano {aluno.plano}
                      </span>

                      <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
                        Vencimento: {formatarData(aluno.vencimento)}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-black/30 p-4">
                        <p className="text-xs text-zinc-500">Email</p>
                        <p className="mt-1 font-medium">{aluno.email}</p>
                      </div>

                      <div className="rounded-2xl bg-black/30 p-4">
                        <p className="text-xs text-zinc-500">Telefone</p>
                        <p className="mt-1 font-medium">
                          {aluno.telefone || "Não informado"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-black/30 p-4">
                        <p className="text-xs text-zinc-500">Membro desde</p>
                        <p className="mt-1 font-medium">
                          {formatarData(aluno.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/alunos/${aluno.id}/editar`}
                    className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black hover:bg-zinc-200"
                  >
                    Editar aluno
                  </Link>

                  {telefoneLimpo && (
                    <a
                      href={`https://wa.me/55${telefoneLimpo}?text=${mensagemWhatsApp}`}
                      target="_blank"
                      className="rounded-full bg-lime-500 px-6 py-3 text-center font-semibold text-black hover:bg-lime-400"
                    >
                      Cobrar no WhatsApp
                    </a>
                  )}

                  <form action={renovarMensalidade}>
                    <button className="w-full rounded-full bg-green-500 px-6 py-3 text-center font-semibold text-white hover:bg-green-600">
                      Renovar mensalidade
                    </button>
                  </form>
                </div>
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
                <h2 className="mb-6 text-xl font-bold">Timeline do aluno</h2>

                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400/10 text-xl">
                        {item.icone}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{item.titulo}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {item.descricao}
                        </p>
                      </div>

                      <span className="text-xs text-zinc-500">
                        {formatarDataHora(item.data)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-bold">Observações internas</h2>

                <p className="mt-4 text-zinc-400">
                  {aluno.observacoes ||
                    "Nenhuma observação cadastrada para este aluno."}
                </p>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-6">
                  <h2 className="text-xl font-bold">Resumo rápido</h2>

                  <p className="mt-3 text-zinc-400">
                    Último check-in:{" "}
                    {ultimoCheckin
                      ? new Date(ultimoCheckin).toLocaleString("pt-BR")
                      : "Nenhum check-in registrado"}
                  </p>

                  <p className="mt-3 text-zinc-400">
                    Receita gerada: {formatarMoeda(receitaGerada)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-bold">🏆 Ranking da academia</h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Alunos mais frequentes
                </p>

                <div className="mt-6 space-y-3">
                  {ranking.map((alunoRanking, index) => (
                    <div
                      key={alunoRanking.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          #{index + 1} {alunoRanking.nome}
                        </p>

                        <p className="text-xs text-zinc-500">Frequência</p>
                      </div>

                      <p className="text-xl font-bold text-lime-400">
                        {alunoRanking._count.checkins}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 p-6">
                <h2 className="text-xl font-bold text-lime-400">
                  Destaque da academia
                </h2>

                <p className="mt-4 text-zinc-300">
                  {ranking[0]
                    ? `${ranking[0].nome} lidera com ${ranking[0]._count.checkins} check-ins.`
                    : "Ainda não há check-ins registrados."}
                </p>
              </div>
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
          </div>
        </section>
      </div>
    </main>
  );
}