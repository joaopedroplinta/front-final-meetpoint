import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import RatingStars from './RatingStars';
import { Colors, Fonts } from '../constants/Colors';
import { getEstablishmentById } from '../utils/mockData';
import { Rating } from '../types';

interface UserRatingCardProps {
  rating: Rating;
}

const UserRatingCard = ({ rating }: UserRatingCardProps) => {
  const router = useRouter();
  const establishment = getEstablishmentById(rating.establishmentId);

  if (!establishment) {
    return null;
  }

  const handlePress = () => {
    router.push(`/establishment/${establishment.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.establishmentName}>{establishment.name}</Text>
        <Text style={styles.date}>{rating.date}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <RatingStars rating={rating.rating} size={18} />
      </View>
      <Text style={styles.comment}>{rating.comment}</Text>
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