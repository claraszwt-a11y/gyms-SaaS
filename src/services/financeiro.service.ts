type PagamentoFinanceiro = {
  valor: number;
  status: string;
};

export function calcularFinanceiro(
  pagamentos: PagamentoFinanceiro[]
) {
  const pagos = pagamentos.filter(
    (pagamento) => pagamento.status === "Pago"
  );

  const pendentes = pagamentos.filter(
    (pagamento) => pagamento.status === "Pendente"
  );

  const receitaRecebida = pagos.reduce(
    (total, pagamento) => total + pagamento.valor,
    0
  );

  const receitaPendente = pendentes.reduce(
    (total, pagamento) => total + pagamento.valor,
    0
  );

  return {
    totalPagamentos: pagamentos.length,
    pagamentosPagos: pagos.length,
    pagamentosPendentes: pendentes.length,
    receitaRecebida,
    receitaPendente,
  };
}