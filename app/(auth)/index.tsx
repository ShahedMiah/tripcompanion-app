import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        {/* Header - Logo */}
        <View className="px-6 pt-8">
          <View
            style={{
              width: 56,
              height: 56,
              backgroundColor: '#000000',
              borderWidth: 3,
              borderColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000000',
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 4,
            }}
          >
            <Ionicons name="compass" size={28} color="#FFFFFF" />
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6 pt-12">
          {/* Display Typography - Raw, bold */}
          <Text
            style={{
              fontSize: 56,
              fontWeight: '900',
              color: '#000000',
              letterSpacing: -2,
              textTransform: 'uppercase',
              lineHeight: 56,
            }}
          >
            WAYFARE
          </Text>

          {/* Yellow accent underline */}
          <View
            style={{
              width: 120,
              height: 8,
              backgroundColor: '#FACC15',
              marginTop: 8,
              marginBottom: 24,
            }}
          />

          {/* Tagline - Direct, honest */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#000000',
              lineHeight: 32,
              marginBottom: 24,
            }}
          >
            TRAVEL PLANNING.{'\n'}
            NO BULLSHIT.
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: '#737373',
              lineHeight: 24,
              maxWidth: 300,
            }}
          >
            AI itineraries. Split expenses. Group coordination. All in one raw, honest app.
          </Text>

          {/* Feature List - Brutalist markers */}
          <View style={{ marginTop: 32 }}>
            {[
              'AI-POWERED ITINERARIES',
              'EXPENSE TRACKING',
              'GROUP TRIPS',
              'OFFLINE ACCESS',
            ].map((feature, index) => (
              <View
                key={feature}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '900',
                    color: '#FACC15',
                    marginRight: 12,
                  }}
                >
                  +
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#000000',
                    letterSpacing: 1,
                  }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="px-6 pb-6">
          {/* Primary CTA */}
          <Button
            title="GET STARTED"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.push('/(auth)/register');
            }}
            variant="primary"
            size="lg"
            fullWidth
          />

          {/* Secondary CTA */}
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: 16, paddingVertical: 12 }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#000000',
                fontSize: 14,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}
            >
              ALREADY HAVE AN ACCOUNT?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>SIGN IN</Text>
            </Text>
          </Pressable>

          {/* Divider */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 24,
            }}
          >
            <View style={{ flex: 1, height: 3, backgroundColor: '#000000' }} />
            <Text
              style={{
                paddingHorizontal: 16,
                color: '#000000',
                fontSize: 12,
                fontWeight: '700',
                letterSpacing: 1,
              }}
            >
              OR
            </Text>
            <View style={{ flex: 1, height: 3, backgroundColor: '#000000' }} />
          </View>

          {/* Social Login - Brutalist boxes */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
            {/* Google */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.replace('/(tabs)');
              }}
              style={({ pressed }) => ({
                width: 64,
                height: 64,
                backgroundColor: '#FFFFFF',
                borderWidth: 3,
                borderColor: '#000000',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000000',
                shadowOffset: pressed
                  ? { width: 2, height: 2 }
                  : { width: 4, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
                transform: pressed
                  ? [{ translateX: 2 }, { translateY: 2 }]
                  : [{ translateX: 0 }, { translateY: 0 }],
              })}
            >
              <Ionicons name="logo-google" size={28} color="#000000" />
            </Pressable>

            {/* Apple */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.replace('/(tabs)');
              }}
              style={({ pressed }) => ({
                width: 64,
                height: 64,
                backgroundColor: '#000000',
                borderWidth: 3,
                borderColor: '#000000',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#FACC15',
                shadowOffset: pressed
                  ? { width: 2, height: 2 }
                  : { width: 4, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
                transform: pressed
                  ? [{ translateX: 2 }, { translateY: 2 }]
                  : [{ translateX: 0 }, { translateY: 0 }],
              })}
            >
              <Ionicons name="logo-apple" size={28} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
