import { View, Text, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays } from 'date-fns';
import { Card, Badge, FAB } from '@/components/ui';
import { useAppStore } from '@/stores/appStore';
import { Trip } from '@/types';
import { getTimeUntil, getFlagEmoji } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

/**
 * Trips Screen - MINIMAL BRUTALIST Design
 *
 * High contrast, hard shadows, bold typography.
 * No gradients, no blur, just raw honesty.
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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Background Pattern */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 200,
          height: 200,
          backgroundColor: '#FACC15',
          opacity: 0.3,
        }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#737373',
                  fontWeight: '700',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                Welcome back
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
            {/* Yellow accent bar */}
            <View style={{ width: 60, height: 6, backgroundColor: '#FACC15', marginBottom: 8 }} />
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 3, backgroundColor: '#000000', marginHorizontal: 20 }} />

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#000000"
            />
          }
        >
          {trips.length === 0 ? (
            <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
              <Card variant="default" padding="lg">
                <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#FACC15',
                      borderWidth: 3,
                      borderColor: '#000000',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Ionicons name="airplane" size={36} color="#000000" />
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '900',
                      color: '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      marginBottom: 8,
                    }}
                  >
                    No trips yet
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#737373',
                      textAlign: 'center',
                      lineHeight: 22,
                    }}
                  >
                    Create your first trip and let us help you plan the perfect adventure.
                  </Text>
                </View>
              </Card>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
              {/* Upcoming Section */}
              {upcomingTrips.length > 0 && (
                <View style={{ marginBottom: 32 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#000000',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                      }}
                    >
                      Upcoming
                    </Text>
                    <Badge label={`${upcomingTrips.length} TRIPS`} variant="accent" size="sm" />
                  </View>
                  {upcomingTrips.map((trip) => (
                    <BrutalTripCard key={trip.id} trip={trip} />
                  ))}
                </View>
              )}

              {/* Past Trips Section */}
              {pastTrips.length > 0 && (
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#000000',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                      }}
                    >
                      Past Adventures
                    </Text>
                  </View>
                  {pastTrips.map((trip) => (
                    <BrutalTripCard key={trip.id} trip={trip} />
                  ))}
                </View>
              )}

              {/* Add Trip Button */}
              <Pressable onPress={handleNewTrip} style={{ marginTop: 24 }}>
                <View
                  style={{
                    borderWidth: 3,
                    borderStyle: 'dashed',
                    borderColor: '#000000',
                    padding: 32,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: '#FACC15',
                      borderWidth: 3,
                      borderColor: '#000000',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ fontSize: 32, fontWeight: '900', color: '#000000' }}>+</Text>
                  </View>
                  <Text
                    style={{
                      color: '#000000',
                      fontWeight: '800',
                      fontSize: 14,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Plan a new adventure
                  </Text>
                  <Text style={{ color: '#737373', fontSize: 12, marginTop: 4 }}>
                    AI will help you create the perfect itinerary
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {/* FAB */}
        <View
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
          }}
        >
          <FAB
            icon={<Text style={{ fontSize: 28, fontWeight: '900', color: '#FFFFFF' }}>+</Text>}
            onPress={handleNewTrip}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function BrutalTripCard({ trip }: { trip: Trip }) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/trip/${trip.id}`);
  };

  const totalDays = trip.startDate && trip.endDate
    ? differenceInDays(trip.endDate, trip.startDate) + 1
    : null;

  const timeUntil = trip.startDate ? getTimeUntil(trip.startDate) : null;
  const isPast = trip.status === 'completed';

  const statusConfig = {
    planning: { label: 'PLANNING', variant: 'accent' as const },
    booked: { label: 'BOOKED', variant: 'default' as const },
    active: { label: 'ACTIVE', variant: 'accent' as const },
    completed: { label: 'DONE', variant: 'inverted' as const },
  };

  const status = statusConfig[trip.status];

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        marginBottom: 16,
      })}
    >
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 3,
            borderColor: '#000000',
            shadowColor: '#000000',
            shadowOffset: pressed ? { width: 2, height: 2 } : { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 8,
            transform: pressed
              ? [{ translateX: 2 }, { translateY: 2 }]
              : [{ translateX: 0 }, { translateY: 0 }],
          }}
        >
          {/* Cover Image */}
          <View style={{ height: 140, position: 'relative' }}>
            <Image
              source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            {/* Overlay */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            />

            {/* Status Badge */}
            <View style={{ position: 'absolute', top: 12, right: 12 }}>
              <Badge label={status.label} variant={status.variant} size="sm" />
            </View>

            {/* Countdown Badge */}
            {timeUntil && !isPast && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  backgroundColor: '#FACC15',
                  borderWidth: 2,
                  borderColor: '#000000',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: '#000000',
                    fontWeight: '800',
                    fontSize: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  {timeUntil}
                </Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '900',
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: -0.5,
                    marginBottom: 4,
                  }}
                >
                  {trip.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, marginRight: 6 }}>
                    {getFlagEmoji(trip.destination.countryCode)}
                  </Text>
                  <Text style={{ color: '#737373', fontSize: 14, fontWeight: '600' }}>
                    {trip.destination.city}, {trip.destination.country}
                  </Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={{ height: 2, backgroundColor: '#000000', marginVertical: 16 }} />

            {/* Trip Details */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Dates */}
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#F5F5F5',
                    borderWidth: 2,
                    borderColor: '#000000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
                  <Ionicons name="calendar-outline" size={14} color="#000000" />
                </View>
                <View>
                  <Text style={{ color: '#737373', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                    DATES
                  </Text>
                  <Text style={{ color: '#000000', fontSize: 12, fontWeight: '700' }}>
                    {trip.startDate
                      ? `${format(trip.startDate, 'MMM d')} - ${format(trip.endDate!, 'd')}`
                      : 'Not set'}
                  </Text>
                </View>
              </View>

              {/* Duration */}
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#FACC15',
                    borderWidth: 2,
                    borderColor: '#000000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
                  <Ionicons name="time-outline" size={14} color="#000000" />
                </View>
                <View>
                  <Text style={{ color: '#737373', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                    DAYS
                  </Text>
                  <Text style={{ color: '#000000', fontSize: 12, fontWeight: '700' }}>
                    {totalDays ? totalDays : 'TBD'}
                  </Text>
                </View>
              </View>

              {/* Travellers */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    backgroundColor: '#000000',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                    {trip.travelers.length} PAX
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}
