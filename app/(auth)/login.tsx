import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/stores/appStore';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Login Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Clean, focused sign-in experience.
 */

// Bento Editorial colour palette
const COLORS = {
  cream: '#FFFBF5',
  terracotta: {
    50: '#FEF7F4',
    100: '#FCEEE8',
    500: '#C4704A',
    600: '#A85A38',
  },
  forest: {
    50: '#F0F5F2',
    500: '#4A7B5A',
    700: '#2D4739',
  },
  stone: {
    100: '#F5F3F0',
    200: '#E8E4DE',
    300: '#D5CFC6',
    500: '#968B7D',
    700: '#5C5147',
  },
  ink: {
    900: '#1A1A1A',
  },
};

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: COLORS.stone[100],
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.stone[700]} />
            </Pressable>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
            {/* Title */}
            <View style={{ marginBottom: 40 }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '700',
                color: COLORS.ink[900],
                marginBottom: 8,
                letterSpacing: -0.5,
              }}>
                Welcome back
              </Text>
              <Text style={{
                fontSize: 17,
                color: COLORS.stone[500],
                lineHeight: 24,
              }}>
                Sign in to continue planning your adventures
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: 20 }}>
              {/* Email Input */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.stone[700],
                  marginBottom: 10,
                }}>
                  Email
                </Text>
                <View style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: COLORS.stone[200],
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.stone[500]} />
                  <TextInput
                    placeholder="your@email.com"
                    placeholderTextColor={COLORS.stone[500]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.ink[900] }}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.stone[700],
                  marginBottom: 10,
                }}>
                  Password
                </Text>
                <View style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: COLORS.stone[200],
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.stone[500]} />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.stone[500]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={{ flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.ink[900] }}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={COLORS.stone[500]}
                    />
                  </Pressable>
                </View>
                <Pressable style={{ marginTop: 12, alignSelf: 'flex-end' }}>
                  <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', fontSize: 14 }}>
                    Forgot password?
                  </Text>
                </Pressable>
              </View>

              {/* Error Message */}
              {error ? (
                <View style={{
                  backgroundColor: '#FEF2F2',
                  borderWidth: 1,
                  borderColor: '#FECACA',
                  borderRadius: 14,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <Text style={{ color: '#DC2626', marginLeft: 10, flex: 1, fontSize: 14 }}>{error}</Text>
                </View>
              ) : null}
            </View>

            {/* Login Button */}
            <View style={{ marginTop: 32 }}>
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => ({
                  backgroundColor: COLORS.forest[700],
                  borderRadius: 16,
                  paddingVertical: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading ? 0.7 : pressed ? 0.9 : 1,
                  transform: pressed && !loading ? [{ scale: 0.98 }] : [{ scale: 1 }],
                })}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600' }}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 32,
            }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.stone[200] }} />
              <Text style={{ paddingHorizontal: 16, color: COLORS.stone[500], fontSize: 13 }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.stone[200] }} />
            </View>

            {/* Social Login */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 56,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: COLORS.stone[200],
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Ionicons name="logo-google" size={22} color="#4285F4" />
                <Text style={{ marginLeft: 10, color: COLORS.stone[700], fontWeight: '600', fontSize: 15 }}>
                  Google
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 56,
                  backgroundColor: COLORS.ink[900],
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
                <Text style={{ marginLeft: 10, color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
                  Apple
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={{ textAlign: 'center', color: COLORS.stone[500], fontSize: 15 }}>
                Don't have an account?{' '}
                <Text style={{ color: COLORS.terracotta[500], fontWeight: '600' }}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
