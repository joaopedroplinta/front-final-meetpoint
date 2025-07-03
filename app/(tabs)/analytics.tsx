import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { TrendingUp, Users, Star, MessageSquare, Calendar } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { getCurrentUser, getBusinessEstablishment, getEstablishmentRatings } from '@/utils/mockData';

export default function AnalyticsScreen() {
  const currentUser = getCurrentUser();
  const establishment = currentUser.type === 'business' && currentUser.businessId 
    ? getBusinessEstablishment(currentUser.businessId) 
    : null;
  
  const ratings = establishment ? getEstablishmentRatings(establishment.id) : [];

  if (!establishment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Estabelecimento não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const analyticsData = [
    {
      icon: <Star size={24} color={Colors.primary} />,
      title: 'Avaliação Média',
      value: establishment.averageRating.toFixed(1),
      subtitle: 'Baseado em ' + establishment.numRatings + ' avaliações',
      color: Colors.primary,
    },
    {
      icon: <MessageSquare size={24} color={Colors.success} />,
      title: 'Total de Avaliações',
      value: establishment.numRatings.toString(),
      subtitle: 'Este mês: +12',
      color: Colors.success,
    },
    {
      icon: <Users size={24} color={Colors.primary} />,
      title: 'Visualizações',
      value: '1.2k',
      subtitle: 'Este mês: +15%',
      color: Colors.primary,
    },
    {
      icon: <TrendingUp size={24} color={Colors.success} />,
      title: 'Crescimento',
      value: '+8.5%',
      subtitle: 'Comparado ao mês anterior',
      color: Colors.success,
    },
  ];

  const recentRatings = ratings.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.establishmentHeader}>
            <Text style={styles.establishmentName}>{establishment.name}</Text>
            <Text style={styles.establishmentCategory}>{establishment.category}</Text>
          </View>

          <View style={styles.analyticsGrid}>
            {analyticsData.map((item, index) => (
              <View key={index} style={styles.analyticsCard}>
                <View style={styles.analyticsIconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.analyticsValue}>{item.value}</Text>
                <Text style={styles.analyticsTitle}>{item.title}</Text>
                <Text style={styles.analyticsSubtitle}>{item.subtitle}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={Colors.textPrimary} />
              <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
            </View>
            
            {recentRatings.length > 0 ? (
              <View style={styles.ratingsContainer}>
                {recentRatings.map((rating) => (
                  <View key={rating.id} style={styles.ratingCard}>
                    <View style={styles.ratingHeader}>
                      <View style={styles.ratingStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            color={i < rating.rating ? Colors.primary : Colors.textSecondary}
                            fill={i < rating.rating ? Colors.primary : 'transparent'}
                          />
                        ))}
                      </View>
                      <Text style={styles.ratingDate}>{rating.date}</Text>
                    </View>
                    <Text style={styles.ratingComment}>{rating.comment}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <MessageSquare size={40} color={Colors.textSecondary} />
                <Text style={styles.emptyStateText}>Nenhuma avaliação ainda</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
  content: {
    padding: 16,
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
  establishmentHeader: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  establishmentName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  establishmentCategory: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  analyticsCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsIconContainer: {
    marginBottom: 12,
  },
  analyticsValue: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  analyticsTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  analyticsSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  ratingsContainer: {
    gap: 12,
  },
  ratingCard: {
    backgroundColor: Colors.backgroundProfile,
    borderRadius: 12,
    padding: 16,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});