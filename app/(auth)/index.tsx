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
        <View style={{ paddingHorizontal: 24, paddingTop: 32 }}>
          <View style={{
            width: 60,
            height: 60,
            backgroundColor: COLORS.terracotta[500],
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#1A1714',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}>
            <Ionicons name="compass" size={30} color="#FFFFFF" />
          </View>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
          {/* Display Typography - Elegant, warm */}
          <Text style={{
            fontSize: 48,
            fontWeight: '700',
            color: COLORS.ink[900],
            letterSpacing: -1.5,
            lineHeight: 52,
          }}>
            Wayfare
          </Text>

          {/* Terracotta accent underline */}
          <View style={{
            width: 80,
            height: 4,
            backgroundColor: COLORS.terracotta[500],
            borderRadius: 2,
            marginTop: 12,
            marginBottom: 24,
          }} />

          {/* Tagline - Warm, inviting */}
          <Text style={{
            fontSize: 26,
            fontWeight: '600',
            color: COLORS.ink[900],
            lineHeight: 34,
            marginBottom: 16,
            letterSpacing: -0.3,
          }}>
            Travel planning,{'\n'}beautifully simple.
          </Text>

          <Text style={{
            fontSize: 17,
            fontWeight: '400',
            color: COLORS.stone[500],
            lineHeight: 26,
            maxWidth: 320,
          }}>
            AI-powered itineraries, shared expenses, and seamless group coordination — all in one place.
          </Text>

          {/* Feature List - Editorial style */}
          <View style={{ marginTop: 40 }}>
            {[
              { icon: 'sparkles', label: 'AI-powered itineraries' },
              { icon: 'wallet-outline', label: 'Expense tracking' },
              { icon: 'people-outline', label: 'Group trips' },
              { icon: 'cloud-offline-outline', label: 'Offline access' },
            ].map((feature, index) => (
              <View
                key={feature.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.terracotta[50],
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Ionicons name={feature.icon as any} size={20} color={COLORS.terracotta[500]} />
                </View>
                <Text style={{
                  fontSize: 16,
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
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          {/* Primary CTA */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(auth)/register');
            }}
            style={({ pressed }) => ({
              backgroundColor: COLORS.forest[700],
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#1A1714',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 6,
              opacity: pressed ? 0.9 : 1,
              transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
            })}
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
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            style={({ pressed }) => ({
              marginTop: 16,
              paddingVertical: 14,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{
              textAlign: 'center',
              color: COLORS.stone[700],
              fontSize: 15,
              fontWeight: '500',
            }}>
              Already have an account?{' '}
              <Text style={{ color: COLORS.terracotta[500], fontWeight: '600' }}>Sign in</Text>
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 24,
          }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.stone[200] }} />
            <Text style={{
              paddingHorizontal: 16,
              color: COLORS.stone[500],
              fontSize: 13,
              fontWeight: '500',
            }}>
              or continue with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.stone[200] }} />
          </View>

          {/* Social Login - Soft, rounded */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
            {/* Google */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace('/(tabs)');
              }}
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
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              })}
            >
              <Ionicons name="logo-google" size={22} color="#4285F4" />
              <Text style={{ marginLeft: 10, color: COLORS.stone[700], fontWeight: '600', fontSize: 15 }}>
                Google
              </Text>
            </Pressable>

            {/* Apple */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace('/(tabs)');
              }}
              style={({ pressed }) => ({
                flex: 1,
                height: 56,
                backgroundColor: COLORS.ink[900],
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.9 : 1,
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              })}
            >
              <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
              <Text style={{ marginLeft: 10, color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
                Apple
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
