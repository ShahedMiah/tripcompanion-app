# Step 6: Itinerary Screens

## Day-by-Day Itinerary View

### Create `app/trip/[id]/itinerary.tsx`

```tsx
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format, isSameDay } from 'date-fns';
import { getTripById, getItineraryForTrip } from '@/lib/mock-data';
import { ItineraryDay, Activity } from '@/types';
import { Card, Badge, IconButton } from '@/components/ui';
import { activityColors, activityIcons } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

export default function ItineraryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trip = getTripById(id);
  const itinerary = getItineraryForTrip(id);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  if (!trip || itinerary.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
          No itinerary yet
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Your AI-generated itinerary will appear here
        </Text>
      </View>
    );
  }

  const selectedDay = itinerary[selectedDayIndex];

  const handleDaySelect = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDayIndex(index);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Day Selector */}
      <View className="bg-white border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          {itinerary.map((day, index) => (
            <Pressable
              key={day.id}
              onPress={() => handleDaySelect(index)}
              className={`
                mr-2 px-4 py-2 rounded-xl
                ${selectedDayIndex === index
                  ? 'bg-primary-500'
                  : 'bg-gray-100'
                }
              `}
            >
              <Text
                className={`text-xs ${
                  selectedDayIndex === index ? 'text-primary-100' : 'text-gray-500'
                }`}
              >
                Day {day.dayNumber}
              </Text>
              <Text
                className={`font-semibold ${
                  selectedDayIndex === index ? 'text-white' : 'text-gray-700'
                }`}
              >
                {format(day.date, 'EEE d')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Day Content */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Weather Card */}
        {selectedDay.weather && (
          <WeatherCard weather={selectedDay.weather} />
        )}

        {/* Day Notes */}
        {selectedDay.notes && (
          <View className="bg-primary-50 rounded-xl p-4 mb-4 flex-row">
            <Ionicons name="information-circle" size={20} color="#6366F1" />
            <Text className="text-primary-700 ml-2 flex-1">
              {selectedDay.notes}
            </Text>
          </View>
        )}

        {/* Activities Timeline */}
        <View className="mt-2">
          {selectedDay.activities
            .sort((a, b) => a.order - b.order)
            .map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isLast={index === selectedDay.activities.length - 1}
                onPress={() => router.push(`/activity/${activity.id}`)}
              />
            ))}
        </View>

        {/* Add Activity Button */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Open add activity modal
          }}
          className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-4 flex-row items-center justify-center"
        >
          <Ionicons name="add-circle-outline" size={24} color="#9CA3AF" />
          <Text className="text-gray-500 font-medium ml-2">Add Activity</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function WeatherCard({ weather }: { weather: ItineraryDay['weather'] }) {
  if (!weather) return null;

  const weatherIcons: Record<string, string> = {
    sunny: 'sunny',
    cloudy: 'cloudy',
    rainy: 'rainy',
    stormy: 'thunderstorm',
    snowy: 'snow',
  };

  const weatherColors: Record<string, string> = {
    sunny: '#F59E0B',
    cloudy: '#6B7280',
    rainy: '#3B82F6',
    stormy: '#6366F1',
    snowy: '#60A5FA',
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-4 flex-row items-center shadow-sm">
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: `${weatherColors[weather.condition]}20` }}
      >
        <Ionicons
          name={weatherIcons[weather.condition] as any}
          size={24}
          color={weatherColors[weather.condition]}
        />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-gray-900 font-semibold capitalize">
          {weather.condition}
        </Text>
        <Text className="text-gray-500 text-sm">
          {weather.highTemp}° / {weather.lowTemp}°C
        </Text>
      </View>
      <View className="items-end">
        <View className="flex-row items-center">
          <Ionicons name="water-outline" size={14} color="#6B7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {weather.precipitation}%
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="water" size={14} color="#6B7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {weather.humidity}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function ActivityCard({
  activity,
  isLast,
  onPress,
}: {
  activity: Activity;
  isLast: boolean;
  onPress: () => void;
}) {
  const color = activityColors[activity.type] || activityColors.other;
  const icon = activityIcons[activity.type] || activityIcons.other;

  const statusStyles = {
    suggested: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Suggested' },
    planned: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Planned' },
    booked: { bg: 'bg-green-100', text: 'text-green-700', label: 'Booked' },
    completed: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'Done' },
  };

  const status = statusStyles[activity.bookingStatus];

  return (
    <View className="flex-row">
      {/* Timeline */}
      <View className="items-center mr-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        {!isLast && (
          <View className="w-0.5 flex-1 bg-gray-200 my-2" />
        )}
      </View>

      {/* Content */}
      <Pressable
        onPress={onPress}
        className="flex-1 mb-4 active:opacity-80"
      >
        <Card padding="md">
          {/* Time */}
          {activity.startTime && (
            <Text className="text-sm text-gray-500 mb-1">
              {format(activity.startTime, 'h:mm a')}
              {activity.endTime && ` - ${format(activity.endTime, 'h:mm a')}`}
              {activity.duration && !activity.endTime && ` (${Math.floor(activity.duration / 60)}h ${activity.duration % 60}m)`}
            </Text>
          )}

          {/* Title & Status */}
          <View className="flex-row items-start justify-between">
            <Text className="text-base font-semibold text-gray-900 flex-1 mr-2">
              {activity.title}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${status.bg}`}>
              <Text className={`text-xs font-medium ${status.text}`}>
                {status.label}
              </Text>
            </View>
          </View>

          {/* Description */}
          {activity.description && (
            <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
              {activity.description}
            </Text>
          )}

          {/* Location */}
          {activity.location && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="location-outline" size={14} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                {activity.location.name}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {/* Cost */}
            {activity.estimatedCost && (
              <Text className="text-gray-700 font-medium">
                £{activity.estimatedCost.amount}
              </Text>
            )}
            
            {/* Alternatives indicator */}
            {activity.alternatives && activity.alternatives.length > 0 && (
              <View className="flex-row items-center">
                <Ionicons name="swap-horizontal" size={14} color="#6366F1" />
                <Text className="text-primary-500 text-sm ml-1">
                  {activity.alternatives.length} alternative{activity.alternatives.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}

            {/* Booking reference */}
            {activity.bookingReference && (
              <View className="flex-row items-center">
                <Ionicons name="ticket-outline" size={14} color="#10B981" />
                <Text className="text-green-600 text-sm ml-1">
                  {activity.bookingReference}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </Pressable>
    </View>
  );
}
```

## Activity Detail Screen

### Create `app/activity/[activityId].tsx`

```tsx
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { mockItineraryDays } from '@/lib/mock-data';
import { Activity } from '@/types';
import { Button, Card, Badge, IconButton } from '@/components/ui';
import { activityColors, activityIcons } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

export default function ActivityDetailScreen() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const router = useRouter();

  // Find activity in mock data
  let activity: Activity | null = null;
  for (const day of mockItineraryDays) {
    const found = day.activities.find(a => a.id === activityId);
    if (found) {
      activity = found;
      break;
    }
  }

  if (!activity) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Activity not found</Text>
      </SafeAreaView>
    );
  }

  const color = activityColors[activity.type] || activityColors.other;
  const icon = activityIcons[activity.type] || activityIcons.other;

  const handleOpenBooking = () => {
    if (activity?.bookingUrl) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Linking.openURL(activity.bookingUrl);
    }
  };

  const handleOpenMaps = () => {
    if (activity?.location) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const query = encodeURIComponent(
        activity.location.address || activity.location.name
      );
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100">
        <IconButton icon="arrow-back" onPress={() => router.back()} variant="ghost" />
        <Text className="flex-1 text-lg font-semibold text-gray-900 ml-2">
          Activity Details
        </Text>
        <IconButton icon="create-outline" onPress={() => {}} variant="ghost" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-6">
          {/* Header Card */}
          <Card padding="lg">
            <View className="flex-row items-start">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Ionicons name={icon as any} size={28} color={color} />
              </View>
              <View className="ml-4 flex-1">
                <View className="flex-row items-center">
                  <Badge
                    label={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    variant="primary"
                  />
                  {activity.bookingStatus === 'booked' && (
                    <Badge label="Booked" variant="success" />
                  )}
                </View>
                <Text className="text-xl font-bold text-gray-900 mt-2">
                  {activity.title}
                </Text>
              </View>
            </View>

            {activity.description && (
              <Text className="text-gray-600 mt-4 leading-relaxed">
                {activity.description}
              </Text>
            )}
          </Card>

          {/* Time & Duration */}
          <Card className="mt-4">
            <Text className="font-semibold text-gray-900 mb-3">
              Time & Duration
            </Text>
            
            {activity.startTime && (
              <DetailRow
                icon="time-outline"
                label="Start time"
                value={format(activity.startTime, 'h:mm a')}
              />
            )}
            {activity.endTime && (
              <DetailRow
                icon="time"
                label="End time"
                value={format(activity.endTime, 'h:mm a')}
              />
            )}
            {activity.duration && (
              <DetailRow
                icon="hourglass-outline"
                label="Duration"
                value={`${Math.floor(activity.duration / 60)}h ${activity.duration % 60}m`}
              />
            )}
          </Card>

          {/* Location */}
          {activity.location && (
            <Card className="mt-4">
              <Text className="font-semibold text-gray-900 mb-3">Location</Text>
              
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-900 font-medium">
                  {activity.location.name}
                </Text>
                {activity.location.address && (
                  <Text className="text-gray-500 text-sm mt-1">
                    {activity.location.address}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={handleOpenMaps}
                className="flex-row items-center justify-center mt-3 py-2"
              >
                <Ionicons name="navigate" size={18} color="#6366F1" />
                <Text className="text-primary-500 font-medium ml-2">
                  Open in Maps
                </Text>
              </Pressable>
            </Card>
          )}

          {/* Cost */}
          {activity.estimatedCost && (
            <Card className="mt-4">
              <Text className="font-semibold text-gray-900 mb-3">Cost</Text>
              <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
                <Text className="text-gray-600">Estimated cost</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  £{activity.estimatedCost.amount}
                </Text>
              </View>
            </Card>
          )}

          {/* Booking Info */}
          {(activity.bookingUrl || activity.bookingReference) && (
            <Card className="mt-4">
              <Text className="font-semibold text-gray-900 mb-3">
                Booking Information
              </Text>
              
              {activity.bookingReference && (
                <View className="bg-green-50 rounded-xl p-4 mb-3 flex-row items-center">
                  <Ionicons name="ticket" size={20} color="#10B981" />
                  <View className="ml-3">
                    <Text className="text-green-800 text-sm">
                      Confirmation number
                    </Text>
                    <Text className="text-green-900 font-bold text-lg">
                      {activity.bookingReference}
                    </Text>
                  </View>
                </View>
              )}

              {activity.bookingUrl && (
                <Button
                  title="View Booking"
                  onPress={handleOpenBooking}
                  variant="outline"
                  fullWidth
                  icon={<Ionicons name="open-outline" size={18} color="#6366F1" />}
                />
              )}
            </Card>
          )}

          {/* Notes */}
          {activity.notes && (
            <Card className="mt-4">
              <Text className="font-semibold text-gray-900 mb-3">Notes</Text>
              <View className="bg-amber-50 rounded-xl p-4 flex-row">
                <Ionicons name="bulb" size={20} color="#F59E0B" />
                <Text className="text-amber-800 ml-3 flex-1">
                  {activity.notes}
                </Text>
              </View>
            </Card>
          )}

          {/* Alternatives */}
          {activity.alternatives && activity.alternatives.length > 0 && (
            <Card className="mt-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-semibold text-gray-900">
                  Alternatives
                </Text>
                <Badge
                  label={`${activity.alternatives.length} option${activity.alternatives.length > 1 ? 's' : ''}`}
                  variant="primary"
                />
              </View>
              <Text className="text-gray-500 text-sm mb-4">
                Backup options in case of weather or cancellation
              </Text>

              {activity.alternatives.map((alt) => (
                <View
                  key={alt.id}
                  className="border border-gray-200 rounded-xl p-4 mb-2"
                >
                  <Text className="font-medium text-gray-900">{alt.title}</Text>
                  {alt.description && (
                    <Text className="text-gray-500 text-sm mt-1">
                      {alt.description}
                    </Text>
                  )}
                  {alt.estimatedCost && (
                    <Text className="text-primary-600 font-medium mt-2">
                      £{alt.estimatedCost.amount}
                    </Text>
                  )}
                </View>
              ))}
            </Card>
          )}

          {/* Action Buttons */}
          <View className="mt-6 space-y-3">
            <Button
              title="Mark as Completed"
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              variant="primary"
              fullWidth
              icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
            />
            <Button
              title="Remove from Itinerary"
              onPress={() => {}}
              variant="ghost"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center py-2">
      <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
        <Ionicons name={icon as any} size={16} color="#6B7280" />
      </View>
      <Text className="ml-3 text-gray-500 flex-1">{label}</Text>
      <Text className="font-medium text-gray-900">{value}</Text>
    </View>
  );
}
```
