import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Sidebar } from "@/components/Sidebar";

export default async function CheckinsPage() {
  const alunos = await prisma.aluno.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  const checkins = await prisma.checkin.findMany({
    include: {
      aluno: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

 async function fazerCheckin(formData: FormData) {
  "use server";

  const alunoId = Number(formData.get("alunoId"));

  const aluno = await prisma.aluno.findUnique({
    where: {
      id: alunoId,
    },
  });

  if (!aluno) {
    return;
  }

  if (aluno.vencimento) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(aluno.vencimento);
    vencimento.setHours(0, 0, 0, 0);

    if (vencimento < hoje) {
      return;
    }
  }

  await prisma.checkin.create({
    data: {
      alunoId,
    },
  });

  revalidatePath("/checkins");
  revalidatePath(`/alunos/${alunoId}`);
}
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 pb-28 md:p-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm text-zinc-500">
              Gestão de presença
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Check-ins
            </h1>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-bold">
                Registrar check-in
              </h2>

              <form
                action={fazerCheckin}
                className="mt-6 flex flex-col gap-4 md:flex-row"
              >
                <select
                  name="alunoId"
                  className="flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3"
                >
                  {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>

                <button className="rounded-2xl bg-white px-6 py-3 font-semibold text-black">
                  Fazer check-in
                </button>
              </form>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Últimos check-ins
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Movimentação da academia
                  </p>
                </div>

                <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
                  {checkins.length} check-ins
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {checkins.map((checkin) => (
                  <div
                    key={checkin.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {checkin.aluno.nome}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {new Intl.DateTimeFormat("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(checkin.createdAt))}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                      Presente
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}