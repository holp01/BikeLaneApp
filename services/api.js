import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://ec01-2001-818-eb85-9b00-9b0d-7f57-7155-5d2a.ngrok.io/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const SecureStorage = {
  setItem: async (key, value) => AsyncStorage.setItem(key, value),
  getItem: async (key) => AsyncStorage.getItem(key),
  removeItem: async (key) => AsyncStorage.removeItem(key),
};

//Authentication
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await SecureStorage.getItem('refreshToken');
      const newTokenData = await refreshToken(refreshToken);
      
      await SecureStorage.setItem('accessToken', newTokenData.Token);
      api.defaults.headers['Authorization'] = `Bearer ${newTokenData.Token}`;

      return api(originalRequest);
    }

    throw error;
  }
);

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
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

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('user/refresh-token', { RefreshToken: refreshToken });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('user/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//Trips
export const startUserTrip = async (startTime) => {
  try {
    const response = await api.post('trip/start', { StartTime: startTime });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const endUserTrip = async (tripData) => {
  try {
    const response = await api.post('trip/end', tripData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//Rewards
export const getActiveRewards = async () => {
  try {
    const response = await api.get('rewards/getActive');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const redeemReward = async (rewardId) => {
  try {
    const response = await api.post('rewards/redeem', {
      RewardId: rewardId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};