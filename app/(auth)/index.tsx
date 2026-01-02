import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-900">
      {/* Background Image with Gradient Overlay */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200' }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.95)']}
        locations={[0, 0.4, 0.75]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1 justify-end">
        {/* Logo & Brand */}
        <View className="px-8 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-primary-500 rounded-2xl items-center justify-center mr-3">
              <Ionicons name="compass" size={28} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white tracking-tight">
              Wayfare
            </Text>
          </View>

          {/* Tagline */}
          <Text className="text-4xl font-bold text-white leading-tight mb-3">
            Travel planning,{'\n'}
            <Text className="text-primary-400">reimagined.</Text>
          </Text>
          <Text className="text-lg text-slate-300 leading-relaxed">
            AI-powered itineraries, group expense tracking, and seamless sharing — all in one place.
          </Text>
        </View>

        {/* Feature Pills */}
        <View className="flex-row flex-wrap px-8 mb-8">
          {['AI Itineraries', 'Split Expenses', 'Group Trips', 'Offline Access'].map((feature) => (
            <View
              key={feature}
              className="bg-white/10 rounded-full px-4 py-2 mr-2 mb-2 border border-white/20"
            >
              <Text className="text-white text-sm font-medium">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="px-8 pb-4">
          <Button
            title="Get Started"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(auth)/register');
            }}
            size="lg"
            fullWidth
          />

          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="mt-4 py-3"
          >
            <Text className="text-center text-slate-300 text-base">
              Already have an account?{' '}
              <Text className="text-primary-400 font-semibold">Sign in</Text>
            </Text>
          </Pressable>
        </View>

        {/* Social Login */}
        <View className="px-8 pb-8">
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-slate-700" />
            <Text className="text-slate-500 px-4 text-sm">or continue with</Text>
            <View className="flex-1 h-px bg-slate-700" />
          </View>

          <View className="flex-row justify-center space-x-4">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Mock login for demo
                router.replace('/(tabs)');
              }}
              className="w-14 h-14 bg-white rounded-2xl items-center justify-center"
            >
              <Ionicons name="logo-google" size={24} color="#4285F4" />
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace('/(tabs)');
              }}
              className="w-14 h-14 bg-white rounded-2xl items-center justify-center"
            >
              <Ionicons name="logo-apple" size={24} color="#000" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
