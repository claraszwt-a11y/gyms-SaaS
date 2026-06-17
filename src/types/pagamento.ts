export type Pagamento = {
  id: number;
  alunoId: number;
  valor: number;
  status: "Pago" | "Pendente";
  createdAt: Date;
};