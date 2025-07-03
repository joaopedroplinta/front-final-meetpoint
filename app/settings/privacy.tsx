import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function PrivacyScreen() {
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showRatings: true,
    allowMessages: false,
    dataCollection: true,
  });

  const handleToggle = (key: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const privacyItems = [
    {
      key: 'profileVisible',
      title: 'Perfil público',
      subtitle: 'Permitir que outros usuários vejam seu perfil',
      value: privacy.profileVisible,
      type: 'switch',
    },
    {
      key: 'showRatings',
      title: 'Mostrar avaliações',
      subtitle: 'Exibir suas avaliações publicamente',
      value: privacy.showRatings,
      type: 'switch',
    },
    {
      key: 'allowMessages',
      title: 'Permitir mensagens',
      subtitle: 'Receber mensagens de outros usuários',
      value: privacy.allowMessages,
      type: 'switch',
    },
    {
      key: 'dataCollection',
      title: 'Coleta de dados',
      subtitle: 'Permitir coleta de dados para melhorar o app',
      value: privacy.dataCollection,
      type: 'switch',
    },
  ];

  const privacyLinks = [
    {
      title: 'Política de Privacidade',
      subtitle: 'Como coletamos e usamos seus dados',
      onPress: () => {},
    },
    {
      title: 'Termos de Uso',
      subtitle: 'Condições para uso do aplicativo',
      onPress: () => {},
    },
    {
      title: 'Gerenciar dados',
      subtitle: 'Baixar ou excluir seus dados',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Controle como suas informações são compartilhadas e usadas no RateSpot.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações de privacidade</Text>
            <View style={styles.privacyContainer}>
              {privacyItems.map((item, index) => (
                <View 
                  key={item.key} 
                  style={[
                    styles.privacyItem,
                    index === privacyItems.length - 1 && styles.lastPrivacyItem
                  ]}
                >
                  <View style={styles.privacyTextContainer}>
                    <Text style={styles.privacyTitle}>{item.title}</Text>
                    <Text style={styles.privacySubtitle}>{item.subtitle}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={() => handleToggle(item.key)}
                    trackColor={{ 
                      false: Colors.text.light, 
                      true: Colors.primaryLight 
                    }}
                    thumbColor={item.value ? Colors.primary : Colors.background.primary}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentos legais</Text>
            <View style={styles.linksContainer}>
              {privacyLinks.map((link, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.linkItem,
                    index === privacyLinks.length - 1 && styles.lastLinkItem
                  ]}
                  onPress={link.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.linkTextContainer}>
                    <Text style={styles.linkTitle}>{link.title}</Text>
                    <Text style={styles.linkSubtitle}>{link.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.text.light} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  privacyContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastPrivacyItem: {
    borderBottomWidth: 0,
  },
  privacyTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 12,
    color: Colors.text.light,
    lineHeight: 16,
  },
  linksContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastLinkItem: {
    borderBottomWidth: 0,
  },
  linkTextContainer: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  linkSubtitle: {
    fontSize: 12,
    color: Colors.text.light,
  },
});