import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const settingService = {
  generateClientCredentials: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/settings/credentials`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAuthorizedIps: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/settings/ips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  addAuthorizedIp: async (ip: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/user/settings/new-ip`,
      { authorized_ip: ip },
      { headers: {
        Authorization: `Bearer ${token}`,
      },}
    );
    return response.data;
  },

  deleteAuthorizedIp: async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/user/settings/ip/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getEmailNotifications: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/settings/user-notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateEmailNotifications: async (notifications: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/user/settings/user-notifications`, notifications, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};