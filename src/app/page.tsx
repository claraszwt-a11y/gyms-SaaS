export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
          GYMS Premium SaaS
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Gestão premium para academias que querem crescer.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Controle alunos, planos, pagamentos, check-ins,
          avaliações e retenção em uma plataforma moderna
          feita para academias profissionais.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            Entrar no painel
          </a>

          <a
            href="/login"
            className="rounded-full border border-white/15 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
          >
            Acessar conta
          </a>
        </div>
      </section>
    </main>
  );
}