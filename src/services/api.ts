import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Substitua pelo IP da sua máquina na rede local, ex: 192.168.1.X
const API_URL = 'http://192.168.1.105:8080/api/v1'; // Ajustado para o IP ativo na rede local

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token em cada requisição
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('brilhamais_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token do SecureStore', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor genérico para logging de respostas (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Acesso não autorizado. Sessão possivelmente expirada.');
      // O Zustand ou a Navigation farão o logout/redirecionamento quando a API falhar.
    }
    return Promise.reject(error);
  }
);
