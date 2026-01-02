// WAYFARE Design System
// A sophisticated travel companion with warmth and adventure

export const theme = {
  colors: {
    // Primary: Deep Teal - ocean depths, adventure, trust
    primary: {
      50: '#F0FDFC',
      100: '#CCFBF6',
      200: '#99F6EC',
      300: '#5EEAD9',
      400: '#2DD4BF',
      500: '#0D9488',
      600: '#0F766E',
      700: '#115E59',
      800: '#134E4A',
      900: '#1A3B38',
    },
    // Secondary: Warm Sand - beaches, maps, warmth
    sand: {
      50: '#FEFDFB',
      100: '#FDF8F0',
      200: '#F9EDDC',
      300: '#F3DEC2',
      400: '#E8C899',
      500: '#D4A574',
      600: '#C08B54',
      700: '#A06E3C',
      800: '#7D5530',
      900: '#5C3F24',
    },
    // Tertiary: Sunset Coral - energy, excitement
    coral: {
      50: '#FFF5F3',
      100: '#FFE8E4',
      200: '#FFD5CD',
      300: '#FFB5A6',
      400: '#FF8A73',
      500: '#F06449',
      600: '#D94B31',
      700: '#B53921',
      800: '#93301E',
      900: '#7A2C1E',
    },
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0891B2',
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
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },
};

// Activity type colors - using brand palette
export const activityColors: Record<string, string> = {
  flight: '#0891B2',     // Cyan - sky/air travel
  hotel: '#8B5CF6',      // Violet - comfort/rest
  activity: '#0D9488',   // Primary teal - exploration
  restaurant: '#D97706', // Amber - warmth/food
  transport: '#6366F1',  // Indigo - movement
  other: '#64748B',      // Slate - neutral
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
export const purposeConfig: Record<string, { icon: string; label: string; emoji: string }> = {
  romantic: { icon: 'heart', label: 'Romantic getaway', emoji: '💕' },
  friends: { icon: 'people', label: 'Friends trip', emoji: '🎉' },
  solo: { icon: 'person', label: 'Solo adventure', emoji: '🎒' },
  family: { icon: 'home', label: 'Family holiday', emoji: '👨‍👩‍👧‍👦' },
  work: { icon: 'briefcase', label: 'Business', emoji: '💼' },
};

// Expense category configuration
export const expenseCategoryConfig: Record<string, { icon: string; color: string; label: string }> = {
  food: { icon: 'restaurant', color: '#D97706', label: 'Food & Drink' },
  transport: { icon: 'car', color: '#0891B2', label: 'Transport' },
  activity: { icon: 'compass', color: '#0D9488', label: 'Activities' },
  accommodation: { icon: 'bed', color: '#8B5CF6', label: 'Accommodation' },
  shopping: { icon: 'bag', color: '#EC4899', label: 'Shopping' },
  other: { icon: 'ellipsis-horizontal', color: '#64748B', label: 'Other' },
};

// Weather configuration
export const weatherConfig: Record<string, { icon: string; color: string }> = {
  sunny: { icon: 'sunny', color: '#F59E0B' },
  cloudy: { icon: 'cloudy', color: '#64748B' },
  rainy: { icon: 'rainy', color: '#0891B2' },
  stormy: { icon: 'thunderstorm', color: '#6366F1' },
  snowy: { icon: 'snow', color: '#60A5FA' },
};
