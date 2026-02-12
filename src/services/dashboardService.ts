import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleError = (message: string, error: any) => {
  console.error(message, error);
  toast.error(message);
};

export const dashboardService = {
  getChartData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/dashboard/chart`, {
        headers: getAuthHeaders(),
      });
      return { data: response.data, error: null };
    } catch (error) {
      handleError('Erro ao carregar dados do gráfico', error);
      return { data: null, error };
    }
  },

  getRecentTransactions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/dashboard/recent-transactions`, {
        headers: getAuthHeaders(),
      });
      return { data: response.data, error: null };
    } catch (error) {
      handleError('Erro ao carregar transações recentes', error);
      return { data: null, error };
    }
  },

  getFinancialStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/dashboard/financial-stats`, {
        headers: getAuthHeaders(),
      });
      return { data: response.data, error: null };
    } catch (error) {
      handleError('Erro ao carregar estatísticas financeiras', error);
      return { data: null, error };
    }
  },

  getDashboardReport: async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/dashboard/report-dashboard`, {
        params: { startDate, endDate },
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleError('Erro ao carregar dashborad.', error);
      return { data: null, error };
    }
  },

  getWeeklyRevenue: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/dashboard/weekly-revenue`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleError('Erro ao carregar dashborad.', error);
      return { data: null, error };
    }
  },

  getHourlyRevenue: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/dashboard/hourly-revenue`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleError('Erro ao carregar dashborad.', error);
      return { data: null, error };
    }
  },

  getPixConversion: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/dashboard/pix-conversion`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleError('Erro ao carregar dashborad.', error);
      return { data: null, error };
    }
  },
};
