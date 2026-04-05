import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

const navItems = [
  { label: 'Home', icon: 'home', route: 'Home' },
  { label: 'Profile', icon: 'person', route: 'Profile' },
];

export default function BottomNavigation({ navigation, currentRoute, onCenterPress }) {
  return (
    <View style={styles.shell}>
      <Pressable
        onPress={() => {
          if (currentRoute !== navItems[0].route) {
            navigation.navigate(navItems[0].route);
          }
        }}
        style={({ pressed }) => [
          styles.item,
          currentRoute === navItems[0].route && styles.itemActive,
          pressed && styles.itemPressed,
        ]}
      >
        <Ionicons
          name={navItems[0].icon}
          size={16}
          color={currentRoute === navItems[0].route ? colors.white : 'rgba(255,255,255,0.76)'}
        />
        <Text style={[styles.label, currentRoute === navItems[0].route && styles.labelActive]}>
          {navItems[0].label}
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed, hovered }) => [
          styles.centerAction,
          hovered && styles.centerHovered,
          pressed && styles.itemPressed,
        ]}
        onPress={onCenterPress}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>

      <Pressable
        onPress={() => {
          if (currentRoute !== navItems[1].route) {
            navigation.navigate(navItems[1].route);
          }
        }}
        style={({ pressed }) => [
          styles.item,
          currentRoute === navItems[1].route && styles.itemActive,
          pressed && styles.itemPressed,
        ]}
      >
        <Ionicons
          name={navItems[1].icon}
          size={16}
          color={currentRoute === navItems[1].route ? colors.white : 'rgba(255,255,255,0.76)'}
        />
        <Text style={[styles.label, currentRoute === navItems[1].route && styles.labelActive]}>
          {navItems[1].label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: tokens.radius.panelMd,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...tokens.shadow.card,
  },
  item: {
    flex: 1,
    borderRadius: tokens.radius.button,
    paddingVertical: 10,
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  itemPressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.76)',
    marginTop: 2,
  },
  labelActive: {
    color: colors.white,
  },
  centerAction: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    borderWidth: 4,
    borderColor: colors.background,
  },
  centerHovered: {
    shadowRadius: 40,
    elevation: 6,
  },
});
