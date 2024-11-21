import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const db = {
  async get(endpoint: string) {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data;
  },

  async post(endpoint: string, data: any) {
    const response = await axios.post(`${API_URL}/${endpoint}`, data);
    return response.data;
  },

  async put(endpoint: string, data: any) {
    const response = await axios.put(`${API_URL}/${endpoint}`, data);
    return response.data;
  },

  async delete(endpoint: string) {
    const response = await axios.delete(`${API_URL}/${endpoint}`);
    return response.data;
  }
}; 