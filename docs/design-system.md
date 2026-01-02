# Step 2: Design System & UI Components

## Design Tokens

### Create `constants/theme.ts`

```typescript
export const theme = {
  colors: {
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
    accent: {
      500: '#ED6A5A',
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

// Activity type colors
export const activityColors: Record<string, string> = {
  flight: '#3B82F6',      // Blue
  hotel: '#8B5CF6',       // Purple
  activity: '#10B981',    // Green
  restaurant: '#F59E0B',  // Amber
  transport: '#6366F1',   // Indigo
  other: '#6B7280',       // Gray
};

// Activity type icons (Ionicons names)
export const activityIcons: Record<string, string> = {
  flight: 'airplane',
  hotel: 'bed',
  activity: 'compass',
  restaurant: 'restaurant',
  transport: 'car',
  other: 'ellipsis-horizontal',
};

// Trip purpose icons
export const purposeIcons: Record<string, string> = {
  romantic: 'heart',
  friends: 'people',
  solo: 'person',
  family: 'home',
  work: 'briefcase',
};
```

## Base UI Components

### Create `components/ui/Button.tsx`

```tsx
import { Pressable, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
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
  fullWidth = false,
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const baseStyles = 'flex-row items-center justify-center rounded-xl';
  
  const variantStyles = {
    primary: 'bg-primary-500 active:bg-primary-600',
    secondary: 'bg-gray-100 active:bg-gray-200',
    outline: 'border-2 border-primary-500 bg-transparent active:bg-primary-50',
    ghost: 'bg-transparent active:bg-gray-100',
  };

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textVariantStyles = {
    primary: 'text-white',
    secondary: 'text-gray-800',
    outline: 'text-primary-500',
    ghost: 'text-primary-500',
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
          color={variant === 'primary' ? 'white' : '#6366F1'} 
          size="small" 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text 
            className={`
              font-semibold
              ${textVariantStyles[variant]}
              ${textSizeStyles[size]}
              ${icon ? 'ml-2' : ''}
            `}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
```

### Create `components/ui/Input.tsx`

```tsx
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-sm">
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center
          bg-gray-50 rounded-xl px-4
          border-2
          ${isFocused ? 'border-primary-500 bg-white' : 'border-transparent'}
          ${error ? 'border-error' : ''}
        `}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 py-3 text-gray-900 text-base"
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-error text-sm mt-1">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-gray-400 text-sm mt-1">{hint}</Text>
      )}
    </View>
  );
}
```

### Create `components/ui/Card.tsx`

```tsx
import { View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Card({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
  className = '',
}: CardProps) {
  const variantStyles = {
    elevated: 'bg-white shadow-lg shadow-black/5',
    outlined: 'bg-white border border-gray-200',
    filled: 'bg-gray-50',
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
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
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
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
```

### Create `components/ui/Badge.tsx`

```tsx
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    primary: 'bg-primary-100 text-primary-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <View className={`rounded-full ${variantStyles[variant].split(' ')[0]}`}>
      <Text
        className={`
          font-medium
          ${variantStyles[variant].split(' ')[1]}
          ${sizeStyles[size]}
        `}
      >
        {label}
      </Text>
    </View>
  );
}
```

### Create `components/ui/Avatar.tsx`

```tsx
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ source, name, size = 'md' }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        className={`${sizeStyles[size]} rounded-full`}
      />
    );
  }

  return (
    <View
      className={`
        ${sizeStyles[size]}
        rounded-full bg-primary-100
        items-center justify-center
      `}
    >
      <Text className={`${textSizeStyles[size]} font-semibold text-primary-600`}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
}
```

### Create `components/ui/IconButton.tsx`

```tsx
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'ghost';
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
    md: { container: 'w-10 h-10', icon: 22 },
    lg: { container: 'w-12 h-12', icon: 26 },
  };

  const variantStyles = {
    default: 'bg-gray-100 active:bg-gray-200',
    primary: 'bg-primary-500 active:bg-primary-600',
    ghost: 'bg-transparent active:bg-gray-100',
  };

  const iconColors = {
    default: color || '#374151',
    primary: 'white',
    ghost: color || '#6366F1',
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
```

### Create `components/ui/EmptyState.tsx`

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-6">
        <Ionicons name={icon} size={40} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        {title}
      </Text>
      <Text className="text-base text-gray-500 text-center mb-6">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}
```

### Create `components/ui/index.ts`

```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Badge } from './Badge';
export { Avatar } from './Avatar';
export { IconButton } from './IconButton';
export { EmptyState } from './EmptyState';
```

## Usage Example

```tsx
import { Button, Card, Input, Badge, Avatar } from '@/components/ui';

// In your component:
<Card onPress={() => console.log('pressed')}>
  <Avatar name="John Doe" size="lg" />
  <Input 
    label="Email"
    placeholder="Enter your email"
    keyboardType="email-address"
  />
  <Badge label="Planning" variant="primary" />
  <Button title="Continue" onPress={() => {}} variant="primary" />
</Card>
```
