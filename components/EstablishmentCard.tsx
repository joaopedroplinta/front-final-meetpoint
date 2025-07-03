import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import RatingStars from './RatingStars';
import { Colors, Fonts } from '../constants/Colors';
import { Establishment } from '../types';

interface EstablishmentCardProps {
  establishment: Establishment;
}

const EstablishmentCard = ({ establishment }: EstablishmentCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/establishment/${establishment.id}`);
  };

  // Handle both API response formats
  const name = establishment.nome || establishment.name || 'Estabelecimento';
  const address = establishment.endereco || establishment.address || 'Endereço não informado';
  const averageRating = establishment.averageRating || 0;
  const numRatings = establishment.numRatings || 0;
  const imageUrl = establishment.imageUrl || 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{establishment.category || 'Estabelecimento'}</Text>
        </View>
        <View style={styles.locationContainer}>
          <MapPin size={14} color={Colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>{address}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <RatingStars rating={averageRating} size={16} />
          <Text style={styles.ratingText}>
            {averageRating.toFixed(1)} ({numRatings})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  contentContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  categoryContainer: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontFamily: Fonts.regular,
  },
});

export default EstablishmentCard;