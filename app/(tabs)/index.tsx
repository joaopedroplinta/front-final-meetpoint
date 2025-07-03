import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { Search, Filter, TrendingUp, Users, Star, MessageSquare } from 'lucide-react-native';
import EstablishmentCard from '@/components/EstablishmentCard';
import { Colors, Fonts } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import { Establishment } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isBusinessUser = user?.type === 'business';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const lastSearchRef = useRef('');
  const lastFilterRef = useRef('Todos');
  const isInitialLoadRef = useRef(true);

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
    let isMounted = true;
    
    const loadCategories = async () => {
      try {
        const tipos = await apiService.getTipos();
        if (isMounted) {
          setCategories(['Todos', ...tipos.map(tipo => tipo.nome)]);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        if (isMounted) {
          setCategories(['Todos', 'Restaurante', 'Café', 'Bar', 'Padaria', 'Mercado']);
        }
      }
    };
    
    loadCategories();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadEstablishments = useCallback(async (search: string, filter: string, force = false) => {
    if (!force && search === lastSearchRef.current && filter === lastFilterRef.current) {
      return;
    }
    
    if (!isMountedRef.current) return;
    
    lastSearchRef.current = search;
    lastFilterRef.current = filter;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getEstabelecimentos({
        search: search || undefined,
        tipo: filter && filter !== 'Todos' ? filter : undefined
      });
      
      if (isMountedRef.current) {
        setEstablishments(data);
      }
    } catch (error) {
      console.error('Failed to load establishments:', error);
      if (isMountedRef.current) {
        setError('Erro ao carregar estabelecimentos');
        setEstablishments([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      loadEstablishments('', 'Todos', true);
    }
  }, []);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!isInitialLoadRef.current) {
      debounceTimeoutRef.current = setTimeout(() => {
        loadEstablishments(searchQuery, activeFilter);
      }, searchQuery ? 500 : 0);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  const handleRetry = useCallback(() => {
    loadEstablishments(searchQuery, activeFilter, true);
  }, [searchQuery, activeFilter, loadEstablishments]);

  if (isBusinessUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.container} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
        >
          <View style={styles.businessContent}>
            <View style={styles.businessHeader}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800' }}
                style={styles.businessImage}
                resizeMode="cover"
              />
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{user.name}</Text>
                <Text style={styles.businessCategory}>Estabelecimento</Text>
                <Text style={styles.businessAddress}>Dashboard do Negócio</Text>
              </View>
            </View>

            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardCard}>
                <Star size={24} color={Colors.primary} />
                <Text style={styles.dashboardValue}>4.5</Text>
                <Text style={styles.dashboardLabel}>Avaliação Média</Text>
              </View>
              
              <View style={styles.dashboardCard}>
                <MessageSquare size={24} color={Colors.success} />
                <Text style={styles.dashboardValue}>0</Text>
                <Text style={styles.dashboardLabel}>Avaliações</Text>
              </View>
              
              <View style={styles.dashboardCard}>
                <Users size={24} color={Colors.primary} />
                <Text style={styles.dashboardValue}>0</Text>
                <Text style={styles.dashboardLabel}>Visualizações</Text>
              </View>
              
              <View style={styles.dashboardCard}>
                <TrendingUp size={24} color={Colors.success} />
                <Text style={styles.dashboardValue}>+0%</Text>
                <Text style={styles.dashboardLabel}>Crescimento</Text>
              </View>
            </View>

            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
              <View style={styles.emptyState}>
                <MessageSquare size={40} color={Colors.textSecondary} />
                <Text style={styles.emptyStateText}>Nenhuma avaliação ainda</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar estabelecimentos..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {categories.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.activeFilterButton
                ]}
                onPress={() => handleFilterChange(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.activeFilterText
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Carregando estabelecimentos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar estabelecimentos</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : establishments && establishments.length > 0 ? (
          <FlatList
            data={establishments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EstablishmentCard establishment={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Filter size={60} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>
              Nenhum estabelecimento encontrado
            </Text>
            <Text style={styles.emptySubtext}>
              Tente buscar com termos diferentes ou alterar o filtro
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
  businessContent: {
    padding: 16,
  },
  businessHeader: {
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
  businessImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  businessInfo: {
    alignItems: 'center',
  },
  businessName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 8,
  },
  businessAddress: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  dashboardCard: {
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
  dashboardValue: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  dashboardLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recentSection: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
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
  header: {
    backgroundColor: Colors.backgroundProfile,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginRight: 8,
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.medium,
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