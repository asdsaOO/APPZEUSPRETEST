import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';

import { colors } from '@/constants/colors';

type CircleButtonProps = {
  title: string;
  onPress?: PressableProps['onPress'];
};

export function CircleButton({ title, onPress }: CircleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
