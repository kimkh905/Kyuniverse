import { Animated, StyleSheet, View } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import TabItem from './TabItem';
import tokens from '../theme/tokens';
import colors from '../theme/colors';

export default function TabBar({ tabs, activeTab, onChange }) {
  const [layouts, setLayouts] = useState({});
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab === activeTab), [activeTab, tabs]);

  useEffect(() => {
    const layout = layouts[activeIndex];

    if (!layout) {
      return;
    }

    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: layout.x,
        useNativeDriver: false,
        friction: 8,
      }),
      Animated.spring(indicatorWidth, {
        toValue: layout.width,
        useNativeDriver: false,
        friction: 8,
      }),
    ]).start();
  }, [activeIndex, indicatorWidth, indicatorX, layouts]);

  return (
    <View style={styles.bar}>
      {tabs.map((tab, index) => (
        <TabItem
          key={tab}
          label={tab}
          active={tab === activeTab}
          onPress={() => onChange(tab)}
          onLayout={(event) => {
            const { x, width } = event.nativeEvent.layout;
            setLayouts((current) => ({ ...current, [index]: { x, width } }));
          }}
        />
      ))}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            width: indicatorWidth,
            transform: [{ translateX: indicatorX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
});
