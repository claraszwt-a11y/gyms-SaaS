import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const pagamento = await prisma.pagamento.create({
    data: {
      alunoId: Number(body.alunoId),
      valor: Number(body.valor),
      status: body.status || "Pago",
    },
  });

  return NextResponse.json(pagamento);
}