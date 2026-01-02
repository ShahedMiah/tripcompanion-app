import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Button Component - MINIMAL BRUTALIST Design
 *
 * Hard shadows, thick borders, no compromise.
 * Shadow translates on press to simulate physical depth.
 */

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  const getVariantStyles = (pressed: boolean) => {
    const base = {
      borderWidth: 3,
      borderColor: '#000000',
    };

    const variants = {
      primary: {
        ...base,
        backgroundColor: '#000000',
      },
      secondary: {
        ...base,
        backgroundColor: '#FFFFFF',
      },
      outline: {
        ...base,
        backgroundColor: 'transparent',
      },
      ghost: {
        borderWidth: 0,
        backgroundColor: 'transparent',
      },
      accent: {
        ...base,
        backgroundColor: '#FACC15',
      },
      inverted: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
        backgroundColor: '#000000',
      },
    };

    return {
      ...variants[variant],
      // Hard shadow - moves on press
      shadowColor: variant === 'inverted' ? '#FFFFFF' : '#000000',
      shadowOffset: pressed ? { width: 2, height: 2 } : { width: 4, height: 4 },
      shadowOpacity: variant === 'ghost' ? 0 : 1,
      shadowRadius: 0,
      elevation: variant === 'ghost' ? 0 : 8,
      // Translate on press to simulate depth
      transform: pressed
        ? [{ translateX: 2 }, { translateY: 2 }]
        : [{ translateX: 0 }, { translateY: 0 }],
    };
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 16, paddingVertical: 10 },
    md: { paddingHorizontal: 24, paddingVertical: 14 },
    lg: { paddingHorizontal: 32, paddingVertical: 18 },
  };

  const textVariantStyles = {
    primary: '#FFFFFF',
    secondary: '#000000',
    outline: '#000000',
    ghost: '#000000',
    accent: '#000000',
    inverted: '#FFFFFF',
  };

  const textSizeStyles = {
    sm: { fontSize: 12, letterSpacing: 1 },
    md: { fontSize: 14, letterSpacing: 1.5 },
    lg: { fontSize: 16, letterSpacing: 2 },
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          ...sizeStyles[size],
          ...getVariantStyles(pressed),
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'inverted' ? '#FFFFFF' : '#000000'}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={{
              fontWeight: '800',
              textTransform: 'uppercase',
              color: textVariantStyles[variant],
              ...textSizeStyles[size],
            }}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={{ marginLeft: 8 }}>{icon}</View>}
        </>
      )}
    </Pressable>
  );
}

/**
 * IconButton - Brutalist square icon button
 */
interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function IconButton({
  icon,
  onPress,
  variant = 'secondary',
  size = 'md',
  disabled = false,
}: IconButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  const sizeStyles = { sm: 40, md: 48, lg: 56 };

  const variantStyles = {
    primary: { backgroundColor: '#000000', borderColor: '#000000' },
    secondary: { backgroundColor: '#FFFFFF', borderColor: '#000000' },
    accent: { backgroundColor: '#FACC15', borderColor: '#000000' },
    inverted: { backgroundColor: '#000000', borderColor: '#FFFFFF' },
  };

  const buttonSize = sizeStyles[size];
  const config = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        width: buttonSize,
        height: buttonSize,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: config.borderColor,
        backgroundColor: config.backgroundColor,
        shadowColor: variant === 'inverted' ? '#FFFFFF' : '#000000',
        shadowOffset: pressed ? { width: 2, height: 2 } : { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
        opacity: disabled ? 0.5 : 1,
        transform: pressed
          ? [{ translateX: 2 }, { translateY: 2 }]
          : [{ translateX: 0 }, { translateY: 0 }],
      })}
    >
      {icon}
    </Pressable>
  );
}

/**
 * FAB - Floating Action Button with brutal shadow
 */
interface FABProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'accent';
  size?: 'md' | 'lg';
}

export function FAB({ icon, onPress, variant = 'primary', size = 'lg' }: FABProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  const sizeStyles = { md: 52, lg: 60 };
  const buttonSize = sizeStyles[size];

  const variantStyles = {
    primary: { backgroundColor: '#000000' },
    accent: { backgroundColor: '#FACC15' },
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        width: buttonSize,
        height: buttonSize,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#000000',
        backgroundColor: variantStyles[variant].backgroundColor,
        shadowColor: '#000000',
        shadowOffset: pressed ? { width: 3, height: 3 } : { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 12,
        transform: pressed
          ? [{ translateX: 3 }, { translateY: 3 }]
          : [{ translateX: 0 }, { translateY: 0 }],
      })}
    >
      {icon}
    </Pressable>
  );
}

/**
 * TextLink - Raw text link
 */
interface TextLinkProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export function TextLink({ title, onPress, variant = 'default', size = 'md' }: TextLinkProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const sizeStyles = { sm: 12, md: 14, lg: 16 };
  const variantColors = {
    default: '#000000',
    accent: '#FACC15',
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderBottomWidth: 2,
        borderBottomColor: variantColors[variant],
      })}
    >
      <Text
        style={{
          color: variantColors[variant],
          fontSize: sizeStyles[size],
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
