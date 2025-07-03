import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  style?: ViewStyle;
}

const RatingStars = ({
  rating,
  maxRating = 5,
  size = 24,
  interactive = false,
  onRatingChange,
  style,
}: RatingStarsProps) => {
  const handlePress = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= rating;

        return (
          <TouchableOpacity
            key={`star-${index}`}
            onPress={() => handlePress(starValue)}
            activeOpacity={interactive ? 0.7 : 1}
            disabled={!interactive}
            style={styles.starContainer}
          >
            <Star
              size={size}
              color={filled ? Colors.primary : Colors.textSecondary}
              fill={filled ? Colors.primary : 'transparent'}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    padding: 2,
  },
});

export default RatingStars;