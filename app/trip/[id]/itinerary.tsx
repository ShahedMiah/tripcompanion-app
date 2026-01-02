import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getTripById, getItineraryForTrip } from '@/lib/mock-data';
import { Activity, ItineraryDay } from '@/types';
import { Card, Badge, EmptyState } from '@/components/ui';
import { activityColors, activityIcons, weatherConfig } from '@/constants/theme';
import { formatCurrency, formatDuration } from '@/lib/utils';
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
      <View className="flex-1 bg-slate-50">
        <EmptyState
          icon="calendar-outline"
          title="No itinerary yet"
          description="Your AI-generated itinerary will appear here once you complete the trip setup."
        />
      </View>
    );
  }

  const selectedDay = itinerary[selectedDayIndex];

  const handleDaySelect = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDayIndex(index);
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Day Selector */}
      <View className="bg-white border-b border-slate-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          {itinerary.map((day, index) => (
            <Pressable
              key={day.id}
              onPress={() => handleDaySelect(index)}
              className={`mr-2 px-4 py-2.5 rounded-2xl ${
                selectedDayIndex === index ? 'bg-primary-500' : 'bg-slate-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  selectedDayIndex === index ? 'text-primary-100' : 'text-slate-500'
                }`}
              >
                Day {day.dayNumber}
              </Text>
              <Text
                className={`font-bold ${
                  selectedDayIndex === index ? 'text-white' : 'text-slate-700'
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
        {selectedDay.weather && <WeatherCard weather={selectedDay.weather} />}

        {/* Day Notes */}
        {selectedDay.notes && (
          <View className="bg-primary-50 rounded-2xl p-4 mb-4 flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#0D9488" />
            <Text className="text-primary-700 ml-3 flex-1 leading-relaxed">
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
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-5 flex-row items-center justify-center active:bg-slate-50"
        >
          <Ionicons name="add-circle-outline" size={24} color="#94A3B8" />
          <Text className="text-slate-500 font-semibold ml-2">Add Activity</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function WeatherCard({ weather }: { weather: ItineraryDay['weather'] }) {
  if (!weather) return null;

  const config = weatherConfig[weather.condition];

  return (
    <Card variant="elevated" padding="md" className="mb-4">
      <View className="flex-row items-center">
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Ionicons name={config.icon as any} size={28} color={config.color} />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-slate-900 font-bold text-lg capitalize">
            {weather.condition}
          </Text>
          <Text className="text-slate-500">
            {weather.highTemp}° / {weather.lowTemp}°C
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-center mb-1">
            <Ionicons name="water-outline" size={14} color="#64748B" />
            <Text className="text-slate-500 text-sm ml-1">
              {weather.precipitation}%
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="water" size={14} color="#64748B" />
            <Text className="text-slate-500 text-sm ml-1">{weather.humidity}%</Text>
          </View>
        </View>
      </View>
    </Card>
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

  const statusConfig = {
    suggested: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Suggested' },
    planned: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Planned' },
    booked: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Booked' },
    completed: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'Done' },
  };

  const status = statusConfig[activity.bookingStatus];

  return (
    <View className="flex-row">
      {/* Timeline */}
      <View className="items-center mr-4">
        <View
          className="w-11 h-11 rounded-2xl items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        {!isLast && <View className="w-0.5 flex-1 bg-slate-200 my-2" />}
      </View>

      {/* Content */}
      <Pressable onPress={onPress} className="flex-1 mb-4 active:opacity-80">
        <Card variant="elevated" padding="md">
          {/* Time */}
          {activity.startTime && (
            <Text className="text-sm text-slate-500 mb-1.5">
              {format(activity.startTime, 'h:mm a')}
              {activity.endTime && ` - ${format(activity.endTime, 'h:mm a')}`}
              {activity.duration &&
                !activity.endTime &&
                ` (${formatDuration(activity.duration)})`}
            </Text>
          )}

          {/* Title & Status */}
          <View className="flex-row items-start justify-between">
            <Text className="text-base font-bold text-slate-900 flex-1 mr-2">
              {activity.title}
            </Text>
            <View className={`px-2.5 py-1 rounded-full ${status.bg}`}>
              <Text className={`text-xs font-semibold ${status.text}`}>
                {status.label}
              </Text>
            </View>
          </View>

          {/* Description */}
          {activity.description && (
            <Text className="text-slate-600 text-sm mt-1.5 leading-relaxed" numberOfLines={2}>
              {activity.description}
            </Text>
          )}

          {/* Location */}
          {activity.location && (
            <View className="flex-row items-center mt-3">
              <Ionicons name="location-outline" size={14} color="#94A3B8" />
              <Text className="text-slate-500 text-sm ml-1" numberOfLines={1}>
                {activity.location.name}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
            {activity.estimatedCost && (
              <Text className="text-slate-700 font-semibold">
                {formatCurrency(activity.estimatedCost.amount)}
              </Text>
            )}

            {activity.alternatives && activity.alternatives.length > 0 && (
              <View className="flex-row items-center">
                <Ionicons name="swap-horizontal" size={14} color="#0D9488" />
                <Text className="text-primary-600 text-sm font-medium ml-1">
                  {activity.alternatives.length} alt
                  {activity.alternatives.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}

            {activity.bookingReference && (
              <View className="flex-row items-center">
                <Ionicons name="ticket-outline" size={14} color="#059669" />
                <Text className="text-emerald-600 text-sm font-medium ml-1">
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
