import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface UserProfile {
  matriculaCpf: string;
  primeiroAcesso: boolean;
  // Expanda depois com nome, avatar, etc
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  setAuth: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true, // Começa carregando para evitar piscar a tela de login se já estiver logado

  setAuth: async (token: string, user: UserProfile) => {
    try {
      await SecureStore.setItemAsync('brilhamais_token', token);
      await SecureStore.setItemAsync('brilhamais_user', JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (error) {
      console.error('Erro ao salvar no SecureStore:', error);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('brilhamais_token');
      await SecureStore.deleteItemAsync('brilhamais_user');
      set({ token: null, user: null, isLoading: false });
    } catch (error) {
      console.error('Erro ao deletar do SecureStore:', error);
    }
  },

  checkSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('brilhamais_token');
      const userStr = await SecureStore.getItemAsync('brilhamais_user');
      
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isLoading: false });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
