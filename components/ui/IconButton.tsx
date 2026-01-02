import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'ghost' | 'sand';
  color?: string;
}

export function IconButton({
  icon,
  onPress,
  size = 'md',
  variant = 'default',
  color,
}: IconButtonProps) {
  const sizeStyles = {
    sm: { container: 'w-8 h-8', icon: 18 },
    md: { container: 'w-11 h-11', icon: 22 },
    lg: { container: 'w-14 h-14', icon: 26 },
  };

  const variantStyles = {
    default: 'bg-slate-100 active:bg-slate-200',
    primary: 'bg-primary-600 active:bg-primary-700',
    ghost: 'bg-transparent active:bg-slate-100',
    sand: 'bg-sand-100 active:bg-sand-200',
  };

  const iconColors = {
    default: color || '#334155',
    primary: 'white',
    ghost: color || '#0D9488',
    sand: color || '#7D5530',
  };

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className={`
        ${sizeStyles[size].container}
        ${variantStyles[variant]}
        rounded-full items-center justify-center
      `}
    >
      <Ionicons
        name={icon}
        size={sizeStyles[size].icon}
        color={iconColors[variant]}
      />
    </Pressable>
  );
}
