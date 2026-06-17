"use client";

import Link from "next/link";
import { useState } from "react";

type Aluno = {
  id: number;
  nome: string;
  plano: string;
  vencimento: Date | string | null;
};

type Props = {
  alunos: Aluno[];
};

function formatarData(data: Date | string | null) {
  if (!data) return "Sem vencimento";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
}

function estaVencido(data: Date | string | null) {
  if (!data) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencimento = new Date(data);
  vencimento.setHours(0, 0, 0, 0);

  return vencimento < hoje;
}

export function AlunosTable({ alunos }: Props) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

 const alunosFiltrados = alunos.filter((aluno) => {
  const nomeMatch = aluno.nome
    .toLowerCase()
    .includes(busca.toLowerCase());

  const vencido = estaVencido(aluno.vencimento);

  if (filtro === "ativos") {
    return nomeMatch && !vencido;
  }

  if (filtro === "vencidos") {
    return nomeMatch && vencido;
  }

  return nomeMatch;
});

  return (
    <>
      <div className="mt-8">
        <input
          type="text"
          placeholder="Buscar aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
        />
      </div>
      
      <div className="mt-4 flex gap-3">
  <button
    onClick={() => setFiltro("todos")}
    className="rounded-xl border border-white/10 px-4 py-2"
  >
    Todos
  </button>

  <button
    onClick={() => setFiltro("ativos")}
    className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-green-400"
  >
    Ativos
  </button>

  <button
    onClick={() => setFiltro("vencidos")}
    className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400"
  >
    Vencidos
  </button>
</div>

      <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-white/10 text-zinc-400">
            <tr>
              <th className="p-5 text-left font-medium">Nome</th>
              <th className="p-5 text-left font-medium">Plano</th>
              <th className="p-5 text-left font-medium">Status</th>
              <th className="p-5 text-left font-medium">Vencimento</th>
            </tr>
          </thead>

          <tbody>
            {alunosFiltrados.map((aluno) => {
              const vencido = estaVencido(aluno.vencimento);

              return (
                <tr
                  key={aluno.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="p-5 font-medium">
                    <Link
                      href={`/alunos/${aluno.id}`}
                      className="hover:underline"
                    >
                      {aluno.nome}
                    </Link>
                  </td>

                  <td className="p-5 text-zinc-400">{aluno.plano}</td>

                  <td className="p-5">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        vencido
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {vencido ? "Vencido" : "Ativo"}
                    </span>
                  </td>

                  <td className="p-5 text-zinc-400">
                    {formatarData(aluno.vencimento)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}