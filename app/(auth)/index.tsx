import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, IconButton } from '@/components/ui';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

/**
 * Welcome Screen - MINIMAL BRUTALIST Design
 *
 * Raw, high-contrast, no-compromise aesthetic.
 * Hard shadows, thick borders, uppercase typography.
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Geometric Background Elements */}
      <View
        style={{
          position: 'absolute',
          top: 60,
          right: -40,
          width: 200,
          height: 200,
          backgroundColor: '#FACC15',
          transform: [{ rotate: '15deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 180,
          right: 80,
          width: 100,
          height: 100,
          backgroundColor: '#000000',
          transform: [{ rotate: '-10deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 200,
          left: -60,
          width: 150,
          height: 150,
          borderWidth: 4,
          borderColor: '#000000',
          transform: [{ rotate: '20deg' }],
        }}
      />

      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
        {/* Logo & Brand */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          {/* Brand Mark */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
            <View
              style={{
                width: 64,
                height: 64,
                backgroundColor: '#000000',
                borderWidth: 3,
                borderColor: '#000000',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                shadowColor: '#000000',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
              }}
            >
              <Ionicons name="compass" size={36} color="#FFFFFF" />
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '900',
                color: '#000000',
                letterSpacing: -1,
                textTransform: 'uppercase',
              }}
            >
              Wayfare
            </Text>
          </View>

          {/* Display Headline */}
          <Text
            style={{
              fontSize: 56,
              fontWeight: '900',
              color: '#000000',
              letterSpacing: -2,
              lineHeight: 56,
              textTransform: 'uppercase',
            }}
          >
            TRAVEL
          </Text>
          <Text
            style={{
              fontSize: 56,
              fontWeight: '900',
              color: '#000000',
              letterSpacing: -2,
              lineHeight: 56,
              textTransform: 'uppercase',
            }}
          >
            PLANNING
          </Text>
          {/* Yellow Accent Bar */}
          <View style={{ width: 120, height: 8, backgroundColor: '#FACC15', marginVertical: 16 }} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#000000',
              lineHeight: 24,
              letterSpacing: 0.5,
            }}
          >
            AI-powered itineraries. Group expense tracking.{'\n'}
            No compromise.
          </Text>
        </View>

        {/* Feature Markers */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {['AI ITINERARIES', 'SPLIT EXPENSES', 'GROUP TRIPS', 'OFFLINE'].map((feature) => (
              <View
                key={feature}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderWidth: 2,
                  borderColor: '#000000',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ color: '#FACC15', fontWeight: '900', marginRight: 6 }}>+</Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 11,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Card */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 3,
              borderColor: '#000000',
              padding: 24,
              shadowColor: '#000000',
              shadowOffset: { width: 6, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 0,
            }}
          >
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

            <Pressable
              onPress={() => router.push('/(auth)/login')}
              style={{ marginTop: 20, paddingVertical: 8 }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000000',
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                ALREADY HAVE AN ACCOUNT?{' '}
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontWeight: '800',
                  }}
                >
                  SIGN IN
                </Text>
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Social Login */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1, height: 3, backgroundColor: '#000000' }} />
            <Text
              style={{
                color: '#737373',
                paddingHorizontal: 16,
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Or continue with
            </Text>
            <View style={{ flex: 1, height: 3, backgroundColor: '#000000' }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
            <IconButton
              icon={<Ionicons name="logo-google" size={24} color="#000000" />}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.replace('/(tabs)');
              }}
              variant="secondary"
              size="lg"
            />
            <IconButton
              icon={<Ionicons name="logo-apple" size={24} color="#FFFFFF" />}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.replace('/(tabs)');
              }}
              variant="primary"
              size="lg"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
