import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const depositService = {

  getStatusDeposit: async (id: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/deposit/status/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  gerarQRCode: async (payload: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/payments/deposit`,payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getBalanceUser: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/deposit/balance-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getResumoDepositos: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/deposit/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getReportData: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/deposit/report-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getReportTransactions: async ({
    search = '',
    status = '',
    sort = { sortBy: 'created_at', order: 'desc' },
    pagination = { page: 1, limit: 10 },
  } = {}) => {
    const token = localStorage.getItem('token');

    const params = {
      search,
      status,
      sortField: sort.sortBy,
      sortOrder: sort.order,
      page: pagination.page,
      limit: pagination.limit,
    };

    const response = await axios.get(`${API_BASE_URL}/user/deposit/report-transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  },

  getReportBlockTransactions: async ({ page = 1, limit = 10, search = '', sortBy = 'created_at', order = 'DESC' }) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/deposit/block-transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
        search,
        sortBy,
        order,
      },
    });
    return response.data;
  },

  sendDefense: async (transactionId: string, mensagem: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/user/deposit/defense/${transactionId}`,
        { mensagem },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return response.data;
    } catch (error: any) {
      console.error('Erro ao enviar defesa:', error);
      throw new Error(error?.response?.data?.error || 'Erro ao enviar defesa');
    }
  },
};