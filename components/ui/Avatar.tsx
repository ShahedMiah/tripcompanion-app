import { View, Text, Image } from 'react-native';

/**
 * WAYFARE Avatar Component - Bento Editorial Design
 *
 * Displays user avatar with image or initials fallback.
 * Warm terracotta-based colour palette for consistency.
 */

// Bento Editorial colour palette for avatars
const AVATAR_COLORS = [
  '#C4704A', // terracotta
  '#4A7B5A', // forest
  '#D4A574', // amber
  '#8B5CF6', // violet
  '#3B82F6', // blue
  '#EC4899', // pink
];

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ source, name, size = 'md' }: AvatarProps) {
  const sizeConfig = {
    sm: { dimension: 32, fontSize: 12, borderRadius: 10 },
    md: { dimension: 40, fontSize: 14, borderRadius: 12 },
    lg: { dimension: 48, fontSize: 16, borderRadius: 14 },
    xl: { dimension: 64, fontSize: 22, borderRadius: 20 },
  };

  const config = sizeConfig[size];

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
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={{
          width: config.dimension,
          height: config.dimension,
          borderRadius: config.borderRadius,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: config.dimension,
        height: config.dimension,
        borderRadius: config.borderRadius,
        backgroundColor: getColor(name || '?'),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{
        fontSize: config.fontSize,
        fontWeight: '700',
        color: '#FFFFFF',
      }}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
}
