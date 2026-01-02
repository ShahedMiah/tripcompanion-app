import { Link, Stack } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <View className="flex-1 items-center justify-center px-6">
        {/* Illustration */}
        <View className="w-24 h-24 bg-primary-100 rounded-3xl items-center justify-center mb-6">
          <Ionicons name="compass-outline" size={48} color="#0D9488" />
        </View>

        {/* Text */}
        <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
          Lost your way?
        </Text>
        <Text className="text-slate-500 text-center leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved to a new destination.
        </Text>

        {/* Action */}
        <Link href="/" asChild>
          <Pressable className="bg-primary-500 px-8 py-4 rounded-2xl flex-row items-center active:bg-primary-600">
            <Ionicons name="home" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Back to Home
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
