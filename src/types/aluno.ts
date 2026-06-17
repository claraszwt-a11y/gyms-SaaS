export type Aluno = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  plano: string;
  ativo: boolean;
  vencimento: Date | string | null;
  createdAt: Date;
};