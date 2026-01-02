import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary' | 'sand' | 'coral';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const variantStyles = {
    default: { bg: 'bg-slate-100', text: 'text-slate-600' },
    success: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-700' },
    error: { bg: 'bg-red-100', text: 'text-red-700' },
    primary: { bg: 'bg-primary-100', text: 'text-primary-700' },
    sand: { bg: 'bg-sand-100', text: 'text-sand-700' },
    coral: { bg: 'bg-coral-100', text: 'text-coral-700' },
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const { bg, text } = variantStyles[variant];

  return (
    <View className={`rounded-full ${bg} self-start`}>
      <Text className={`font-semibold ${text} ${sizeStyles[size]}`}>
        {label}
      </Text>
    </View>
  );
}
