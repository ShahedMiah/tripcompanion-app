import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sand' | 'coral';
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const baseStyles = 'flex-row items-center justify-center';

  const variantStyles = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-slate-100 active:bg-slate-200',
    outline: 'border-2 border-primary-600 bg-transparent active:bg-primary-50',
    ghost: 'bg-transparent active:bg-slate-100',
    sand: 'bg-sand-500 active:bg-sand-600',
    coral: 'bg-coral-500 active:bg-coral-600',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 rounded-xl',
    md: 'px-6 py-3.5 rounded-2xl',
    lg: 'px-8 py-4 rounded-2xl',
  };

  const textVariantStyles = {
    primary: 'text-white',
    secondary: 'text-slate-800',
    outline: 'text-primary-600',
    ghost: 'text-primary-600',
    sand: 'text-white',
    coral: 'text-white',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'sand' || variant === 'coral' ? 'white' : '#0D9488'}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
          <Text
            className={`
              font-semibold tracking-wide
              ${textVariantStyles[variant]}
              ${textSizeStyles[size]}
            `}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
        </>
      )}
    </Pressable>
  );
}
