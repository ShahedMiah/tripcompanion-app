// WAYFARE Bento Editorial Design System
// Warm, sophisticated aesthetic with terracotta accents on cream
// Inspired by: Editorial magazines, warm colour palettes, organic shapes

/**
 * Bento Editorial Colour Palette
 * Primary: Terracotta (#C4704A) - warm, inviting accent
 * Secondary: Forest Green (#4A7B5A) - natural, calming
 * Background: Cream (#FFFBF5) - warm white
 * Text: Ink (#1A1A1A) - readable, sophisticated
 */
export const bentoColors = {
  // Primary: Terracotta - warm, earthy accent
  terracotta: {
    50: '#FEF7F4',
    100: '#FCEEE8',
    200: '#F9DDD1',
    300: '#F2C5B0',
    400: '#D88A66',
    500: '#C4704A',
    600: '#A85A38',
    700: '#8B4730',
    800: '#6E3826',
    900: '#52291C',
  },

  // Secondary: Forest Green - natural, calming
  forest: {
    50: '#F0F5F2',
    100: '#E0EBE4',
    200: '#C2D7C9',
    300: '#9FC1AA',
    400: '#6FA17E',
    500: '#4A7B5A',
    600: '#3D654A',
    700: '#2D4739',
    800: '#233A2E',
    900: '#1A2C22',
  },

  // Warm amber for highlights
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#D4A574',
    600: '#B8860B',
    700: '#92400E',
  },

  // Neutral: Stone - warm greys
  stone: {
    50: '#FAFAF9',
    100: '#F5F3F0',
    200: '#E8E4DE',
    300: '#D5CFC6',
    400: '#B8AFA3',
    500: '#968B7D',
    600: '#7A6F63',
    700: '#5C5147',
    800: '#44403C',
    900: '#2E2A26',
  },

  // Ink: Dark text colour
  ink: {
    800: '#2D2D2D',
    900: '#1A1A1A',
  },

  // Backgrounds
  cream: '#FFFBF5',
  white: '#FFFFFF',

  // Semantic colours
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
};

// Re-export as COLORS for backward compatibility
export const COLORS = bentoColors;

export const theme = {
  colors: bentoColors,

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  // Border radius - soft, organic shapes
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },

  // Border widths
  borders: {
    thin: 1,
    medium: 1.5,
    thick: 2,
  },

  // Typography
  typography: {
    display: {
      fontSize: 48,
      fontWeight: '700' as const,
      letterSpacing: -1.5,
      lineHeight: 52,
    },
    headline: {
      fontSize: 32,
      fontWeight: '600' as const,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: '600' as const,
      letterSpacing: -0.3,
      lineHeight: 32,
    },
    titleSm: {
      fontSize: 20,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      letterSpacing: 0,
      lineHeight: 24,
    },
    bodySm: {
      fontSize: 15,
      fontWeight: '400' as const,
      letterSpacing: 0,
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      fontWeight: '500' as const,
      letterSpacing: 0.2,
      lineHeight: 20,
    },
    label: {
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelSm: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 0.3,
      lineHeight: 14,
    },
  },

  // Shadows - soft, warm shadows
  shadows: {
    sm: {
      shadowColor: '#1A1714',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: '#1A1714',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#1A1714',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    terracotta: {
      shadowColor: '#C4704A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 4,
    },
    forest: {
      shadowColor: '#2D4739',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },
};

// Activity type colours - Bento Editorial palette
export const activityColors: Record<string, string> = {
  flight: bentoColors.terracotta[500],
  hotel: bentoColors.forest[700],
  activity: bentoColors.forest[500],
  restaurant: bentoColors.amber[600],
  transport: bentoColors.terracotta[600],
  other: bentoColors.stone[400],
};

// Activity type icons (Ionicons names)
export const activityIcons: Record<string, string> = {
  flight: 'airplane',
  hotel: 'bed',
  activity: 'compass',
  restaurant: 'restaurant',
  transport: 'car',
  other: 'ellipsis-horizontal',
};

// Trip purpose configuration
export const purposeConfig: Record<string, { icon: string; label: string; color: string }> = {
  romantic: { icon: 'heart', label: 'Romantic', color: '#EC4899' },
  friends: { icon: 'people', label: 'Friends', color: bentoColors.terracotta[500] },
  solo: { icon: 'person', label: 'Solo', color: bentoColors.forest[500] },
  family: { icon: 'home', label: 'Family', color: bentoColors.amber[600] },
  work: { icon: 'briefcase', label: 'Business', color: bentoColors.stone[700] },
};

// Expense category configuration
export const expenseCategoryConfig: Record<string, { icon: string; color: string; label: string }> = {
  food: { icon: 'restaurant', color: bentoColors.amber[600], label: 'Food' },
  transport: { icon: 'car', color: bentoColors.terracotta[500], label: 'Transport' },
  activity: { icon: 'compass', color: bentoColors.forest[500], label: 'Activities' },
  accommodation: { icon: 'bed', color: bentoColors.forest[700], label: 'Stay' },
  shopping: { icon: 'bag', color: '#EC4899', label: 'Shopping' },
  other: { icon: 'ellipsis-horizontal', color: bentoColors.stone[500], label: 'Other' },
};

// Weather configuration
export const weatherConfig: Record<string, { icon: string; color: string }> = {
  sunny: { icon: 'sunny', color: bentoColors.amber[500] },
  cloudy: { icon: 'cloudy', color: bentoColors.stone[500] },
  rainy: { icon: 'rainy', color: bentoColors.info },
  stormy: { icon: 'thunderstorm', color: bentoColors.stone[700] },
  snowy: { icon: 'snow', color: bentoColors.white },
};

// Trip status configuration
export const tripStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  planning: {
    label: 'Planning',
    bg: bentoColors.amber[100],
    text: bentoColors.amber[600],
  },
  booked: {
    label: 'Booked',
    bg: bentoColors.forest[100],
    text: bentoColors.forest[700],
  },
  active: {
    label: 'Active',
    bg: bentoColors.terracotta[100],
    text: bentoColors.terracotta[600],
  },
  completed: {
    label: 'Done',
    bg: bentoColors.stone[200],
    text: bentoColors.stone[700],
  },
};
