import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getTripById, getItineraryForTrip } from '@/lib/mock-data';
import { Activity, ItineraryDay } from '@/types';
import { Card, Badge, EmptyState } from '@/components/ui';
import { activityColors, activityIcons, weatherConfig } from '@/constants/theme';
import { formatCurrency, formatDuration } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Itinerary Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Day-by-day timeline with activity cards.
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
    700: '#B8860B',
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

export default function ItineraryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trip = getTripById(id);
  const itinerary = getItineraryForTrip(id);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!trip || itinerary.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
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
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Day Selector */}
      <View style={{ backgroundColor: COLORS.cream, paddingVertical: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {itinerary.map((day, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <Pressable
                key={day.id}
                onPress={() => handleDaySelect(index)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginRight: 10,
                  backgroundColor: isSelected ? COLORS.terracotta[500] : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                    color: isSelected ? 'rgba(255,255,255,0.8)' : COLORS.stone[400],
                    textTransform: 'uppercase',
                  }}
                >
                  Day {day.dayNumber}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: isSelected ? '#FFFFFF' : COLORS.ink[900],
                    marginTop: 2,
                  }}
                >
                  {format(day.date, 'EEE d')}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Day Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Weather Card */}
        {selectedDay.weather && <WeatherCard weather={selectedDay.weather} />}

        {/* Day Notes */}
        {selectedDay.notes && (
          <View style={{
            backgroundColor: COLORS.terracotta[50],
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
            <Ionicons name="information-circle" size={20} color={COLORS.terracotta[500]} />
            <Text style={{ color: COLORS.terracotta[600], marginLeft: 12, flex: 1, lineHeight: 22, fontSize: 14 }}>
              {selectedDay.notes}
            </Text>
          </View>
        )}

        {/* Activities Timeline */}
        <View style={{ marginTop: 8, width: '100%' }}>
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
          style={({ pressed }) => ({
            marginTop: 16,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: COLORS.stone[300],
            borderRadius: 16,
            padding: 20,
            backgroundColor: pressed ? COLORS.stone[100] : 'transparent',
          })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add-circle-outline" size={22} color={COLORS.stone[500]} />
            <Text style={{ color: COLORS.stone[500], fontWeight: '600', marginLeft: 8, fontSize: 15 }}>
              Add Activity
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function WeatherCard({ weather }: { weather: ItineraryDay['weather'] }) {
  if (!weather) return null;

  const config = weatherConfig[weather.condition];

  return (
    <Card variant="outlined" padding="md" style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${config.color}15`,
          }}
        >
          <Ionicons name={config.icon as any} size={28} color={config.color} />
        </View>
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={{ color: COLORS.ink[900], fontWeight: '700', fontSize: 17, textTransform: 'capitalize' }}>
            {weather.condition}
          </Text>
          <Text style={{ color: COLORS.stone[500], fontSize: 14, marginTop: 2 }}>
            {weather.highTemp}° / {weather.lowTemp}°C
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons name="water-outline" size={14} color={COLORS.stone[500]} />
            <Text style={{ color: COLORS.stone[500], fontSize: 13, marginLeft: 4 }}>
              {weather.precipitation}%
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="water" size={14} color={COLORS.stone[500]} />
            <Text style={{ color: COLORS.stone[500], fontSize: 13, marginLeft: 4 }}>
              {weather.humidity}%
            </Text>
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
    suggested: { bg: COLORS.stone[100], text: COLORS.stone[700], label: 'Suggested' },
    planned: { bg: COLORS.amber[100], text: COLORS.amber[700], label: 'Planned' },
    booked: { bg: COLORS.forest[100], text: COLORS.forest[700], label: 'Booked' },
    completed: { bg: COLORS.terracotta[100], text: COLORS.terracotta[600], label: 'Done' },
  };

  const status = statusConfig[activity.bookingStatus];

  return (
    <View style={{ flexDirection: 'row' }}>
      {/* Timeline */}
      <View style={{ alignItems: 'center', marginRight: 12, flexShrink: 0 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${color}20`,
          }}
        >
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        {!isLast && <View style={{ width: 2, flex: 1, backgroundColor: COLORS.stone[200], marginVertical: 8 }} />}
      </View>

      {/* Content */}
      <View style={{ flex: 1, marginBottom: 16 }}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <Card variant="outlined" padding="md">
          {/* Time */}
          {activity.startTime && (
            <Text style={{ fontSize: 13, color: COLORS.stone[500], marginBottom: 6 }}>
              {format(activity.startTime, 'h:mm a')}
              {activity.endTime && ` - ${format(activity.endTime, 'h:mm a')}`}
              {activity.duration &&
                !activity.endTime &&
                ` (${formatDuration(activity.duration)})`}
            </Text>
          )}

          {/* Title & Status */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.ink[900], flex: 1, marginRight: 8, letterSpacing: -0.2 }} numberOfLines={2}>
              {activity.title}
            </Text>
            <View style={{ backgroundColor: status.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexShrink: 0 }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: status.text }}>
                {status.label}
              </Text>
            </View>
          </View>

          {/* Description */}
          {activity.description && (
            <Text
              style={{ color: COLORS.stone[500], fontSize: 14, marginTop: 6, lineHeight: 20 }}
              numberOfLines={2}
            >
              {activity.description}
            </Text>
          )}

          {/* Location */}
          {activity.location && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Ionicons name="location-outline" size={14} color={COLORS.stone[500]} />
              <Text style={{ color: COLORS.stone[500], fontSize: 13, marginLeft: 4 }} numberOfLines={1}>
                {activity.location.name}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.stone[200],
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {activity.estimatedCost && (
              <Text style={{ color: COLORS.ink[900], fontWeight: '600', fontSize: 14 }}>
                {formatCurrency(activity.estimatedCost.amount)}
              </Text>
            )}

            {activity.alternatives && activity.alternatives.length > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="swap-horizontal" size={14} color={COLORS.terracotta[500]} />
                <Text style={{ color: COLORS.terracotta[500], fontSize: 13, fontWeight: '500', marginLeft: 4 }}>
                  {activity.alternatives.length} alt{activity.alternatives.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}

            {activity.bookingReference && (
              <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                <Ionicons name="ticket-outline" size={14} color={COLORS.forest[500]} />
                <Text style={{ color: COLORS.forest[500], fontSize: 12, fontWeight: '500', marginLeft: 4 }} numberOfLines={1}>
                  {activity.bookingReference}
                </Text>
              </View>
            )}
          </View>
        </Card>
        </Pressable>
      </View>
    </View>
  );
}
