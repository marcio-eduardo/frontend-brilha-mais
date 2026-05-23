import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { styled } from 'nativewind';

// Utilizando NativeWind, podemos criar componentes com suporte a className (mesmo que comecemos com View normal)

export default function LoginScreen() {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!matricula || !senha) {
      Alert.alert('Erro', 'Preencha a matrícula e a senha.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        matriculaCpf: matricula,
        senha: senha,
      });

      const { accessToken, primeiroAcesso, matriculaCpf } = response.data;
      
      // Salva no SecureStore e atualiza o estado
      await setAuth(accessToken, { matriculaCpf, primeiroAcesso });
      
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro de Autenticação', 'Matrícula ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-brand-dark items-center justify-center p-6">
      <StatusBar style="light" />
      
      <View className="w-full bg-white rounded-3xl p-8 shadow-lg">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-brand-dark">Brilha Mais</Text>
          <Text className="text-gray-500 mt-2 text-center">Plataforma de Performance e Gamificação</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Matrícula ou CPF</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-brand-dark border border-gray-200"
              placeholder="Digite sua matrícula"
              placeholderTextColor="#9ca3af"
              value={matricula}
              onChangeText={setMatricula}
              autoCapitalize="none"
              keyboardType="number-pad"
            />
          </View>

          <View className="mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Senha</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-brand-dark border border-gray-200"
              placeholder="Sua senha"
              placeholderTextColor="#9ca3af"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            className="w-full bg-brand-primary rounded-xl py-4 items-center justify-center mt-6 shadow-md"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
