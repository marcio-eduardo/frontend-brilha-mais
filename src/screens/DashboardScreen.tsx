import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      // Como a API não tem um endpoint getDashboard pronto para um único usuário ainda,
      // podemos consumir o ranking e filtrar, ou bater no /calcular
      // Simulando a obtenção dos dados do usuário logado:
      const response = await api.get('/dashboard/ranking?mesAno=2026-05-01');
      const ranking = response.data;
      
      const myData = ranking.find((t: any) => t.tecnico.includes('72916') || t.tecnico === user?.matriculaCpf) || ranking[0];
      setDashboardData(myData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-brand-dark justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-dark">
      <View className="pt-16 pb-6 px-6 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-4">
            <Ionicons name="person" size={24} color="#4b5563" />
          </View>
          <View>
            <Text className="text-gray-300 text-sm">Olá,</Text>
            <Text className="text-white font-bold text-lg">{user?.matriculaCpf || 'Técnico'}</Text>
          </View>
        </View>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
      </View>

      <ScrollView 
        className="flex-1 bg-white rounded-t-3xl pt-6 px-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-brand-dark font-bold text-xl mb-4">Desempenho Geral</Text>
        
        {/* Card Principal */}
        <View className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6 flex-row items-center">
          <View className="w-24 h-24 rounded-full border-8 border-brand-primary items-center justify-center mr-6">
            <Text className="text-2xl font-bold text-brand-dark">{dashboardData?.notaFinal || 0}%</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">Meta mensal</Text>
            <Text className="text-brand-dark font-bold text-lg mb-2">90%</Text>
            
            <Text className="text-gray-500 text-sm">Posição atual</Text>
            <Text className="text-brand-accent font-bold text-lg">{dashboardData?.posicao || '-'}</Text>
          </View>
        </View>

        <Text className="text-brand-dark font-bold text-xl mb-4">Indicadores</Text>
        
        {/* Card Indicador SLA */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color="#3730a3" />
              <Text className="text-gray-700 font-bold ml-2">SLA On-site</Text>
            </View>
            <Text className="text-brand-dark font-bold">{dashboardData?.percentualSla?.toFixed(2) || 0}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
            <View 
              className="h-full bg-brand-primary" 
              style={{ width: `${Math.min(dashboardData?.percentualSla || 0, 100)}%` }} 
            />
          </View>
        </View>

        {/* Card Elegibilidade */}
        <View className={`rounded-xl p-4 mb-24 ${dashboardData?.elegivel ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`font-bold ${dashboardData?.elegivel ? 'text-green-700' : 'text-red-700'}`}>
            Status do Prêmio: {dashboardData?.elegivel ? 'Elegível' : 'Inelegível'}
          </Text>
          {!dashboardData?.elegivel && (
            <Text className="text-red-600 text-xs mt-1">{dashboardData?.motivoInelegibilidade}</Text>
          )}
        </View>

      </ScrollView>
    </View>
  );
}
