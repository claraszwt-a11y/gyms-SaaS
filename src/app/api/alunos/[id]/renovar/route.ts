import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const aluno = await prisma.aluno.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!aluno) {
    return NextResponse.json(
      { error: "Aluno não encontrado" },
      { status: 404 }
    );
  }

  const hoje = new Date();

  const novoVencimento = new Date(
    aluno.vencimento && aluno.vencimento > hoje
      ? aluno.vencimento
      : hoje
  );

  novoVencimento.setDate(novoVencimento.getDate() + 30);

  await prisma.pagamento.create({
    data: {
      alunoId: aluno.id,
      valor: 89.9,
      status: "Pago",
    },
  });

  await prisma.aluno.update({
    where: {
      id: aluno.id,
    },
    data: {
      vencimento: novoVencimento,
    },
  });

  return NextResponse.json({
    success: true,
    vencimento: novoVencimento,
  });
}