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
        <Text className="text-slate-700 font-medium mb-2 text-sm tracking-wide">
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center
          bg-slate-50 rounded-2xl px-4
          border-2
          ${isFocused ? 'border-primary-500 bg-white' : 'border-transparent'}
          ${error ? 'border-error bg-red-50' : ''}
        `}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 py-4 text-slate-900 text-base"
          placeholderTextColor="#94A3B8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-error text-sm mt-1.5 ml-1">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-slate-400 text-sm mt-1.5 ml-1">{hint}</Text>
      )}
    </View>
  );
}
