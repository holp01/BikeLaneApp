import axios from 'axios';

const API_URL = 'https://5252-2001-818-eb85-9b00-9b0d-7f57-7155-5d2a.ngrok.io/api/';

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