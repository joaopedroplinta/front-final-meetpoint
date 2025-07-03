import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Star } from 'lucide-react-native';
import UserRatingCard from '@/components/UserRatingCard';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyRatingsScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [userRatings, setUserRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getContentPaddingBottom = () => {
    const baseTabHeight = 60;
    const bottomInset = insets.bottom;
    
    if (Platform.OS === 'ios') {
      return baseTabHeight + bottomInset + 16;
    } else if (Platform.OS === 'android') {
      return baseTabHeight + Math.max(bottomInset, 8) + 16;
    } else {
      return baseTabHeight + 16;
    }
  };

  const contentPaddingBottom = getContentPaddingBottom();

  useEffect(() => {
    loadUserRatings();
  }, [user]);

  const loadUserRatings = async () => {
    if (!user || user.type !== 'customer') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      setUserRatings([]);
    } catch (error) {
      console.error('Failed to load user ratings:', error);
      setError('Erro ao carregar suas avaliações');
      setUserRatings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando suas avaliações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : userRatings.length > 0 ? (
          <FlatList
            data={userRatings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UserRatingCard rating={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Star size={60} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>
              Você ainda não avaliou nenhum estabelecimento
            </Text>
            <Text style={styles.emptySubtext}>
              Encontre estabelecimentos na aba Início e compartilhe sua opinião
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundProfile,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: Fonts.regular,
  },
});