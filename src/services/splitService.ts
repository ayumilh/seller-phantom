import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const splitService = {

  getResumoDepositos: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/split/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getReportData: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/split/report-data`, {
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

    const response = await axios.get(`${API_BASE_URL}/user/split/report-transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  },

};