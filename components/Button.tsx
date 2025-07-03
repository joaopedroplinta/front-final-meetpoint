import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { Colors, Fonts } from '../constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  primary?: boolean;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const Button = ({ 
  title, 
  onPress, 
  primary = true, 
  outline = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  children
}: ButtonProps) => {
  const buttonStyles = [
    styles.button,
    primary && !outline && styles.primaryButton,
    outline && styles.outlineButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    primary && !outline && styles.primaryText,
    outline && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={outline ? Colors.primary : Colors.white} 
          size="small" 
        />
      ) : children ? (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.hoverFocus,
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  primaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.white,
  },
  childrenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;