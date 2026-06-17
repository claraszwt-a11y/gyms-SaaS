import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const aluno = await prisma.aluno.create({
    data: {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      plano: body.plano,
      vencimento: body.vencimento
        ? new Date(body.vencimento)
        : null,
      ativo: true,
    },
  });

  await prisma.pagamento.create({
    data: {
      valor:
        body.plano === "Premium"
          ? 89.9
          : body.plano === "Mensal"
          ? 59.9
          : 299.9,
      status: "Pendente",
      alunoId: aluno.id,
    },
  });

  return NextResponse.json(aluno);
}