import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { mockItineraryDays } from '@/lib/mock-data';
import { Activity } from '@/types';
import { Button, Card, Badge, IconButton } from '@/components/ui';
import { activityColors, activityIcons } from '@/constants/theme';
import { formatCurrency, formatDuration } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

export default function ActivityDetailScreen() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const router = useRouter();

  // Find activity in mock data
  let activity: Activity | null = null;
  for (const day of mockItineraryDays) {
    const found = day.activities.find((a) => a.id === activityId);
    if (found) {
      activity = found;
      break;
    }
  }

  if (!activity) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
        <Text className="text-slate-500 mt-4">Activity not found</Text>
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
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-slate-100">
        <IconButton icon="close" onPress={() => router.back()} variant="ghost" />
        <Text className="flex-1 text-lg font-bold text-slate-900 ml-2">
          Activity Details
        </Text>
        <IconButton icon="create-outline" onPress={() => {}} variant="ghost" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-6">
          {/* Header Card */}
          <Card variant="elevated" padding="lg">
            <View className="flex-row items-start">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Ionicons name={icon as any} size={32} color={color} />
              </View>
              <View className="ml-4 flex-1">
                <View className="flex-row items-center mb-2">
                  <Badge
                    label={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    variant="primary"
                  />
                  {activity.bookingStatus === 'booked' && (
                    <View className="ml-2">
                      <Badge label="Booked" variant="success" />
                    </View>
                  )}
                </View>
                <Text className="text-2xl font-bold text-slate-900">
                  {activity.title}
                </Text>
              </View>
            </View>

            {activity.description && (
              <Text className="text-slate-600 mt-4 leading-relaxed text-base">
                {activity.description}
              </Text>
            )}
          </Card>

          {/* Time & Duration */}
          <Card variant="elevated" className="mt-4">
            <Text className="font-bold text-slate-900 mb-4 text-lg">
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
                value={formatDuration(activity.duration)}
                isLast
              />
            )}
          </Card>

          {/* Location */}
          {activity.location && (
            <Card variant="elevated" className="mt-4">
              <Text className="font-bold text-slate-900 mb-4 text-lg">Location</Text>

              <View className="bg-slate-50 rounded-2xl p-4">
                <Text className="text-slate-900 font-semibold text-base">
                  {activity.location.name}
                </Text>
                {activity.location.address && (
                  <Text className="text-slate-500 text-sm mt-1">
                    {activity.location.address}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={handleOpenMaps}
                className="flex-row items-center justify-center mt-4 py-3 active:opacity-80"
              >
                <Ionicons name="navigate" size={18} color="#0D9488" />
                <Text className="text-primary-600 font-semibold ml-2">
                  Open in Maps
                </Text>
              </Pressable>
            </Card>
          )}

          {/* Cost */}
          {activity.estimatedCost && (
            <Card variant="elevated" className="mt-4">
              <Text className="font-bold text-slate-900 mb-4 text-lg">Cost</Text>
              <View className="bg-primary-50 rounded-2xl p-4 flex-row items-center justify-between">
                <Text className="text-primary-700">Estimated cost</Text>
                <Text className="text-2xl font-bold text-primary-900">
                  {formatCurrency(activity.estimatedCost.amount)}
                </Text>
              </View>
            </Card>
          )}

          {/* Booking Info */}
          {(activity.bookingUrl || activity.bookingReference) && (
            <Card variant="elevated" className="mt-4">
              <Text className="font-bold text-slate-900 mb-4 text-lg">
                Booking Information
              </Text>

              {activity.bookingReference && (
                <View className="bg-emerald-50 rounded-2xl p-4 mb-4 flex-row items-center">
                  <Ionicons name="ticket" size={24} color="#059669" />
                  <View className="ml-4">
                    <Text className="text-emerald-700 text-sm">
                      Confirmation number
                    </Text>
                    <Text className="text-emerald-900 font-bold text-xl">
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
                  icon={<Ionicons name="open-outline" size={18} color="#0D9488" />}
                />
              )}
            </Card>
          )}

          {/* Notes */}
          {activity.notes && (
            <Card variant="elevated" className="mt-4">
              <Text className="font-bold text-slate-900 mb-4 text-lg">Notes</Text>
              <View className="bg-amber-50 rounded-2xl p-4 flex-row items-start">
                <Ionicons name="bulb" size={20} color="#D97706" />
                <Text className="text-amber-800 ml-3 flex-1 leading-relaxed">
                  {activity.notes}
                </Text>
              </View>
            </Card>
          )}

          {/* Alternatives */}
          {activity.alternatives && activity.alternatives.length > 0 && (
            <Card variant="elevated" className="mt-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-bold text-slate-900 text-lg">Alternatives</Text>
                <Badge
                  label={`${activity.alternatives.length} option${
                    activity.alternatives.length > 1 ? 's' : ''
                  }`}
                  variant="primary"
                />
              </View>
              <Text className="text-slate-500 text-sm mb-4">
                Backup options in case of weather or cancellation
              </Text>

              {activity.alternatives.map((alt) => (
                <Pressable
                  key={alt.id}
                  className="border border-slate-200 rounded-2xl p-4 mb-3 active:bg-slate-50"
                >
                  <Text className="font-semibold text-slate-900 text-base">
                    {alt.title}
                  </Text>
                  {alt.description && (
                    <Text className="text-slate-500 text-sm mt-1">
                      {alt.description}
                    </Text>
                  )}
                  {alt.estimatedCost && (
                    <Text className="text-primary-600 font-semibold mt-2">
                      {formatCurrency(alt.estimatedCost.amount)}
                    </Text>
                  )}
                </Pressable>
              ))}
            </Card>
          )}

          {/* Action Buttons */}
          <View className="mt-6 mb-4">
            <Button
              title="Mark as Completed"
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              variant="primary"
              fullWidth
              size="lg"
              icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
            />
            <Pressable className="mt-4 py-3 active:opacity-80">
              <Text className="text-center text-red-500 font-semibold">
                Remove from Itinerary
              </Text>
            </Pressable>
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
  isLast = false,
}: {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center py-3 ${
        !isLast ? 'border-b border-slate-100' : ''
      }`}
    >
      <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
        <Ionicons name={icon as any} size={20} color="#64748B" />
      </View>
      <Text className="ml-3 text-slate-500 flex-1">{label}</Text>
      <Text className="font-semibold text-slate-900">{value}</Text>
    </View>
  );
}
