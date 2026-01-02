import { View, Text, Image } from 'react-native';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ source, name, size = 'md' }: AvatarProps) {
  const sizeStyles = {
    sm: { container: 'w-8 h-8', text: 'text-xs' },
    md: { container: 'w-10 h-10', text: 'text-sm' },
    lg: { container: 'w-12 h-12', text: 'text-base' },
    xl: { container: 'w-16 h-16', text: 'text-xl' },
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getColor = (name: string) => {
    const colors = [
      'bg-primary-500',
      'bg-coral-500',
      'bg-sand-500',
      'bg-violet-500',
      'bg-cyan-500',
      'bg-emerald-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        className={`${sizeStyles[size].container} rounded-full`}
      />
    );
  }

  return (
    <View
      className={`
        ${sizeStyles[size].container}
        rounded-full ${getColor(name || '?')}
        items-center justify-center
      `}
    >
      <Text className={`${sizeStyles[size].text} font-bold text-white`}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
}
