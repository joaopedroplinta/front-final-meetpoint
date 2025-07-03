import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Clock, ArrowLeft } from 'lucide-react-native';
import Button from '@/components/Button';
import RatingStars from '@/components/RatingStars';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';

export default function EstablishmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  
  const [establishment, setEstablishment] = useState(null);
  const [establishmentRatings, setEstablishmentRatings] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadEstablishmentData();
    }
  }, [id]);

  const loadEstablishmentData = async () => {
    if (!id) {
      setError('ID do estabelecimento não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Loading establishment data for ID:', id);

      const establishmentData = await apiService.getEstabelecimentoById(id);
      console.log('Establishment data loaded:', establishmentData);
      setEstablishment(establishmentData);

      try {
        const ratingsData = await apiService.getAvaliacoesByEstabelecimento(id);
        console.log('Ratings data loaded:', ratingsData);
        setEstablishmentRatings(ratingsData || []);
      } catch (ratingsError) {
        console.warn('Failed to load ratings, continuing without them:', ratingsError);
        setEstablishmentRatings([]);
      }
    } catch (error) {
      console.error('Failed to load establishment:', error);
      setError('Erro ao carregar estabelecimento');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Avaliação incompleta', 'Por favor, selecione uma classificação de 1 a 5 estrelas.');
      return;
    }

    if (!user || user.type !== 'customer') {
      Alert.alert('Erro', 'Apenas clientes podem avaliar estabelecimentos.');
      return;
    }

    if (!id) {
      Alert.alert('Erro', 'ID do estabelecimento não encontrado.');
      return;
    }

    setSubmitting(true);

    try {
      console.log('Submitting rating:', {
        estabelecimento_id: id,
        cliente_id: user.id,
        nota: rating,
        comentario: comment.trim() || undefined,
      });

      await apiService.createAvaliacao({
        estabelecimento_id: id,
        cliente_id: user.id,
        nota: rating,
        comentario: comment.trim() || undefined,
      });

      Alert.alert(
        'Avaliação enviada',
        'Obrigado por compartilhar sua opinião!',
        [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setComment('');
              loadEstablishmentData();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to submit rating:', error);
      Alert.alert('Erro', 'Não foi possível enviar sua avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carregando...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando estabelecimento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !establishment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Erro</Text>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>{error || 'Estabelecimento não encontrado'}</Text>
          <Button
            title="Voltar"
            onPress={handleGoBack}
            style={styles.backButtonStyle}
          />
        </View>
      </SafeAreaView>
    );
  }

  const establishmentName = establishment.nome || establishment.name || 'Estabelecimento';
  const establishmentAddress = establishment.endereco || establishment.address || 'Endereço não informado';
  const averageRating = establishment.averageRating || 0;
  const numRatings = establishmentRatings.length;
  const imageUrl = establishment.imageUrl || 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {establishmentName}
        </Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.name}>{establishmentName}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{establishment.category || 'Estabelecimento'}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText} numberOfLines={2}>{establishmentAddress}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Consulte horário de funcionamento</Text>
            </View>
          </View>

          <View style={styles.ratingOverviewContainer}>
            <View style={styles.ratingNumberContainer}>
              <Text style={styles.ratingNumber}>{averageRating.toFixed(1)}</Text>
              <Text style={styles.ratingTotal}>/ 5</Text>
            </View>
            <View style={styles.ratingStarsContainer}>
              <RatingStars rating={averageRating} size={20} />
              <Text style={styles.numRatings}>
                {numRatings} {numRatings === 1 ? 'avaliação' : 'avaliações'}
              </Text>
            </View>
          </View>

          {user && user.type === 'customer' && (
            <View style={styles.ratingFormContainer}>
              <Text style={styles.sectionTitle}>Avaliar Estabelecimento</Text>
              <Text style={styles.ratingLabel}>Sua classificação *</Text>
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
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {comment.length}/500 caracteres
              </Text>
              <Button
                title={submitting ? "Enviando..." : "Enviar Avaliação"}
                onPress={handleSubmit}
                loading={submitting}
                disabled={rating === 0 || submitting}
                style={styles.submitButton}
              />
            </View>
          )}

          {!user && (
            <View style={styles.loginPromptContainer}>
              <Text style={styles.loginPromptTitle}>Quer avaliar este estabelecimento?</Text>
              <Text style={styles.loginPromptText}>
                Faça login para compartilhar sua experiência
              </Text>
              <Button
                title="Fazer Login"
                onPress={() => router.push('/auth/login')}
                style={styles.loginButton}
              />
            </View>
          )}

          {user && user.type === 'business' && (
            <View style={styles.businessUserContainer}>
              <Text style={styles.businessUserText}>
                Estabelecimentos não podem avaliar outros estabelecimentos
              </Text>
            </View>
          )}

          {establishmentRatings.length > 0 && (
            <View style={styles.reviewsContainer}>
              <Text style={styles.sectionTitle}>
                Avaliações ({establishmentRatings.length})
              </Text>
              {establishmentRatings.slice(0, 5).map((review, index) => {
                const reviewRating = review.nota || review.rating || 0;
                const reviewComment = review.comentario || review.comment || 'Sem comentário';
                const reviewDate = review.data_avaliacao || review.date || 'Data não informada';

                return (
                  <View key={review.id || index} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewUser}>Cliente</Text>
                      <Text style={styles.reviewDate}>{reviewDate}</Text>
                    </View>
                    <RatingStars rating={reviewRating} size={16} style={styles.reviewRating} />
                    <Text style={styles.reviewComment}>{reviewComment}</Text>
                  </View>
                );
              })}
              
              {establishmentRatings.length > 5 && (
                <Text style={styles.moreReviewsText}>
                  E mais {establishmentRatings.length - 5} avaliações...
                </Text>
              )}
            </View>
          )}

          {establishmentRatings.length === 0 && (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsTitle}>Nenhuma avaliação ainda</Text>
              <Text style={styles.noReviewsText}>
                Seja o primeiro a avaliar este estabelecimento!
              </Text>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    flex: 1,
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButtonStyle: {
    paddingHorizontal: 32,
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
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  ratingOverviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
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
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  ratingTotal: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 2,
    fontFamily: Fonts.regular,
  },
  ratingStarsContainer: {
    flex: 1,
  },
  numRatings: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontFamily: Fonts.regular,
  },
  ratingFormContainer: {
    backgroundColor: Colors.background,
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
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  ratingStars: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: Colors.backgroundProfile,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    height: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    fontFamily: Fonts.regular,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 16,
    fontFamily: Fonts.regular,
  },
  submitButton: {
    width: '100%',
  },
  loginPromptContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginPromptTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    paddingHorizontal: 32,
  },
  businessUserContainer: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  businessUserText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    textAlign: 'center',
  },
  reviewsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  reviewRating: {
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
  moreReviewsText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 12,
  },
  noReviewsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noReviewsTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  noReviewsText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});