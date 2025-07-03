import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Star, Filter, TrendingUp, TrendingDown } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReviewsScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [establishment, setEstablishment] = useState(null);
  const [allRatings, setAllRatings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate content padding to avoid tab bar overlap
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
    loadBusinessData();
  }, [user]);

  const loadBusinessData = async () => {
    if (!user || user.type !== 'business' || !user.businessId) {
      setError('Acesso restrito a estabelecimentos');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load establishment data
      const establishmentData = await apiService.getEstabelecimentoById(user.businessId);
      setEstablishment(establishmentData);

      // Load ratings for this establishment
      const ratingsData = await apiService.getAvaliacoesByEstabelecimento(user.businessId);
      setAllRatings(ratingsData);
    } catch (error) {
      console.error('Failed to load business data:', error);
      setError('Erro ao carregar dados do estabelecimento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando avaliações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !establishment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Estabelecimento não encontrado'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredRatings = allRatings.filter(rating => {
    const ratingValue = rating.nota || rating.rating || 0;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return ratingValue >= 4;
    if (selectedFilter === 'low') return ratingValue <= 2;
    return true;
  });

  const filters = [
    { key: 'all', label: 'Todas', count: allRatings.length },
    { key: 'high', label: 'Positivas', count: allRatings.filter(r => (r.nota || r.rating || 0) >= 4).length },
    { key: 'low', label: 'Negativas', count: allRatings.filter(r => (r.nota || r.rating || 0) <= 2).length },
  ];

  const renderRatingItem = ({ item }) => {
    const ratingValue = item.nota || item.rating || 0;
    const comment = item.comentario || item.comment || 'Sem comentário';
    const date = item.data_avaliacao || item.date || 'Data não informada';

    return (
      <View style={styles.ratingCard}>
        <View style={styles.ratingHeader}>
          <View style={styles.ratingStars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                color={i < ratingValue ? Colors.primary : Colors.textSecondary}
                fill={i < ratingValue ? Colors.primary : 'transparent'}
              />
            ))}
          </View>
          <Text style={styles.ratingDate}>{date}</Text>
        </View>
        <Text style={styles.ratingComment}>{comment}</Text>
        <View style={styles.ratingFooter}>
          <Text style={styles.ratingUser}>Cliente</Text>
          {ratingValue >= 4 ? (
            <View style={styles.positiveIndicator}>
              <TrendingUp size={16} color={Colors.success} />
              <Text style={styles.positiveText}>Positiva</Text>
            </View>
          ) : ratingValue <= 2 ? (
            <View style={styles.negativeIndicator}>
              <TrendingDown size={16} color={Colors.error} />
              <Text style={styles.negativeText}>Negativa</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const averageRating = establishment.averageRating || 0;
  const totalRatings = allRatings.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo das Avaliações</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{averageRating.toFixed(1)}</Text>
                <Text style={styles.summaryLabel}>Média Geral</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalRatings}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.filtersContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.activeFilterButton
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.key && styles.activeFilterText
                  ]}
                >
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredRatings.length > 0 ? (
          <FlatList
            data={filteredRatings}
            keyExtractor={(item) => item.id}
            renderItem={renderRatingItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Filter size={60} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>
              Nenhuma avaliação encontrada
            </Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all' 
                ? 'Seu estabelecimento ainda não recebeu avaliações'
                : 'Nenhuma avaliação corresponde ao filtro selecionado'
              }
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
  },
  header: {
    backgroundColor: Colors.backgroundProfile,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryCard: {
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.medium,
  },
  activeFilterText: {
    color: Colors.white,
  },
  listContainer: {
    padding: 16,
  },
  ratingCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  ratingComment: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingUser: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  positiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  positiveText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.success,
  },
  negativeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  negativeText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.error,
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