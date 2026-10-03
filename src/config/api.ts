import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  let token: string | null = null;

  if (Platform.OS === 'web') {
    token = localStorage.getItem('Nkauth');
  } else {
    token = await SecureStore.getItemAsync('Nkauth');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});