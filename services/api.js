import axios from 'axios';

const API_URL = 'https://24dd-2001-818-eb85-9b00-9b0d-7f57-7155-5d2a.ngrok.io/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Authentication
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