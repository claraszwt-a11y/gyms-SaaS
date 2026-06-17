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
      vencimento: body.vencimento ? new Date(body.vencimento) : null,
      ativo: true,
    },
  });

  return NextResponse.json(aluno);
}