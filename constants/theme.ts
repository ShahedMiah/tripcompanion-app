// MINIMAL BRUTALIST Design System
// Raw, honest, anti-corporate aesthetic

export const theme = {
  colors: {
    // Core palette - high contrast, no compromise
    black: '#000000',
    white: '#FFFFFF',

    // Accent: Electric Yellow
    accent: {
      DEFAULT: '#FACC15',
      hover: '#EAB308',
      muted: '#FEF9C3',
    },

    // Danger: Raw Red
    danger: {
      DEFAULT: '#EF4444',
      hover: '#DC2626',
      muted: '#FEE2E2',
    },

    // Grays - minimal, functional
    gray: {
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      500: '#737373',
      700: '#404040',
      900: '#171717',
    },
  },

  // Hard shadows - no blur, full opacity
  shadows: {
    brutal: {
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
    brutalSm: {
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    brutalLg: {
      shadowColor: '#000000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 12,
    },
    brutalAccent: {
      shadowColor: '#FACC15',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
    brutalWhite: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
  },

  // Press states - translate to simulate depth
  pressOffset: {
    normal: { x: 0, y: 0 },
    pressed: { x: 2, y: 2 },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
  },

  // Raw, bold typography
  typography: {
    display: {
      fontSize: 48,
      fontWeight: '900' as const,
      letterSpacing: -2,
      textTransform: 'uppercase' as const,
    },
    heading: {
      fontSize: 24,
      fontWeight: '800' as const,
      letterSpacing: -0.5,
      textTransform: 'uppercase' as const,
    },
    subheading: {
      fontSize: 14,
      fontWeight: '700' as const,
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: '500' as const,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },
};

// Activity type colors - brutalist palette
export const activityColors: Record<string, string> = {
  flight: '#000000',
  hotel: '#000000',
  activity: '#FACC15',
  restaurant: '#000000',
  transport: '#000000',
  other: '#737373',
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

// Trip purpose icons and labels
export const purposeConfig: Record<string, { icon: string; label: string; marker: string }> = {
  romantic: { icon: 'heart', label: 'ROMANTIC', marker: '+' },
  friends: { icon: 'people', label: 'FRIENDS', marker: '+' },
  solo: { icon: 'person', label: 'SOLO', marker: '+' },
  family: { icon: 'home', label: 'FAMILY', marker: '+' },
  work: { icon: 'briefcase', label: 'BUSINESS', marker: '+' },
};

// Expense category configuration
export const expenseCategoryConfig: Record<string, { icon: string; color: string; label: string }> = {
  food: { icon: 'restaurant', color: '#000000', label: 'FOOD' },
  transport: { icon: 'car', color: '#000000', label: 'TRANSPORT' },
  activity: { icon: 'compass', color: '#FACC15', label: 'ACTIVITIES' },
  accommodation: { icon: 'bed', color: '#000000', label: 'ACCOMMODATION' },
  shopping: { icon: 'bag', color: '#000000', label: 'SHOPPING' },
  other: { icon: 'ellipsis-horizontal', color: '#737373', label: 'OTHER' },
};

// Weather configuration
export const weatherConfig: Record<string, { icon: string; color: string }> = {
  sunny: { icon: 'sunny', color: '#FACC15' },
  cloudy: { icon: 'cloudy', color: '#737373' },
  rainy: { icon: 'rainy', color: '#000000' },
  stormy: { icon: 'thunderstorm', color: '#000000' },
  snowy: { icon: 'snow', color: '#000000' },
};
