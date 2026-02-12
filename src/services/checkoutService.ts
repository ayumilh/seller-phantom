import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkoutService = {

  getUserProductSales: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/checkout/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  createProduct: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/user/checkout/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/user/checkout/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getProductById: async (id: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/checkout/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateProductById: async (id: any, data: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/user/checkout/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getUserShippingOptions: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/checkout/shipping`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  createShipping: async (formData: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/user/checkout/shipping`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteShipping: async (id: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/user/checkout/shipping/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateShippingById: async (id: any, data: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/user/checkout/shipping/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getUserCheckouts: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/checkout/checkouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  createCheckout: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/user/checkout/checkouts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCheckout: async (id: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/user/checkout/checkouts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getSalesAndAbandoned: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/checkout/sales`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteSale: async (id: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/user/checkout/sales/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

};