import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTripById } from '@/lib/mock-data';
import { getFlagEmoji } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

export default function TripLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Trip not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header with Cover Image */}
      <View style={{ paddingTop: insets.top }}>
        <Image
          source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800' }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          className="absolute inset-0"
        />

        {/* Navigation */}
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </Pressable>
          <Pressable
            onPress={() => router.push(`/trip/${id}/settings`)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center"
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="white" />
          </Pressable>
        </View>

        {/* Trip Info */}
        <View className="px-5 pb-5">
          <Text className="text-white text-2xl font-bold">{trip.name}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-lg mr-1.5">
              {getFlagEmoji(trip.destination.countryCode)}
            </Text>
            <Text className="text-white/90 text-base">
              {trip.destination.city}, {trip.destination.country}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0D9488',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
            paddingTop: 8,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Overview',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="itinerary"
          options={{
            title: 'Itinerary',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Expenses',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Assistant',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
