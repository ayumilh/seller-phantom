import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const withdrawService = {

  solicitarSaque: async (payload: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/withdrawals/withdraw`, payload,{
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

  getResumoSaques: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/withdraw/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getReportData: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/withdraw/report-data`, {
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
    const response = await axios.get(`${API_BASE_URL}/user/withdraw/report-transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  },

  getReceipt: async (transactionId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/withdraw/receipt/${transactionId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getUsdToBrlRate: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/withdraw/currency/usd-brl`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.usd_brl ?? null;
  },

  setUsdToBrlRate: async (payload: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/user/withdraw/currency/usd-brl`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.message ?? null;
  },

  getInternalTransfers: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/withdraw/internal-transfers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data ?? null;
  },

  setInternalTransfers: async (payload: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/user/withdraw/internal-transfers`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data ?? null;
  },

  getUsersByEmail: async (email: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/withdraw/internal-transfers/users`, {
      params: { email },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.users ?? null;
  }

};