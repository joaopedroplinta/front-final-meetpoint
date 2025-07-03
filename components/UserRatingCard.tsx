import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import RatingStars from './RatingStars';
import { Colors, Fonts } from '../constants/Colors';
import { apiService } from '../services/api';
import { Rating } from '../types';

interface UserRatingCardProps {
  rating: Rating;
}

const UserRatingCard = ({ rating }: UserRatingCardProps) => {
  const router = useRouter();
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEstablishment();
  }, [rating]);

  const loadEstablishment = async () => {
    try {
      const establishmentId = rating.estabelecimento_id || rating.establishmentId;
      if (establishmentId) {
        const establishmentData = await apiService.getEstabelecimentoById(establishmentId);
        setEstablishment(establishmentData);
      }
    } catch (error) {
      console.error('Failed to load establishment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    const establishmentId = rating.estabelecimento_id || rating.establishmentId;
    if (establishmentId) {
      router.push(`/establishment/${establishmentId}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!establishment) {
    return null;
  }

  const establishmentName = establishment.nome || establishment.name || 'Estabelecimento';
  const ratingValue = rating.nota || rating.rating || 0;
  const comment = rating.comentario || rating.comment || 'Sem comentário';
  const date = rating.data_avaliacao || rating.date || 'Data não informada';

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.establishmentName}>{establishmentName}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <RatingStars rating={ratingValue} size={18} />
      </View>
      <Text style={styles.comment}>{comment}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  establishmentName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  ratingContainer: {
    marginBottom: 12,
  },
  comment: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
});

export default UserRatingCard;