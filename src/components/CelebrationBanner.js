import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import { playCelebrationSound } from '../utils/celebrationSound';

export default function CelebrationBanner({ celebration, onDismiss }) {
  const slideAnim = useRef(new Animated.Value(-140)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!celebration) {
      return undefined;
    }

    playCelebrationSound();

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const timeoutId = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -140,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          onDismiss();
        }
      });
    }, 2800);

    return () => clearTimeout(timeoutId);
  }, [celebration, onDismiss, opacityAnim, slideAnim]);

  if (!celebration) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrapper,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.banner}>
        <Text style={styles.title}>{celebration.title}</Text>
        <Text style={styles.message}>{celebration.message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  banner: {
    backgroundColor: '#fff0b8',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
});
