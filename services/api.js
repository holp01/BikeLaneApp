import axios from 'axios';

const API_URL = 'https://localhost:7005/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  export const registerUser = async (userData) => {
    try {
      const response = await api.post('user/register', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  export const loginUser = async (credentials) => {
    try {
      const response = await api.post('user/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };