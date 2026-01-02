import { Pressable, Text, ActivityIndicator, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Button Component - Bento Editorial Design
 *
 * Refined, editorial buttons with warm terracotta primary and
 * sophisticated secondary variants. Generous padding, soft corners.
 */

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'forest' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

// Bento Editorial colour palette
const COLORS = {
  cream: '#FFFBF5',
  terracotta: {
    500: '#C4704A',
    600: '#A85A38',
  },
  forest: {
    500: '#4A7B5A',
    700: '#2D4739',
  },
  stone: {
    100: '#F5F3F0',
    200: '#E8E4DE',
    500: '#968B7D',
    700: '#5C5147',
  },
  ink: {
    900: '#1A1A1A',
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Editorial size styles - generous padding, rounded corners
  const sizeStyles = {
    sm: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 13,
      borderRadius: 12,
      letterSpacing: 0.3,
    },
    md: {
      paddingHorizontal: 24,
      paddingVertical: 14,
      fontSize: 15,
      borderRadius: 16,
      letterSpacing: 0.2,
    },
    lg: {
      paddingHorizontal: 32,
      paddingVertical: 18,
      fontSize: 16,
      borderRadius: 20,
      letterSpacing: 0.1,
    },
  };

  const sizeConfig = sizeStyles[size];

  // Editorial variant configurations
  const variantConfig = {
    primary: {
      backgroundColor: COLORS.terracotta[500],
      pressedBackgroundColor: COLORS.terracotta[600],
      textColor: '#FFFFFF',
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: COLORS.terracotta[500],
      shadowOpacity: 0.25,
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      pressedBackgroundColor: COLORS.stone[100],
      textColor: COLORS.ink[900],
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: '#1A1714',
      shadowOpacity: 0.08,
    },
    outline: {
      backgroundColor: 'transparent',
      pressedBackgroundColor: COLORS.stone[100],
      textColor: COLORS.terracotta[500],
      borderWidth: 1.5,
      borderColor: COLORS.terracotta[500],
      shadowColor: 'transparent',
      shadowOpacity: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      pressedBackgroundColor: COLORS.stone[100],
      textColor: COLORS.stone[700],
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: 'transparent',
      shadowOpacity: 0,
    },
    forest: {
      backgroundColor: COLORS.forest[700],
      pressedBackgroundColor: COLORS.forest[500],
      textColor: '#FFFFFF',
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: COLORS.forest[700],
      shadowOpacity: 0.2,
    },
    muted: {
      backgroundColor: COLORS.stone[100],
      pressedBackgroundColor: COLORS.stone[200],
      textColor: COLORS.stone[700],
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: 'transparent',
      shadowOpacity: 0,
    },
  };

  const config = variantConfig[variant];

  const buttonStyle = (pressed: boolean): ViewStyle => ({
    backgroundColor: pressed ? config.pressedBackgroundColor : config.backgroundColor,
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    paddingVertical: sizeConfig.paddingVertical,
    borderRadius: sizeConfig.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.5 : 1,
    // Soft editorial shadow
    shadowColor: config.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: config.shadowOpacity,
    shadowRadius: 12,
    elevation: config.shadowOpacity > 0 ? 4 : 0,
    // Subtle scale on press
    transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => buttonStyle(pressed)}
    >
      {loading ? (
        <ActivityIndicator
          color={config.textColor}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={{ marginRight: 10 }}>{icon}</View>
          )}
          <Text
            style={{
              color: config.textColor,
              fontSize: sizeConfig.fontSize,
              fontWeight: '600',
              letterSpacing: sizeConfig.letterSpacing,
            }}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={{ marginLeft: 10 }}>{icon}</View>
          )}
        </>
      )}
    </Pressable>
  );
}

/**
 * IconButton - Circular icon-only button for toolbars and actions
 */
interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
}: IconButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const sizeStyles = {
    sm: { size: 36 },
    md: { size: 44 },
    lg: { size: 52 },
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.terracotta[500],
      pressedBackgroundColor: COLORS.terracotta[600],
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      pressedBackgroundColor: COLORS.stone[100],
    },
    ghost: {
      backgroundColor: 'transparent',
      pressedBackgroundColor: COLORS.stone[100],
    },
    muted: {
      backgroundColor: COLORS.stone[100],
      pressedBackgroundColor: COLORS.stone[200],
    },
  };

  const config = variantStyles[variant];
  const sizeConfig = sizeStyles[size];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        width: sizeConfig.size,
        height: sizeConfig.size,
        borderRadius: sizeConfig.size / 2,
        backgroundColor: pressed ? config.pressedBackgroundColor : config.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      })}
    >
      {icon}
    </Pressable>
  );
}

/**
 * TextButton - Minimal text-only button for inline actions
 */
interface TextButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function TextButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: TextButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const sizeStyles = {
    sm: { fontSize: 13 },
    md: { fontSize: 15 },
    lg: { fontSize: 17 },
  };

  const variantStyles = {
    primary: { color: COLORS.terracotta[500] },
    secondary: { color: COLORS.ink[900] },
    muted: { color: COLORS.stone[500] },
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
      })}
    >
      <Text
        style={{
          color: variantStyles[variant].color,
          fontSize: sizeStyles[size].fontSize,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
