export const utilsservice = {
    formatarParaReal(valor: number | null): string {
    if (valor === null || valor === undefined) {
      return 'R$ 0,00'; // ou '', dependendo do que você preferir
    }
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
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