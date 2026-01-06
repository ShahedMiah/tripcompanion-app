import { Stack, useLocalSearchParams, useRouter, useSegments, usePathname, useFocusEffect } from 'expo-router';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getTripById } from '@/lib/mock-data';
import { getFlagEmoji } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  ScrollProvider,
  useScrollContext,
  HEADER_MAX_HEIGHT,
  HEADER_MIN_HEIGHT,
  HEADER_SCROLL_DISTANCE,
} from '@/contexts/ScrollContext';
import { useFAB } from '@/contexts/FABContext';
import { useCallback, useEffect, useRef } from 'react';

/**
 * WAYFARE Trip Detail Layout - Bento Editorial Design
 *
 * Stack-based navigation with collapsing header on main Overview.
 * Sub-pages (Expenses, Itinerary, Chat) use simple headers.
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
  amber: {
    500: '#D4A574',
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

function TripLayoutContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scrollY } = useScrollContext();
  const segments = useSegments();
  const { showFAB, hideFAB } = useFAB();

  const pathname = usePathname();

  // Only show the collapsing header on the Overview (index) screen
  // pathname will be like /trip/1 for overview, /trip/1/expenses for sub-screens
  // Check if we're NOT on a sub-screen (expenses, itinerary, chat, settings)
  const subScreens = ['expenses', 'itinerary', 'chat', 'settings'];
  const isOverviewScreen = !subScreens.some(screen => pathname.includes(`/${screen}`));

  // Store navigation function in ref to avoid stale closures
  const navigateToChatRef = useRef(() => {
    router.push(`/trip/${id}/chat`);
  });
  navigateToChatRef.current = () => {
    router.push(`/trip/${id}/chat`);
  };

  // Control FAB visibility via portal context
  // Use useEffect to react to pathname changes (not useFocusEffect which only fires on layout focus)
  useEffect(() => {
    if (isOverviewScreen) {
      showFAB(() => navigateToChatRef.current());
    } else {
      hideFAB();
    }
  }, [isOverviewScreen, showFAB, hideFAB]);

  // Hide FAB when leaving the trip entirely
  useFocusEffect(
    useCallback(() => {
      return () => {
        hideFAB();
      };
    }, [hideFAB])
  );

  // Animated header height
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT + insets.top, HEADER_MIN_HEIGHT + insets.top],
      Extrapolation.CLAMP
    );
    return { height };
  });

  // Image fades and scales as header collapses
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [1, 1.1],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ scale }] };
  });

  // Expanded title (bottom of header) fades out
  const titleExpandedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE * 0.4],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -30],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  // Collapsed title (inline with nav) fades in
  const titleCollapsedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE * 0.8],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Blur background fades in when collapsed
  const blurAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE * 0.4, HEADER_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

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
    <View style={{ flex: 1, backgroundColor: COLORS.cream, position: 'relative' }}>
      <StatusBar style={isOverviewScreen ? 'light' : 'dark'} />

      {/* Animated Header - only shows on index/overview screen */}
      {isOverviewScreen && (
        <Animated.View style={[{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          overflow: 'hidden',
        }, headerAnimatedStyle]}>
        {/* Background Image */}
        <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, imageAnimatedStyle]}>
          <Image
            source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800' }}
            style={{ width: '100%', height: HEADER_MAX_HEIGHT + insets.top + 50 }}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Gradient overlay */}
        <LinearGradient
          colors={['rgba(26, 23, 20, 0.2)', 'rgba(26, 23, 20, 0.7)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Blur overlay for collapsed state */}
        <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, blurAnimatedStyle]}>
          <BlurView intensity={80} tint="dark" style={{ flex: 1 }} />
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26, 23, 20, 0.7)' }} />
        </Animated.View>

        {/* Navigation bar */}
        <View style={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          height: HEADER_MIN_HEIGHT + insets.top,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          {/* Back button */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>

          {/* Collapsed title */}
          <Animated.View style={[{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 8,
          }, titleCollapsedStyle]}>
            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600' }} numberOfLines={1}>
              {trip.name}
            </Text>
          </Animated.View>

          {/* Right side actions */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="share-outline" size={20} color="white" />
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/trip/${id}/settings`);
              }}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Expanded Trip Info */}
        <Animated.View style={[{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }, titleExpandedStyle]}>
          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '700', letterSpacing: -0.5 }}>
            {trip.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>
              {getFlagEmoji(trip.destination.countryCode)}
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 15, fontWeight: '500' }}>
              {trip.destination.city}, {trip.destination.country}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
      )}

      {/* Stack Navigator - Overview has collapsing header, sub-screens have simple headers */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.cream },
        }}
      >
        {/* Overview - uses the collapsing header from this layout */}
        <Stack.Screen name="index" />

        {/* Sub-screens - custom headers matching Bento Editorial design */}
        <Stack.Screen
          name="itinerary"
          options={{
            headerShown: true,
            headerTitle: 'Itinerary',
            headerBackTitle: '',
            headerStyle: { backgroundColor: COLORS.cream },
            headerTintColor: COLORS.ink[900],
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="expenses"
          options={{
            headerShown: true,
            headerTitle: 'Expenses',
            headerBackTitle: '',
            headerStyle: { backgroundColor: COLORS.cream },
            headerTintColor: COLORS.ink[900],
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: true,
            headerTitle: 'Trip Assistant',
            headerBackTitle: '',
            headerStyle: { backgroundColor: COLORS.cream },
            headerTintColor: COLORS.ink[900],
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Trip Settings',
            headerStyle: { backgroundColor: COLORS.cream },
            headerTintColor: COLORS.ink[900],
          }}
        />
      </Stack>
    </View>
  );
}

export default function TripLayout() {
  return (
    <ScrollProvider>
      <TripLayoutContent />
    </ScrollProvider>
  );
}
