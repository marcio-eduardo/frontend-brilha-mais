import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

export default function RankingScreen() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();

  const fetchRanking = async () => {
    try {
      const response = await api.get('/dashboard/ranking?mesAno=2026-05-01');
      setRanking(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const renderTop3 = () => {
    if (ranking.length < 3) return null;
    const top3 = ranking.slice(0, 3);
    // Ordem no pódio: 2º, 1º, 3º
    const podium = [top3[1], top3[0], top3[2]];

    return (
      <View className="flex-row justify-center items-end h-48 mb-8 mt-4 space-x-2">
        {podium.map((item, index) => {
          const isFirst = index === 1;
          const pos = isFirst ? 1 : index === 0 ? 2 : 3;
          const height = isFirst ? 'h-32' : 'h-24';
          const bg = isFirst ? 'bg-brand-primary' : 'bg-brand-secondary';
          const badgeColor = isFirst ? '#fbbf24' : pos === 2 ? '#9ca3af' : '#d97706';

          return (
            <View key={pos} className="items-center w-28">
              <View className="relative mb-2">
                <View className="w-14 h-14 bg-gray-300 rounded-full items-center justify-center border-2 border-white">
                  <Ionicons name="person" size={24} color="#6b7280" />
                </View>
                <View 
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full items-center justify-center border border-white"
                  style={{ backgroundColor: badgeColor }}
                >
                  <Text className="text-white text-xs font-bold">{pos}</Text>
                </View>
              </View>
              <View className={`${height} w-full ${bg} rounded-t-xl items-center pt-2 px-1`}>
                <Text className="text-white text-xs font-medium text-center" numberOfLines={2}>
                  {item.tecnico.split(' ')[0]}
                </Text>
                <Text className="text-white font-bold mt-1">{item.notaFinal}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    if (index < 3) return null; // Já mostrados no pódio
    const isMe = item.tecnico === user?.matriculaCpf;

    return (
      <View className={`flex-row items-center py-3 px-4 mb-2 rounded-xl border ${isMe ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white border-gray-100'}`}>
        <Text className="text-gray-500 font-bold w-6 text-center">{item.posicao}</Text>
        <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mx-3">
          <Ionicons name="person" size={16} color="#6b7280" />
        </View>
        <View className="flex-1">
          <Text className={`font-medium ${isMe ? 'text-brand-dark font-bold' : 'text-gray-700'}`}>
            {isMe ? 'Você' : item.tecnico}
          </Text>
        </View>
        <Text className="font-bold text-brand-dark">{item.notaFinal}%</Text>
      </View>
    );
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
      <View className="pt-16 pb-4 px-6 items-center flex-row justify-center relative">
        <Ionicons name="trophy" size={24} color="#fbbf24" className="mr-2" />
        <Text className="text-white font-bold text-xl ml-2">Ranking</Text>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl pt-6 px-4">
        <FlatList
          data={ranking}
          keyExtractor={(item) => item.posicao.toString()}
          ListHeaderComponent={renderTop3}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRanking(); }} />}
        />
      </View>
    </View>
  );
}
