import { View, Text, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays } from 'date-fns';
import { Card, Badge, Avatar, EmptyState } from '@/components/ui';
import { useAppStore } from '@/stores/appStore';
import { Trip } from '@/types';
import { getTimeUntil, getFlagEmoji } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Trips Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Organic rounded cards with soft shadows.
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
    100: '#E0EBE4',
    500: '#4A7B5A',
    700: '#2D4739',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
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

export default function TripsScreen() {
  const router = useRouter();
  const { trips, user } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const upcomingTrips = trips.filter((t) => t.status === 'booked' || t.status === 'planning');
  const pastTrips = trips.filter((t) => t.status === 'completed');

  const handleNewTrip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/trip/new');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.stone[500],
              marginBottom: 4,
            }}>
              Welcome back
            </Text>
            <Text style={{
              fontSize: 28,
              fontWeight: '700',
              color: COLORS.ink[900],
              letterSpacing: -0.5,
            }}>
              {user?.displayName?.split(' ')[0] || 'Traveller'}
            </Text>
          </View>

          {/* Add Button */}
          <Pressable
            onPress={handleNewTrip}
            style={({ pressed }) => ({
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
              transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
            })}
          >
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.terracotta[500]}
          />
        }
      >
        {trips.length === 0 ? (
          <EmptyState
            icon="compass-outline"
            title="No trips yet"
            description="Start planning your next adventure. We'll help you create the perfect itinerary."
            actionLabel="Plan a Trip"
            onAction={handleNewTrip}
          />
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Upcoming Section */}
            {upcomingTrips.length > 0 && (
              <View style={{ marginBottom: 32 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: COLORS.stone[500],
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: 16,
                  paddingHorizontal: 4,
                }}>
                  Upcoming · {upcomingTrips.length}
                </Text>
                {upcomingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </View>
            )}

            {/* Past Trips Section */}
            {pastTrips.length > 0 && (
              <View style={{ marginBottom: 32 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: COLORS.stone[500],
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: 16,
                  paddingHorizontal: 4,
                }}>
                  Completed · {pastTrips.length}
                </Text>
                {pastTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} isPast />
                ))}
              </View>
            )}

            {/* Add New Trip Card */}
            <Pressable
              onPress={handleNewTrip}
              style={({ pressed }) => ({
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: COLORS.stone[300],
                borderRadius: 24,
                padding: 24,
                alignItems: 'center',
                marginBottom: 24,
                backgroundColor: pressed ? COLORS.stone[100] : 'transparent',
              })}
            >
              <View style={{
                width: 56,
                height: 56,
                backgroundColor: COLORS.terracotta[100],
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Ionicons name="add" size={28} color={COLORS.terracotta[500]} />
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.ink[900],
                marginBottom: 4,
              }}>
                Plan New Trip
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.stone[500],
              }}>
                AI-powered itineraries
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TripCard({ trip, isPast = false }: { trip: Trip; isPast?: boolean }) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/trip/${trip.id}`);
  };

  const totalDays = trip.startDate && trip.endDate
    ? differenceInDays(trip.endDate, trip.startDate) + 1
    : null;

  const timeUntil = trip.startDate ? getTimeUntil(trip.startDate) : null;

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    planning: { label: 'Planning', bg: COLORS.amber[100], text: COLORS.amber[500] },
    booked: { label: 'Booked', bg: COLORS.forest[100], text: COLORS.forest[700] },
    active: { label: 'Active', bg: COLORS.terracotta[100], text: COLORS.terracotta[600] },
    completed: { label: 'Done', bg: COLORS.stone[200], text: COLORS.stone[700] },
  };

  const status = statusConfig[trip.status] || statusConfig.planning;

  return (
    <View style={{ marginBottom: 16 }}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: isPast ? 0.8 : 1,
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        })}
      >
        <Card variant="outlined" padding="none">
        {/* Cover Image */}
        <View style={{ height: 160, position: 'relative' }}>
          <Image
            source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800' }}
            style={{ width: '100%', height: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            resizeMode="cover"
          />

          {/* Gradient overlay */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }} />

          {/* Status Badge */}
          <View style={{
            position: 'absolute',
            top: 14,
            right: 14,
            backgroundColor: status.bg,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 10,
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: status.text,
            }}>
              {status.label}
            </Text>
          </View>

          {/* Countdown */}
          {timeUntil && !isPast && (
            <View style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
            }}>
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: COLORS.ink[900],
              }}>
                {timeUntil}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ padding: 18 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: COLORS.ink[900],
            marginBottom: 4,
            letterSpacing: -0.3,
          }}>
            {trip.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>
              {getFlagEmoji(trip.destination.countryCode)}
            </Text>
            <Text style={{ fontSize: 15, color: COLORS.stone[500], fontWeight: '500' }}>
              {trip.destination.city}, {trip.destination.country}
            </Text>
          </View>

          {/* Trip Details */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: COLORS.stone[200],
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 36,
                height: 36,
                backgroundColor: COLORS.terracotta[50],
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.terracotta[500]} />
              </View>
              <Text style={{ fontSize: 14, color: COLORS.stone[700], fontWeight: '500' }}>
                {trip.startDate
                  ? format(trip.startDate, 'MMM d')
                  : 'TBD'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 36,
                height: 36,
                backgroundColor: COLORS.forest[50],
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                <Ionicons name="time-outline" size={18} color={COLORS.forest[500]} />
              </View>
              <Text style={{ fontSize: 14, color: COLORS.stone[700], fontWeight: '500' }}>
                {totalDays ? `${totalDays} days` : 'TBD'}
              </Text>
            </View>

            {/* Travelers */}
            <View style={{ flexDirection: 'row' }}>
              {trip.travelers.slice(0, 3).map((traveler, index) => (
                <View
                  key={traveler.id}
                  style={{
                    marginLeft: index > 0 ? -10 : 0,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    backgroundColor: COLORS.terracotta[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.terracotta[600] }}>
                    {traveler.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              ))}
              {trip.travelers.length > 3 && (
                <View
                  style={{
                    marginLeft: -10,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    backgroundColor: COLORS.stone[700],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#FFFFFF' }}>
                    +{trip.travelers.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
      </Pressable>
    </View>
  );
}
