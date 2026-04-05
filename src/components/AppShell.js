import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import ScreenContainer from './ScreenContainer';

export default function AppShell({ children, bottomNav, scroll = false, contentContainerStyle }) {
  const { width } = useWindowDimensions();
  const shellWidth = Math.min(Math.max(width - 48, 0), 430);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.screen}>
        <View style={[styles.frame, { width: shellWidth }]}>
          {scroll ? (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.content, contentContainerStyle]}>{children}</View>
          )}
          {bottomNav}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    maxWidth: 430,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    flex: 1,
  },
});
