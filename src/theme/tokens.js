const colors = {
  primaryBlueStart: '#5F6BFF',
  primaryBlueEnd: '#0D6EFD',
  background: '#EEF2FF',
  surface: '#FFFFFF',
  softSurface: '#F7F7F8',
  textPrimary: '#13264B',
  textSecondary: '#7D8AA5',
  accentYellow: '#F4C542',
  accentOrange: '#F4A63A',
  accentGreen: '#6FD19A',
  lavenderCard: '#EEE9FF',
  beigeCard: '#F8EBDD',
  borderSoft: '#E9ECF2',
  white: '#FFFFFF',
  heroText: '#EAF1FF',
  shadow: 'rgba(35, 58, 120, 0.08)',
};

const radius = {
  panelLg: 36,
  panel: 32,
  panelMd: 28,
  card: 24,
  cardSm: 20,
  button: 20,
  pill: 999,
};

const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const type = {
  screenTitle: 38,
  headerTitle: 30,
  sectionTitle: 20,
  cardTitle: 18,
  body: 15,
  caption: 13,
};

const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 3,
  },
};

export default {
  colors,
  radius,
  spacing,
  type,
  shadow,
};
