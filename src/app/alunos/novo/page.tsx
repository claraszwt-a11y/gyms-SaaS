"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NovoAlunoPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [plano, setPlano] = useState("Premium");
  const [vencimento, setVencimento] = useState("");

  async function criarAluno() {
    await fetch("/api/alunos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nome,
        email,
        telefone,
        plano,
        vencimento,
      }),
    });

    router.push("/alunos");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold">
          Novo aluno
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) =>
              setTelefone(e.target.value)
            }
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <select
            value={plano}
            onChange={(e) =>
              setPlano(e.target.value)
            }
            className="w-full rounded-xl bg-zinc-900 p-4"
          >
            <option>Premium</option>
            <option>Mensal</option>
            <option>Anual</option>
          </select>

          <input
            type="date"
            value={vencimento}
            onChange={(e) =>
              setVencimento(e.target.value)
            }
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <button
            onClick={criarAluno}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            Criar aluno
          </button>
        </div>
      </div>
    </main>
  );
}