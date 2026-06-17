import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/Sidebar";
import { calcularFinanceiro } from "@/services/financeiro.service";
import { formatarMoeda } from "@/utils/formatarMoeda";

export default async function FinanceiroPage() {
  const pagamentos = await prisma.pagamento.findMany({
    include: {
      aluno: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  async function marcarComoPago(id: number) {
    "use server";

    await prisma.pagamento.update({
      where: {
        id,
      },
      data: {
        status: "Pago",
      },
    });
  }

  const {
    totalPagamentos,
    receitaRecebida,
    receitaPendente,
  } = calcularFinanceiro(pagamentos);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 pb-28 md:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Gestão financeira
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                  Financeiro
                </h1>
              </div>

              <Link
                href="/dashboard"
                className="rounded-full bg-white px-6 py-3 font-semibold text-black"
              >
                Dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-zinc-500">
                  Receita recebida
                </p>

                <h2 className="mt-4 text-3xl font-bold text-green-400">
                  {formatarMoeda(receitaRecebida)}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-zinc-500">
                  Receita pendente
                </p>

                <h2 className="mt-4 text-3xl font-bold text-yellow-400">
                  {formatarMoeda(receitaPendente)}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-zinc-500">
                  Total de pagamentos
                </p>

                <h2 className="mt-4 text-3xl font-bold">
                  {totalPagamentos}
                </h2>
              </div>
            </div>

            <div className="mt-10 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
              <table className="w-full min-w-[700px]">
                <thead className="border-b border-white/10 text-zinc-400">
                  <tr>
                    <th className="p-5 text-left font-medium">
                      Aluno
                    </th>

                    <th className="p-5 text-left font-medium">
                      Valor
                    </th>

                    <th className="p-5 text-left font-medium">
                      Status
                    </th>

                    <th className="p-5 text-left font-medium">
                      Ação
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pagamentos.map((pagamento) => (
                    <tr
                      key={pagamento.id}
                      className="border-b border-white/5"
                    >
                      <td className="p-5">
                        {pagamento.aluno.nome}
                      </td>

                      <td className="p-5">
                        {formatarMoeda(pagamento.valor)}
                      </td>

                      <td className="p-5">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            pagamento.status === "Pago"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {pagamento.status}
                        </span>
                      </td>

                      <td className="p-5">
                        {pagamento.status === "Pendente" ? (
                          <form
                            action={marcarComoPago.bind(
                              null,
                              pagamento.id
                            )}
                          >
                            <button className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600">
                              Marcar como pago
                            </button>
                          </form>
                        ) : (
                          <span className="text-sm text-zinc-500">
                            Pago
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}