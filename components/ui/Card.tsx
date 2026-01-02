import { View, Pressable, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
}

export function Card({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
  className = '',
  style,
}: CardProps) {
  const variantStyles = {
    elevated: 'bg-white shadow-soft',
    outlined: 'bg-white border border-slate-200',
    filled: 'bg-slate-50',
    glass: 'bg-white/80 backdrop-blur-lg border border-white/20',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const content = (
    <View
      className={`
        rounded-3xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      style={style}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        className="active:scale-[0.98] active:opacity-90"
        style={style}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
