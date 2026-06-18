"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Aluno = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  plano: string;
};

interface Props {
  aluno: Aluno;
}

export default function EditarAlunoForm({ aluno }: Props) {
  const router = useRouter();

  const [nome, setNome] = useState(aluno.nome);
  const [email, setEmail] = useState(aluno.email);
  const [telefone, setTelefone] = useState(aluno.telefone ?? "");
  const [plano, setPlano] = useState(aluno.plano);
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    try {
      setCarregando(true);

      const resposta = await fetch(`/api/alunos/${aluno.id}`, {
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

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar aluno");
      }

      toast.success("Aluno atualizado com sucesso!");

      router.push("/alunos");
      router.refresh();
    } catch {
      toast.error("Não foi possível atualizar o aluno.");
    } finally {
      setCarregando(false);
    }
  }

  async function excluir() {
    const confirmar = confirm(
      "Tem certeza que deseja excluir este aluno?"
    );

    if (!confirmar) return;

    try {
      setCarregando(true);

      const resposta = await fetch(`/api/alunos/${aluno.id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir aluno");
      }

      toast.success("Aluno excluído com sucesso!");

      router.push("/alunos");
      router.refresh();
    } catch {
      toast.error("Não foi possível excluir o aluno.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-5xl font-bold">Editar aluno</h1>

        <div className="space-y-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <select
            value={plano}
            onChange={(e) => setPlano(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          >
            <option>Premium</option>
            <option>Mensal</option>
            <option>Anual</option>
          </select>

          <div className="flex gap-3">
            <button
              onClick={salvar}
              disabled={carregando}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "Salvando..." : "Salvar alterações"}
            </button>

            <button
              onClick={excluir}
              disabled={carregando}
              className="rounded-xl bg-red-500/20 px-6 py-3 font-semibold text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "Aguarde..." : "Excluir aluno"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}