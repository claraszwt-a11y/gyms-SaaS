"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  alunoId: number;
};

export function RegistrarPagamentoForm({
  alunoId,
}: Props) {
  const router = useRouter();

  const [valor, setValor] = useState("89.90");

  async function registrarPagamento() {
    await fetch("/api/pagamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alunoId,
        valor,
        status: "Pago",
      }),
    });

    router.refresh();
    alert("Pagamento registrado!");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-4 text-xl font-bold">
        Registrar pagamento
      </h2>

      <div className="flex flex-col gap-4 md:flex-row">
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <button
          onClick={registrarPagamento}
          className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600"
        >
          Registrar pagamento
        </button>
      </div>
    </div>
  );
}