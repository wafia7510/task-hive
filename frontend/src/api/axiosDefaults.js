import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '', // ✅ no /api prefix here
  withCredentials: true,
});
