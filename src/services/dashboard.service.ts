import { Aluno } from "@/types/aluno";
import { DashboardData } from "@/types/dashboard";

export function calcularDashboard(
  alunos: Aluno[]
): DashboardData {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const totalAlunos = alunos.length;

  const alunosVencidos = alunos.filter((aluno) => {
    if (!aluno.vencimento) return false;

    const vencimento = new Date(aluno.vencimento);
    vencimento.setHours(0, 0, 0, 0);

    return vencimento < hoje;
  }).length;

  const alunosAtivos = totalAlunos - alunosVencidos;

  const alunosPremium = alunos.filter(
    (aluno) => aluno.plano === "Premium"
  ).length;

  const receitaPrevista = alunosAtivos * 89.9;

  return {
    totalAlunos,
    alunosAtivos,
    alunosVencidos,
    alunosPremium,
    receitaPrevista,
  };
}