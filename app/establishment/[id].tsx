import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, Clock } from 'lucide-react-native';
import Button from '@/components/Button';
import RatingStars from '@/components/RatingStars';
import Colors from '@/constants/Colors';
import { getEstablishmentById, getEstablishmentRatings, getCurrentUser } from '@/utils/mockData';

export default function EstablishmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const establishment = getEstablishmentById(id);
  const establishmentRatings = getEstablishmentRatings(id);
  const currentUser = getCurrentUser();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!establishment) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Estabelecimento não encontrado</Text>
      </View>
    );
  }

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Avaliação incompleta', 'Por favor, selecione uma classificação de 1 a 5 estrelas.');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Avaliação enviada',
        'Obrigado por compartilhar sua opinião!',
        [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setComment('');
            },
          },
        ]
      );
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: establishment.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{establishment.name}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{establishment.category}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MapPin size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{establishment.address}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>Aberto - Fecha às 22:00</Text>
          </View>
        </View>

        <View style={styles.ratingOverviewContainer}>
          <View style={styles.ratingNumberContainer}>
            <Text style={styles.ratingNumber}>{establishment.averageRating.toFixed(1)}</Text>
            <Text style={styles.ratingTotal}>/ 5</Text>
          </View>
          <View style={styles.ratingStarsContainer}>
            <RatingStars rating={establishment.averageRating} size={20} />
            <Text style={styles.numRatings}>
              {establishment.numRatings} {establishment.numRatings === 1 ? 'avaliação' : 'avaliações'}
            </Text>
          </View>
        </View>

        <View style={styles.ratingFormContainer}>
          <Text style={styles.sectionTitle}>Avaliar Estabelecimento</Text>
          <Text style={styles.ratingLabel}>Sua classificação</Text>
          <RatingStars
            rating={rating}
            size={32}
            interactive={true}
            onRatingChange={handleRatingChange}
            style={styles.ratingStars}
          />
          <Text style={styles.commentLabel}>Seu comentário (opcional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Compartilhe sua experiência..."
            placeholderTextColor={Colors.text.light}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
          <Button
            title="Enviar Avaliação"
            onPress={handleSubmit}
            loading={submitting}
            disabled={rating === 0}
            style={styles.submitButton}
          />
        </View>

        {establishmentRatings.length > 0 && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
            {establishmentRatings.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>
                    {review.userId === currentUser.id ? 'Você' : 'Usuário'}
                  </Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <RatingStars rating={review.rating} size={16} style={styles.reviewRating} />
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  image: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  ratingOverviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingNumberContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 16,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  ratingTotal: {
    fontSize: 16,
    color: Colors.text.light,
    marginLeft: 2,
  },
  ratingStarsContainer: {
    flex: 1,
  },
  numRatings: {
    fontSize: 12,
    color: Colors.text.light,
    marginTop: 4,
  },
  ratingFormContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  ratingStars: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: Colors.background.accent,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.text.primary,
    height: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  submitButton: {
    width: '100%',
  },
  reviewsContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.text.light,
  },
  reviewRating: {
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});