import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to welcome screen on app start
    router.replace('/welcome');
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}