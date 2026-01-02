import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, IconButton } from '@/components/ui';
import { useAppStore } from '@/stores/appStore';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-6 pt-4">
            <IconButton
              icon="arrow-back"
              onPress={() => router.back()}
              variant="ghost"
            />
          </View>

          <View className="flex-1 px-8 pt-8">
            {/* Title */}
            <View className="mb-10">
              <Text className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back
              </Text>
              <Text className="text-lg text-slate-500">
                Sign in to continue planning your adventures
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-5">
              <Input
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<Ionicons name="mail-outline" size={20} color="#94A3B8" />}
              />

              <View>
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />}
                  rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#94A3B8"
                      />
                    </Pressable>
                  }
                />
                <Pressable className="mt-2 self-end">
                  <Text className="text-primary-600 font-medium">
                    Forgot password?
                  </Text>
                </Pressable>
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center">
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <Text className="text-red-600 ml-2 flex-1">{error}</Text>
                </View>
              ) : null}
            </View>

            {/* Login Button */}
            <View className="mt-8">
              <Button
                title="Sign In"
                onPress={handleLogin}
                size="lg"
                fullWidth
                loading={loading}
              />
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="text-slate-400 px-4 text-sm">or</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* Social Login */}
            <View className="flex-row justify-center space-x-4">
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                className="flex-1 h-14 bg-slate-50 rounded-2xl flex-row items-center justify-center border border-slate-200"
              >
                <Ionicons name="logo-google" size={22} color="#4285F4" />
                <Text className="text-slate-700 font-semibold ml-2">Google</Text>
              </Pressable>
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                className="flex-1 h-14 bg-slate-900 rounded-2xl flex-row items-center justify-center"
              >
                <Ionicons name="logo-apple" size={22} color="white" />
                <Text className="text-white font-semibold ml-2">Apple</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View className="px-8 py-6">
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text className="text-center text-slate-500 text-base">
                Don't have an account?{' '}
                <Text className="text-primary-600 font-semibold">Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
