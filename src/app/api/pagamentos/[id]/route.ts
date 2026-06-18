import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;

  const pagamento = await prisma.pagamento.update({
    where: {
      id: Number(id),
    },
    data: {
      status: "Pago",
    },
  });

  return NextResponse.json(pagamento);
}