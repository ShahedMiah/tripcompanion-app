import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTripById } from '@/lib/mock-data';
import { getFlagEmoji } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Trip Detail Layout - Bento Editorial Design
 *
 * Warm, editorial aesthetic with terracotta accents.
 * Generous spacing, soft shadows, refined typography.
 */

// Bento Editorial colour palette
const COLORS = {
  cream: '#FFFBF5',
  terracotta: {
    500: '#C4704A',
    600: '#A85A38',
  },
  forest: {
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

export default function TripLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!trip) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.cream }}>
        <Ionicons name="compass-outline" size={48} color={COLORS.stone[300]} />
        <Text style={{ color: COLORS.stone[500], fontSize: 16, marginTop: 16, fontWeight: '500' }}>
          Trip not found
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Header with Cover Image */}
      <View style={{ paddingTop: insets.top }}>
        <Image
          source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800' }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(26, 23, 20, 0.2)', 'rgba(26, 23, 20, 0.7)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Navigation */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/trip/${id}/settings`);
            }}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="white" />
          </Pressable>
        </View>

        {/* Trip Info */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', letterSpacing: -0.5 }}>
            {trip.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>
              {getFlagEmoji(trip.destination.countryCode)}
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16, fontWeight: '500' }}>
              {trip.destination.city}, {trip.destination.country}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.terracotta[500],
          tabBarInactiveTintColor: COLORS.stone[500],
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: COLORS.stone[200],
            paddingTop: 8,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            shadowColor: '#1A1714',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
            letterSpacing: 0.2,
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
