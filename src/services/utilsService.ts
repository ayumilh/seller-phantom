/** Formata valor em BRL sempre com R$, independente do locale da UI */
export function formatCurrencyBRL(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export const utilsservice = {
  formatarParaReal(valor: number | null): string {
    if (valor === null || valor === undefined) {
      return 'R$ 0,00';
    }
    return formatCurrencyBRL(valor);
  },


  getTokenValido() {
    const token = localStorage.getItem('token');
    const expiracao = localStorage.getItem('token_expira_em');

    if (!token || !expiracao) return null;

    const agora = new Date();
    const expiraEm = new Date(expiracao);

    if (agora > expiraEm) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expira_em');
      return null;
    }

    return token;
  },
};