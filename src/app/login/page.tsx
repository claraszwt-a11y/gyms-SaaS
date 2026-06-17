"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function entrar() {
    if (email === "admin@gyms.com" && senha === "123456") {
  document.cookie = "gyms-auth=true; path=/";
  router.push("/dashboard");
  return;
}

    alert("Email ou senha incorretos");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] p-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-4xl font-bold">GYMS</h1>
        <p className="mt-2 text-zinc-500">
          Acesse o painel da academia
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <button
            onClick={entrar}
            className="w-full rounded-xl bg-white p-4 font-semibold text-black"
          >
            Entrar
          </button>
        </div>
      </div>
    </main>
  );
}