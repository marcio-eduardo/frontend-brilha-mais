import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-20 pb-8 px-6 items-center bg-brand-dark rounded-b-3xl">
        <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center border-4 border-brand-primary mb-4">
          <Ionicons name="person" size={48} color="#6b7280" />
        </View>
        <Text className="text-white font-bold text-2xl">{user?.matriculaCpf || 'Técnico'}</Text>
        <Text className="text-gray-300">Técnico On-site</Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        <TouchableOpacity 
          className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.')}
        >
          <Ionicons name="settings-outline" size={24} color="#374151" />
          <Text className="ml-4 text-gray-700 font-medium text-lg">Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100"
          onPress={() => Alert.alert('Ajuda', 'Entre em contato com o suporte.')}
        >
          <Ionicons name="help-circle-outline" size={24} color="#374151" />
          <Text className="ml-4 text-gray-700 font-medium text-lg">Ajuda e Suporte</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center p-4 bg-red-50 rounded-xl mt-auto mb-24 border border-red-100"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text className="ml-4 text-red-500 font-bold text-lg">Sair do App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
