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
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-24 h-24 rounded-full bg-primary-50 items-center justify-center mb-6">
        <Ionicons name={icon} size={48} color="#0D9488" />
      </View>
      <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
        {title}
      </Text>
      <Text className="text-base text-slate-500 text-center mb-8 leading-relaxed">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}
