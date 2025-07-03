import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: any;
}

const Avatar = ({ uri, name = '', size = 100, style }: AvatarProps) => {
  // Generate initials from name
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate a consistent color based on name
  const getAvatarColor = (fullName: string) => {
    if (!fullName) return Colors.primary;
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(name);

  // If we have a valid URI and it's not a default person image, show it
  const shouldShowImage = uri && 
    !uri.includes('pexels-photo-220453') && 
    !uri.includes('pexels-photo-774909') && 
    !uri.includes('pexels-photo-1222271') && 
    !uri.includes('pexels-photo-415829');

  if (shouldShowImage) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
          style
        ]}
        onError={() => {
          // If image fails to load, fall back to initials
        }}
      />
    );
  }

  // Show initials avatar
  return (
    <View
      style={[
        styles.initialsContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style
      ]}
    >
      <Text
        style={[
          styles.initialsText,
          { fontSize: size * 0.4 }
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.backgroundProfile,
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  initialsText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
});

export default Avatar;