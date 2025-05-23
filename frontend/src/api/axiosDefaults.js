import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // No /api suffix!
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
