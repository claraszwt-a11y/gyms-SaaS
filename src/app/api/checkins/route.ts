import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const alunoId = Number(body.alunoId);

  if (!alunoId) {
    return NextResponse.json(
      { error: "Aluno inválido" },
      { status: 400 }
    );
  }

  const aluno = await prisma.aluno.findUnique({
    where: {
      id: alunoId,
    },
  });

  if (!aluno) {
    return NextResponse.json(
      { error: "Aluno não encontrado" },
      { status: 404 }
    );
  }

  if (aluno.vencimento) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(aluno.vencimento);
    vencimento.setHours(0, 0, 0, 0);

    if (vencimento < hoje) {
      return NextResponse.json(
        { error: "Mensalidade vencida" },
        { status: 400 }
      );
    }
  }

  const checkin = await prisma.checkin.create({
    data: {
      alunoId,
    },
    include: {
      aluno: true,
    },
  });

  return NextResponse.json(checkin);
}