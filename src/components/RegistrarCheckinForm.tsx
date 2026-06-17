"use client";

import { useRouter } from "next/navigation";

type Props = {
  alunoId: number;
};

export function RegistrarCheckinForm({ alunoId }: Props) {
  const router = useRouter();

  async function registrarCheckin() {
    await fetch("/api/checkins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alunoId,
      }),
    });

    router.refresh();
    alert("Check-in registrado!");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xl font-bold">
        Registrar check-in
      </h2>

      <p className="mt-2 text-sm text-zinc-500">
        Registrar presença deste aluno na academia.
      </p>

      <button
        onClick={registrarCheckin}
        className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
      >
        Registrar check-in
      </button>
    </div>
  );
}