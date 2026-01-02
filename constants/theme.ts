// WAYFARE Glassmorphism Design System
// Translucent, layered, ethereal aesthetics
// Inspired by: iOS Control Centre, Stripe Dashboard, Modern Fintech Apps

export const theme = {
  colors: {
    // Primary: Deep ocean blue
    primary: {
      50: 'rgba(30, 58, 95, 0.05)',
      100: 'rgba(30, 58, 95, 0.1)',
      200: 'rgba(30, 58, 95, 0.2)',
      300: 'rgba(30, 58, 95, 0.4)',
      400: '#2D4A6F',
      500: '#1E3A5F',
      600: '#162D4A',
      700: '#0F2035',
      800: '#081420',
      900: '#040A10',
    },

    // Violet: Soft purple accent
    violet: {
      50: 'rgba(124, 58, 237, 0.05)',
      100: 'rgba(124, 58, 237, 0.1)',
      200: 'rgba(124, 58, 237, 0.2)',
      300: 'rgba(124, 58, 237, 0.4)',
      400: '#8B5CF6',
      500: '#7C3AED',
      600: '#6D28D9',
      700: '#5B21B6',
      800: '#4C1D95',
      900: '#3B0F7A',
    },

    // Aurora: Cyan/teal for highlights
    aurora: {
      50: 'rgba(6, 182, 212, 0.05)',
      100: 'rgba(6, 182, 212, 0.1)',
      200: 'rgba(6, 182, 212, 0.2)',
      300: 'rgba(6, 182, 212, 0.4)',
      400: '#22D3EE',
      500: '#06B6D4',
      600: '#0891B2',
      700: '#0E7490',
    },

    // Glass surface colours
    glass: {
      white: 'rgba(255, 255, 255, 0.1)',
      whiteMd: 'rgba(255, 255, 255, 0.15)',
      whiteLg: 'rgba(255, 255, 255, 0.25)',
      dark: 'rgba(0, 0, 0, 0.1)',
      darkMd: 'rgba(0, 0, 0, 0.2)',
      darkLg: 'rgba(0, 0, 0, 0.4)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      borderStrong: 'rgba(255, 255, 255, 0.3)',
    },

    // Surface colours
    surface: {
      base: '#0A1628',
      elevated: '#0F1D32',
      overlay: 'rgba(15, 29, 50, 0.8)',
    },

    // Semantic colours
    success: '#10B981',
    successGlass: 'rgba(16, 185, 129, 0.2)',
    warning: '#F59E0B',
    warningGlass: 'rgba(245, 158, 11, 0.2)',
    error: '#EF4444',
    errorGlass: 'rgba(239, 68, 68, 0.2)',
    info: '#3B82F6',
    infoGlass: 'rgba(59, 130, 246, 0.2)',

    // Text colours
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
      muted: 'rgba(255, 255, 255, 0.3)',
    },
  },

  // Gradients for aurora/mesh backgrounds
  gradients: {
    aurora: ['#1E3A5F', '#7C3AED', '#06B6D4'],
    auroraSubtle: ['#0A1628', '#162D4A', '#1E3A5F'],
    violetBlue: ['#7C3AED', '#1E3A5F'],
    cyanViolet: ['#06B6D4', '#7C3AED'],
    glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  },

  // Blur intensity for frosted glass
  blur: {
    sm: 10,
    md: 20,
    lg: 40,
    xl: 60,
  },

  // Shadows with glow effects
  shadows: {
    glass: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 32,
      elevation: 8,
    },
    glassSm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 4,
    },
    glassLg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 48,
      elevation: 12,
    },
    glowViolet: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 8,
    },
    glowCyan: {
      shadowColor: '#06B6D4',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 8,
    },
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  // Border radius - rounded for glass aesthetic
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
      fontWeight: '700',
      letterSpacing: -1,
    },
    headline: {
      fontSize: 32,
      fontWeight: '600',
      letterSpacing: -0.5,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: 0,
    },
    caption: {
      fontSize: 14,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  },
};

// Activity type colours - glassmorphism palette
export const activityColors: Record<string, string> = {
  flight: '#7C3AED',
  hotel: '#1E3A5F',
  activity: '#06B6D4',
  restaurant: '#F59E0B',
  transport: '#8B5CF6',
  other: 'rgba(255, 255, 255, 0.3)',
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
  friends: { icon: 'people', label: 'Friends', color: '#8B5CF6' },
  solo: { icon: 'person', label: 'Solo', color: '#06B6D4' },
  family: { icon: 'home', label: 'Family', color: '#10B981' },
  work: { icon: 'briefcase', label: 'Business', color: '#1E3A5F' },
};

// Expense category configuration
export const expenseCategoryConfig: Record<string, { icon: string; color: string; label: string }> = {
  food: { icon: 'restaurant', color: '#F59E0B', label: 'Food' },
  transport: { icon: 'car', color: '#8B5CF6', label: 'Transport' },
  activity: { icon: 'compass', color: '#06B6D4', label: 'Activities' },
  accommodation: { icon: 'bed', color: '#1E3A5F', label: 'Stay' },
  shopping: { icon: 'bag', color: '#EC4899', label: 'Shopping' },
  other: { icon: 'ellipsis-horizontal', color: 'rgba(255, 255, 255, 0.4)', label: 'Other' },
};

// Weather configuration
export const weatherConfig: Record<string, { icon: string; color: string }> = {
  sunny: { icon: 'sunny', color: '#F59E0B' },
  cloudy: { icon: 'cloudy', color: 'rgba(255, 255, 255, 0.5)' },
  rainy: { icon: 'rainy', color: '#3B82F6' },
  stormy: { icon: 'thunderstorm', color: '#7C3AED' },
  snowy: { icon: 'snow', color: '#FFFFFF' },
};
