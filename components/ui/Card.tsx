import { View, Pressable, ViewStyle, Text, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * WAYFARE Card Component - Bento Editorial Design
 *
 * Soft, editorial cards with warm shadows and generous border radius.
 * Supports multiple variants for different contexts in the bento grid.
 */

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled' | 'muted' | 'accent' | 'forest';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'bento-sm' | 'bento' | 'bento-lg';
  className?: string;
  style?: ViewStyle;
}

// Bento Editorial colour palette
const COLORS = {
  cream: '#FFFBF5',
  terracotta: '#C4704A',
  forest: '#2D4739',
  stone: {
    100: '#F5F3F0',
    200: '#E8E4DE',
    300: '#D5CFC6',
    500: '#968B7D',
  },
  ink: {
    900: '#1A1A1A',
    950: '#0D0D0D',
  },
};

// Editorial shadow configurations
const SHADOWS = {
  card: {
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
};

export function Card({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
  rounded = 'bento',
  className = '',
  style,
}: CardProps) {
  // Bento Editorial variant configurations
  const variantConfig = {
    elevated: {
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      borderColor: 'transparent',
      ...SHADOWS.elevated,
    },
    outlined: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: COLORS.stone[200],
      ...SHADOWS.subtle,
    },
    filled: {
      backgroundColor: COLORS.cream,
      borderWidth: 0,
      borderColor: 'transparent',
      ...SHADOWS.subtle,
    },
    muted: {
      backgroundColor: COLORS.stone[100],
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    accent: {
      backgroundColor: COLORS.terracotta,
      borderWidth: 0,
      borderColor: 'transparent',
      ...SHADOWS.card,
    },
    forest: {
      backgroundColor: COLORS.forest,
      borderWidth: 0,
      borderColor: 'transparent',
      ...SHADOWS.card,
    },
  };

  const paddingStyles = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  };

  const borderRadiusStyles = {
    'bento-sm': 16,
    'bento': 24,
    'bento-lg': 32,
  };

  const config = variantConfig[variant];

  const cardStyle: ViewStyle = {
    backgroundColor: config.backgroundColor,
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    borderRadius: borderRadiusStyles[rounded],
    padding: paddingStyles[padding],
    shadowColor: config.shadowColor,
    shadowOffset: config.shadowOffset,
    shadowOpacity: config.shadowOpacity,
    shadowRadius: config.shadowRadius,
    elevation: config.elevation,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          cardStyle,
          {
            opacity: pressed ? 0.92 : 1,
            transform: pressed
              ? [{ scale: 0.98 }]
              : [{ scale: 1 }],
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}

/**
 * BentoGrid - Container for bento-style card layouts
 * Provides consistent spacing and alignment for asymmetric grid layouts.
 */
interface BentoGridProps {
  children: React.ReactNode;
  gap?: number;
  padding?: number;
  style?: ViewStyle;
}

export function BentoGrid({
  children,
  gap = 12,
  padding = 20,
  style,
}: BentoGridProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: padding,
          marginHorizontal: -gap / 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * BentoCard - Pre-configured card for bento grid layouts
 * Supports various size configurations for magazine-style arrangements.
 */
interface BentoCardProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'wide' | 'tall' | 'large';
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled' | 'muted' | 'accent' | 'forest';
  style?: ViewStyle;
}

export function BentoCard({
  children,
  size = 'small',
  onPress,
  variant = 'elevated',
  style,
}: BentoCardProps) {
  const GAP = 12;
  const PADDING = 20;
  const cardWidth = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

  // Size configurations for bento grid
  const sizeStyles: Record<string, ViewStyle> = {
    small: {
      width: cardWidth,
      aspectRatio: 1,
    },
    medium: {
      width: cardWidth,
      aspectRatio: 1.2,
    },
    wide: {
      width: SCREEN_WIDTH - PADDING * 2,
      aspectRatio: 2.2,
    },
    tall: {
      width: cardWidth,
      aspectRatio: 0.7,
    },
    large: {
      width: SCREEN_WIDTH - PADDING * 2,
      aspectRatio: 1.3,
    },
  };

  return (
    <View style={{ padding: GAP / 2 }}>
      <Card
        onPress={onPress}
        variant={variant}
        padding="lg"
        style={[sizeStyles[size], style]}
      >
        {children}
      </Card>
    </View>
  );
}

/**
 * FeatureCard - Editorial card with overline, title, and optional action
 * Perfect for promotional content and feature highlights.
 */
interface FeatureCardProps {
  overline?: string;
  title: string;
  description?: string;
  onPress?: () => void;
  variant?: 'elevated' | 'accent' | 'forest';
  style?: ViewStyle;
}

export function FeatureCard({
  overline,
  title,
  description,
  onPress,
  variant = 'elevated',
  style,
}: FeatureCardProps) {
  const isLight = variant === 'elevated';

  return (
    <Card onPress={onPress} variant={variant} padding="lg" style={style}>
      {overline && (
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: isLight ? COLORS.terracotta : 'rgba(255, 255, 255, 0.7)',
            marginBottom: 8,
          }}
        >
          {overline}
        </Text>
      )}
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          letterSpacing: -0.5,
          color: isLight ? COLORS.ink[900] : '#FFFFFF',
          marginBottom: description ? 8 : 0,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            color: isLight ? COLORS.stone[500] : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          {description}
        </Text>
      )}
    </Card>
  );
}
