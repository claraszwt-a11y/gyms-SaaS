export default function PlanosPage() {
  const planos = [
    {
      nome: "Mensal",
      preco: "R$ 129,90",
      alunos: 248,
      status: "Ativo",
    },
    {
      nome: "Trimestral",
      preco: "R$ 349,90",
      alunos: 164,
      status: "Ativo",
    },
    {
      nome: "Anual Premium",
      preco: "R$ 1.199,90",
      alunos: 96,
      status: "Mais vendido",
    },
    {
      nome: "Personal Trainer",
      preco: "R$ 499,90",
      alunos: 42,
      status: "Ativo",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050505] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Gestão comercial</p>
            <h1 className="text-4xl font-bold">Planos</h1>
          </div>

          <button className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200">
            + Novo plano
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{plano.nome}</h2>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                  {plano.status}
                </span>
              </div>

              <p className="mt-6 text-3xl font-bold">{plano.preco}</p>

              <p className="mt-2 text-sm text-zinc-500">por aluno</p>

              <div className="mt-8 rounded-2xl bg-black/30 p-4">
                <p className="text-sm text-zinc-500">Alunos nesse plano</p>
                <p className="mt-2 text-2xl font-bold">{plano.alunos}</p>
              </div>

              <button className="mt-6 w-full rounded-full border border-white/10 py-3 font-medium text-zinc-300 hover:bg-white/10 hover:text-white">
                Editar plano
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}