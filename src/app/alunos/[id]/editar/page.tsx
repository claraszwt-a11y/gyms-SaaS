import { prisma } from "@/lib/prisma";
import EditarAlunoForm from "../editar-aluno-form";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarAlunoPage({
  params,
}: Props) {
  const { id } = await params;

  const aluno = await prisma.aluno.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!aluno) {
    return (
      <div className="p-8 text-white">
        Aluno não encontrado
      </div>
    );
  }

  return <EditarAlunoForm aluno={aluno} />;
}