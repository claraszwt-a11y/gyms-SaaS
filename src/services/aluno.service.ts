import { Aluno } from "@/types/aluno";

export function alunoEstaVencido(aluno: Aluno) {
  if (!aluno.vencimento) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencimento = new Date(aluno.vencimento);
  vencimento.setHours(0, 0, 0, 0);

  return vencimento < hoje;
}

export function calcularResumoAlunos(alunos: Aluno[]) {
  const totalAlunos = alunos.length;

  const alunosVencidos = alunos.filter(alunoEstaVencido).length;

  const alunosAtivos = totalAlunos - alunosVencidos;

  const alunosPremium = alunos.filter(
    (aluno) => aluno.plano === "Premium"
  ).length;

  const taxaInadimplencia =
    totalAlunos === 0
      ? 0
      : Math.round((alunosVencidos / totalAlunos) * 100);

  return {
    totalAlunos,
    alunosAtivos,
    alunosVencidos,
    alunosPremium,
    taxaInadimplencia,
  };
}