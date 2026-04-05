import { Animated, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function Flashcard({
  animatedStyle,
  questionNumber,
  text,
  hint,
  showShadow = true,
}) {
  return (
    <View style={styles.area}>
      {showShadow ? <View style={styles.shadowLayerCard} /> : null}
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.questionNumber}>{questionNumber}</Text>
        <Text style={styles.cardText}>{text}</Text>
        <Text style={styles.cardHint}>{hint}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 36,
  },
  shadowLayerCard: {
    position: 'absolute',
    width: '86%',
    height: 360,
    borderRadius: tokens.radius.panelMd,
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ rotate: '-4deg' }],
    top: '18%',
  },
  card: {
    width: '88%',
    minHeight: 370,
    borderRadius: tokens.radius.panelMd,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...tokens.shadow.card,
  },
  questionNumber: {
    position: 'absolute',
    top: 22,
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.textSoft,
  },
  cardText: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardHint: {
    fontSize: tokens.type.body,
    lineHeight: 22,
    color: colors.textSoft,
    textAlign: 'center',
    maxWidth: 230,
  },
});
