import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const checkin = await prisma.checkin.create({
    data: {
      alunoId: body.alunoId,
    },

    include: {
      aluno: true,
    },
  });

  return NextResponse.json(checkin);
}