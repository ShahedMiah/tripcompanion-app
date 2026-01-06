import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Welcome Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Inviting first impression with clear value proposition.
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

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header - Logo */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <View style={{
            width: 52,
            height: 52,
            backgroundColor: COLORS.terracotta[500],
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#1A1714',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}>
            <Ionicons name="compass" size={26} color="#FFFFFF" />
          </View>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20, justifyContent: 'space-between' }}>
          <View>
            {/* Display Typography - Hero title */}
            <Text style={{
              fontSize: 52,
              fontWeight: '700',
              color: COLORS.ink[900],
              letterSpacing: -2,
              lineHeight: 54,
            }}>
              Wayfare
            </Text>

            {/* Terracotta accent underline */}
            <View style={{
              width: 72,
              height: 4,
              backgroundColor: COLORS.terracotta[500],
              borderRadius: 2,
              marginTop: 10,
              marginBottom: 20,
            }} />

            {/* Tagline */}
            <Text style={{
              fontSize: 24,
              fontWeight: '600',
              color: COLORS.ink[900],
              lineHeight: 32,
              marginBottom: 12,
              letterSpacing: -0.5,
            }}>
              Travel planning,{'\n'}beautifully simple.
            </Text>

            <Text style={{
              fontSize: 16,
              fontWeight: '400',
              color: COLORS.stone[500],
              lineHeight: 24,
              maxWidth: 320,
            }}>
              AI-powered itineraries, shared expenses, and seamless group coordination — all in one place.
            </Text>
          </View>

          {/* Feature List - Positioned in middle */}
          <View style={{ paddingTop: 8, paddingBottom: 24 }}>
            {[
              { icon: 'sparkles', label: 'AI-powered itineraries' },
              { icon: 'wallet-outline', label: 'Expense tracking' },
              { icon: 'people-outline', label: 'Group trips' },
              { icon: 'cloud-offline-outline', label: 'Offline access' },
            ].map((feature, index, arr) => (
              <View
                key={feature.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: index === arr.length - 1 ? 0 : 12,
                }}
              >
                <View style={{
                  width: 36,
                  height: 36,
                  backgroundColor: COLORS.terracotta[50],
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Ionicons name={feature.icon as any} size={18} color={COLORS.terracotta[500]} />
                </View>
                <Text style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: COLORS.stone[700],
                }}>
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}>
          {/* Primary CTA */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(auth)/register');
            }}
            style={{
              backgroundColor: '#2D4739',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{
              color: '#FFFFFF',
              fontSize: 17,
              fontWeight: '600',
            }}>
              Get Started
            </Text>
          </Pressable>

          {/* Secondary CTA */}
          <View style={{ marginTop: 16 }}>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              style={({ pressed }) => ({
                paddingVertical: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{
                textAlign: 'center',
                color: COLORS.stone[600],
                fontSize: 15,
                fontWeight: '500',
              }}>
                Already have an account?{' '}
                <Text style={{ color: COLORS.terracotta[500], fontWeight: '600' }}>Sign in</Text>
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 12,
          }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.stone[200] }} />
            <Text style={{
              paddingHorizontal: 14,
              color: COLORS.stone[500],
              fontSize: 13,
              fontWeight: '500',
            }}>
              or continue with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.stone[200] }} />
          </View>

          {/* Social Login - Side by side square icons */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
            {/* Google */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace('/(tabs)');
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
              })}
            >
              <View style={{
                width: 56,
                height: 56,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: COLORS.stone[200],
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="logo-google" size={24} color="#4285F4" />
              </View>
            </Pressable>

            {/* Apple */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace('/(tabs)');
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
              })}
            >
              <View style={{
                width: 56,
                height: 56,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: COLORS.stone[200],
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="logo-apple" size={24} color="#000000" />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
