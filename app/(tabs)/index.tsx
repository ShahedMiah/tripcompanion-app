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
 * WAYFARE Trips Screen - Minimal Brutalist Design
 *
 * High contrast black/white with yellow accent. Bold typography,
 * 3px borders, hard shadow offsets. Raw, honest interface.
 */
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/trip/new');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header - Brutalist */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-end justify-between">
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#737373',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              WELCOME BACK
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '900',
                color: '#000000',
                letterSpacing: -1,
                textTransform: 'uppercase',
              }}
            >
              {user?.displayName?.split(' ')[0] || 'TRAVELLER'}
            </Text>
          </View>

          {/* Add Button - Brutalist with hard shadow */}
          <Pressable
            onPress={handleNewTrip}
            style={({ pressed }) => ({
              width: 56,
              height: 56,
              backgroundColor: '#FACC15',
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
            <Ionicons name="add" size={28} color="#000000" />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ height: 3, backgroundColor: '#000000', marginTop: 16 }} />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000000" />
        }
      >
        {trips.length === 0 ? (
          <EmptyState
            icon="compass-outline"
            title="NO TRIPS YET"
            description="Start planning your next adventure. We'll help you create the perfect itinerary."
            actionLabel="PLAN A TRIP"
            onAction={handleNewTrip}
          />
        ) : (
          <View className="px-6">
            {/* Upcoming Section */}
            {upcomingTrips.length > 0 && (
              <View className="mb-8">
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#000000',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 16,
                  }}
                >
                  UPCOMING [{upcomingTrips.length}]
                </Text>
                {upcomingTrips.map((trip) => (
                  <BrutalTripCard key={trip.id} trip={trip} />
                ))}
              </View>
            )}

            {/* Past Trips Section */}
            {pastTrips.length > 0 && (
              <View className="mb-8">
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#737373',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 16,
                  }}
                >
                  COMPLETED [{pastTrips.length}]
                </Text>
                {pastTrips.map((trip) => (
                  <BrutalTripCard key={trip.id} trip={trip} isPast />
                ))}
              </View>
            )}

            {/* Add New Trip - Brutalist dashed */}
            <Pressable
              onPress={handleNewTrip}
              style={({ pressed }) => ({
                borderWidth: 3,
                borderStyle: 'dashed',
                borderColor: '#000000',
                padding: 24,
                alignItems: 'center',
                marginBottom: 24,
                backgroundColor: pressed ? '#F5F5F5' : 'transparent',
              })}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: '#FACC15',
                  borderWidth: 2,
                  borderColor: '#000000',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons name="add" size={24} color="#000000" />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#000000',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                PLAN NEW TRIP
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#737373',
                  marginTop: 4,
                }}
              >
                AI-powered itineraries
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BrutalTripCard({ trip, isPast = false }: { trip: Trip; isPast?: boolean }) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/trip/${trip.id}`);
  };

  const totalDays = trip.startDate && trip.endDate
    ? differenceInDays(trip.endDate, trip.startDate) + 1
    : null;

  const timeUntil = trip.startDate ? getTimeUntil(trip.startDate) : null;

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    planning: { label: 'PLANNING', bg: '#FACC15', text: '#000000' },
    booked: { label: 'BOOKED', bg: '#000000', text: '#FFFFFF' },
    active: { label: 'ACTIVE', bg: '#FACC15', text: '#000000' },
    completed: { label: 'DONE', bg: '#E5E5E5', text: '#737373' },
  };

  const status = statusConfig[trip.status] || statusConfig.planning;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        backgroundColor: '#FFFFFF',
        borderWidth: 3,
        borderColor: '#000000',
        marginBottom: 16,
        opacity: isPast ? 0.7 : 1,
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
      {/* Cover Image */}
      <View style={{ height: 140, position: 'relative' }}>
        <Image
          source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Status Badge */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: status.bg,
            borderWidth: 2,
            borderColor: '#000000',
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: status.text,
              letterSpacing: 1,
            }}
          >
            {status.label}
          </Text>
        </View>

        {/* Countdown */}
        {timeUntil && !isPast && (
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: '#000000',
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#000000',
              }}
            >
              {timeUntil}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: '#000000',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          {trip.name}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>
            {getFlagEmoji(trip.destination.countryCode)}
          </Text>
          <Text style={{ fontSize: 14, color: '#737373', fontWeight: '600' }}>
            {trip.destination.city}, {trip.destination.country}
          </Text>
        </View>

        {/* Divider */}
        <View style={{ height: 2, backgroundColor: '#000000', marginBottom: 12 }} />

        {/* Trip Details */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar" size={16} color="#000000" />
            <Text style={{ fontSize: 12, color: '#000000', fontWeight: '600', marginLeft: 6 }}>
              {trip.startDate
                ? format(trip.startDate, 'MMM d')
                : 'TBD'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time" size={16} color="#000000" />
            <Text style={{ fontSize: 12, color: '#000000', fontWeight: '600', marginLeft: 6 }}>
              {totalDays ? `${totalDays} DAYS` : 'TBD'}
            </Text>
          </View>

          {/* Travelers */}
          <View style={{ flexDirection: 'row' }}>
            {trip.travelers.slice(0, 3).map((traveler, index) => (
              <View
                key={traveler.id}
                style={{
                  marginLeft: index > 0 ? -8 : 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: '#000000',
                  backgroundColor: '#FACC15',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#000000' }}>
                  {traveler.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            ))}
            {trip.travelers.length > 3 && (
              <View
                style={{
                  marginLeft: -8,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: '#000000',
                  backgroundColor: '#000000',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF' }}>
                  +{trip.travelers.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
