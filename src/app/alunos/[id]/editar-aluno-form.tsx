"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  aluno: any;
}

export default function EditarAlunoForm({
  aluno,
}: Props) {
  const router = useRouter();

  const [nome, setNome] = useState(aluno.nome);
  const [email, setEmail] = useState(aluno.email);
  const [telefone, setTelefone] = useState(
    aluno.telefone
  );
  const [plano, setPlano] = useState(aluno.plano);

  async function salvar() {
    await fetch(`/api/alunos/${aluno.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        telefone,
        plano,
      }),
    });

    alert("Aluno atualizado!");

    router.push("/alunos");
    router.refresh();
  }

  async function excluir() {
    const confirmar = confirm(
      "Tem certeza que deseja excluir este aluno?"
    );

    if (!confirmar) return;

    await fetch(`/api/alunos/${aluno.id}`, {
      method: "DELETE",
    });

    alert("Aluno excluído!");

    router.push("/alunos");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          Editar aluno
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="text"
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

          <div className="flex gap-3">
            <button
              onClick={salvar}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black"
            >
              Salvar alterações
            </button>

            <button
              onClick={excluir}
              className="rounded-xl bg-red-500/20 px-6 py-3 font-semibold text-red-400"
            >
              Excluir aluno
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}