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

export default function TripsScreen() {
  const router = useRouter();
  const { trips, user } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  // Separate trips by status
  const upcomingTrips = trips.filter((t) => t.status === 'booked' || t.status === 'planning');
  const pastTrips = trips.filter((t) => t.status === 'completed');

  const handleNewTrip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/trip/new');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-slate-500 font-medium">
              Welcome back,
            </Text>
            <Text className="text-2xl font-bold text-slate-900">
              {user?.displayName?.split(' ')[0] || 'Traveller'}
            </Text>
          </View>
          <Pressable
            onPress={handleNewTrip}
            className="w-12 h-12 bg-primary-600 rounded-2xl items-center justify-center shadow-lg"
            style={{
              shadowColor: '#0D9488',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Ionicons name="add" size={26} color="white" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0D9488"
          />
        }
      >
        {trips.length === 0 ? (
          <EmptyState
            icon="airplane-outline"
            title="No trips yet"
            description="Create your first trip and let us help you plan the perfect adventure."
            actionLabel="Plan a Trip"
            onAction={handleNewTrip}
          />
        ) : (
          <View className="px-5 pb-8">
            {/* Upcoming Section */}
            {upcomingTrips.length > 0 && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-slate-900">
                    Upcoming
                  </Text>
                  <Badge label={`${upcomingTrips.length} trips`} variant="primary" />
                </View>
                {upcomingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </View>
            )}

            {/* Past Trips Section */}
            {pastTrips.length > 0 && (
              <View>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-slate-900">
                    Past Adventures
                  </Text>
                </View>
                {pastTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </View>
            )}

            {/* Quick Actions */}
            <View className="mt-6">
              <Pressable
                onPress={handleNewTrip}
                className="border-2 border-dashed border-slate-300 rounded-3xl p-6 items-center active:bg-slate-50"
              >
                <View className="w-14 h-14 bg-primary-50 rounded-2xl items-center justify-center mb-3">
                  <Ionicons name="add" size={28} color="#0D9488" />
                </View>
                <Text className="text-slate-600 font-semibold">
                  Plan a new adventure
                </Text>
                <Text className="text-slate-400 text-sm mt-1">
                  AI will help you create the perfect itinerary
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/trip/${trip.id}`);
  };

  const totalDays = trip.startDate && trip.endDate
    ? differenceInDays(trip.endDate, trip.startDate) + 1
    : null;

  const timeUntil = trip.startDate ? getTimeUntil(trip.startDate) : null;
  const isPast = trip.status === 'completed';

  const statusConfig = {
    planning: { label: 'Planning', variant: 'warning' as const },
    booked: { label: 'Booked', variant: 'success' as const },
    active: { label: 'Active', variant: 'primary' as const },
    completed: { label: 'Completed', variant: 'default' as const },
  };

  const status = statusConfig[trip.status];

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 active:scale-[0.98] active:opacity-90"
    >
      <Card variant="elevated" padding="none">
        {/* Cover Image */}
        <View className="h-40 relative">
          <Image
            source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800' }}
            className="w-full h-full rounded-t-3xl"
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />

          {/* Status Badge */}
          <View className="absolute top-4 right-4">
            <Badge label={status.label} variant={status.variant} size="md" />
          </View>

          {/* Countdown Badge */}
          {timeUntil && !isPast && (
            <View className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <Text className="text-slate-800 font-semibold text-sm">
                {timeUntil === 'Today' ? '🎉 ' : ''}
                {timeUntil}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900 mb-1">
                {trip.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-lg mr-1">
                  {getFlagEmoji(trip.destination.countryCode)}
                </Text>
                <Text className="text-slate-500">
                  {trip.destination.city}, {trip.destination.country}
                </Text>
              </View>
            </View>
          </View>

          {/* Trip Details */}
          <View className="flex-row items-center mt-4 pt-4 border-t border-slate-100">
            {/* Dates */}
            <View className="flex-row items-center flex-1">
              <View className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center mr-2">
                <Ionicons name="calendar-outline" size={16} color="#64748B" />
              </View>
              <View>
                <Text className="text-slate-400 text-xs">Dates</Text>
                <Text className="text-slate-700 text-sm font-medium">
                  {trip.startDate
                    ? `${format(trip.startDate, 'MMM d')} - ${format(trip.endDate!, 'd')}`
                    : 'Not set'}
                </Text>
              </View>
            </View>

            {/* Duration */}
            <View className="flex-row items-center flex-1">
              <View className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center mr-2">
                <Ionicons name="time-outline" size={16} color="#64748B" />
              </View>
              <View>
                <Text className="text-slate-400 text-xs">Duration</Text>
                <Text className="text-slate-700 text-sm font-medium">
                  {totalDays ? `${totalDays} days` : 'TBD'}
                </Text>
              </View>
            </View>

            {/* Travelers */}
            <View className="flex-row items-center">
              <View className="flex-row">
                {trip.travelers.slice(0, 3).map((traveler, index) => (
                  <View
                    key={traveler.id}
                    style={{ marginLeft: index > 0 ? -8 : 0 }}
                    className="border-2 border-white rounded-full"
                  >
                    <Avatar
                      source={traveler.avatarUrl}
                      name={traveler.name}
                      size="sm"
                    />
                  </View>
                ))}
                {trip.travelers.length > 3 && (
                  <View
                    style={{ marginLeft: -8 }}
                    className="w-8 h-8 bg-slate-200 rounded-full items-center justify-center border-2 border-white"
                  >
                    <Text className="text-slate-600 text-xs font-bold">
                      +{trip.travelers.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
