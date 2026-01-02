import { View, Pressable, ViewStyle, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Card Component - MINIMAL BRUTALIST Design
 *
 * Hard shadows, thick borders, no blur, no compromise.
 * Translates on press to simulate physical depth.
 */

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'inverted' | 'accent' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
}

export function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  className = '',
  style,
}: CardProps) {
  const getVariantStyles = (pressed: boolean = false) => {
    const base = {
      borderWidth: 3,
      borderColor: '#000000',
    };

    const variants = {
      default: {
        ...base,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
      },
      inverted: {
        ...base,
        borderColor: '#FFFFFF',
        backgroundColor: '#000000',
        shadowColor: '#FFFFFF',
      },
      accent: {
        ...base,
        backgroundColor: '#FACC15',
        shadowColor: '#000000',
      },
      outline: {
        ...base,
        backgroundColor: 'transparent',
        shadowColor: '#000000',
      },
    };

    return {
      ...variants[variant],
      // Hard shadow - no blur
      shadowOffset: pressed ? { width: 2, height: 2 } : { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
      // Translate on press
      transform: pressed
        ? [{ translateX: 2 }, { translateY: 2 }]
        : [{ translateX: 0 }, { translateY: 0 }],
    };
  };

  const paddingStyles = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 24,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onPress();
        }}
        style={({ pressed }) => [
          {
            padding: paddingStyles[padding],
            ...getVariantStyles(pressed),
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        {
          padding: paddingStyles[padding],
          ...getVariantStyles(false),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Badge - Brutalist status badge
 */
interface BadgeProps {
  label: string;
  variant?: 'default' | 'accent' | 'inverted' | 'danger';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const variantStyles = {
    default: {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      borderColor: '#000000',
    },
    accent: {
      backgroundColor: '#FACC15',
      textColor: '#000000',
      borderColor: '#000000',
    },
    inverted: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      borderColor: '#000000',
    },
    danger: {
      backgroundColor: '#EF4444',
      textColor: '#FFFFFF',
      borderColor: '#000000',
    },
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 10 },
    md: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 },
  };

  const config = variantStyles[variant];
  const sizeConfig = sizeStyles[size];

  return (
    <View
      style={{
        backgroundColor: config.backgroundColor,
        borderWidth: 2,
        borderColor: config.borderColor,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        paddingVertical: sizeConfig.paddingVertical,
      }}
    >
      <Text
        style={{
          color: config.textColor,
          fontSize: sizeConfig.fontSize,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Surface - Simple container with brutalist border
 */
interface SurfaceProps {
  children: React.ReactNode;
  variant?: 'default' | 'light' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Surface({
  children,
  variant = 'default',
  padding = 'md',
  style,
}: SurfaceProps) {
  const paddingStyles = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 24,
  };

  const variantStyles = {
    default: {
      backgroundColor: '#FFFFFF',
      borderColor: '#000000',
    },
    light: {
      backgroundColor: '#F5F5F5',
      borderColor: '#000000',
    },
    accent: {
      backgroundColor: '#FEF9C3',
      borderColor: '#000000',
    },
  };

  const config = variantStyles[variant];

  return (
    <View
      style={[
        {
          padding: paddingStyles[padding],
          backgroundColor: config.backgroundColor,
          borderWidth: 2,
          borderColor: config.borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Divider - Brutalist horizontal divider
 */
interface DividerProps {
  variant?: 'default' | 'accent';
  thickness?: number;
}

export function Divider({ variant = 'default', thickness = 3 }: DividerProps) {
  const colors = {
    default: '#000000',
    accent: '#FACC15',
  };

  return (
    <View
      style={{
        height: thickness,
        backgroundColor: colors[variant],
        width: '100%',
      }}
    />
  );
}
