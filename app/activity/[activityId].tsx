import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { mockItineraryDays } from '@/lib/mock-data';
import { Activity } from '@/types';
import { Card, Badge } from '@/components/ui';
import { activityColors, activityIcons } from '@/constants/theme';
import { formatCurrency, formatDuration } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Activity Detail Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Comprehensive activity information with booking details.
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
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.stone[500]} />
        <Text style={{ color: COLORS.stone[500], marginTop: 16, fontSize: 16 }}>Activity not found</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.stone[200],
      }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: COLORS.stone[100],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons name="close" size={22} color={COLORS.stone[700]} />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: '600', color: COLORS.ink[900], marginLeft: 12 }}>
          Activity Details
        </Text>
        <Pressable
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: COLORS.stone[100],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.stone[700]} />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* Header Card */}
          <Card variant="outlined" padding="lg">
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}20`,
              }}>
                <Ionicons name={icon as any} size={32} color={color} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{
                    backgroundColor: COLORS.terracotta[100],
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.terracotta[600] }}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Text>
                  </View>
                  {activity.bookingStatus === 'booked' && (
                    <View style={{
                      marginLeft: 8,
                      backgroundColor: COLORS.forest[100],
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.forest[700] }}>
                        Booked
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.ink[900], letterSpacing: -0.3 }}>
                  {activity.title}
                </Text>
              </View>
            </View>

            {activity.description && (
              <Text style={{ color: COLORS.stone[500], marginTop: 16, lineHeight: 24, fontSize: 15 }}>
                {activity.description}
              </Text>
            )}
          </Card>

          {/* Time & Duration */}
          <Card variant="outlined" padding="lg" style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: '700', color: COLORS.ink[900], marginBottom: 16, fontSize: 17 }}>
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
            <Card variant="outlined" padding="lg" style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '700', color: COLORS.ink[900], marginBottom: 16, fontSize: 17 }}>
                Location
              </Text>

              <View style={{ backgroundColor: COLORS.stone[100], borderRadius: 16, padding: 16 }}>
                <Text style={{ color: COLORS.ink[900], fontWeight: '600', fontSize: 16 }}>
                  {activity.location.name}
                </Text>
                {activity.location.address && (
                  <Text style={{ color: COLORS.stone[500], fontSize: 14, marginTop: 4 }}>
                    {activity.location.address}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={handleOpenMaps}
                style={({ pressed }) => ({
                  marginTop: 16,
                  paddingVertical: 12,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="navigate" size={18} color={COLORS.terracotta[500]} />
                  <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', marginLeft: 8, fontSize: 15 }}>
                    Open in Maps
                  </Text>
                </View>
              </Pressable>
            </Card>
          )}

          {/* Cost */}
          {activity.estimatedCost && (
            <Card variant="outlined" padding="lg" style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '700', color: COLORS.ink[900], marginBottom: 16, fontSize: 17 }}>
                Cost
              </Text>
              <View style={{
                backgroundColor: COLORS.terracotta[50],
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Text style={{ color: COLORS.terracotta[600], fontSize: 15 }}>Estimated cost</Text>
                <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.terracotta[500] }}>
                  {formatCurrency(activity.estimatedCost.amount)}
                </Text>
              </View>
            </Card>
          )}

          {/* Booking Info */}
          {(activity.bookingUrl || activity.bookingReference) && (
            <Card variant="outlined" padding="lg" style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '700', color: COLORS.ink[900], marginBottom: 16, fontSize: 17 }}>
                Booking Information
              </Text>

              {activity.bookingReference && (
                <View style={{
                  backgroundColor: COLORS.forest[50],
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Ionicons name="ticket" size={24} color={COLORS.forest[500]} />
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ color: COLORS.forest[500], fontSize: 13 }}>
                      Confirmation number
                    </Text>
                    <Text style={{ color: COLORS.forest[700], fontWeight: '700', fontSize: 20 }}>
                      {activity.bookingReference}
                    </Text>
                  </View>
                </View>
              )}

              {activity.bookingUrl && (
                <Pressable
                  onPress={handleOpenBooking}
                  style={({ pressed }) => ({
                    borderWidth: 2,
                    borderColor: COLORS.terracotta[500],
                    borderRadius: 14,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="open-outline" size={18} color={COLORS.terracotta[500]} />
                    <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', marginLeft: 8, fontSize: 15 }}>
                      View Booking
                    </Text>
                  </View>
                </Pressable>
              )}
            </Card>
          )}

          {/* Notes */}
          {activity.notes && (
            <Card variant="outlined" padding="lg" style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: '700', color: COLORS.ink[900], marginBottom: 16, fontSize: 17 }}>
                Notes
              </Text>
              <View style={{
                backgroundColor: COLORS.amber[50],
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
                <Ionicons name="bulb" size={20} color={COLORS.amber[500]} />
                <Text style={{ color: COLORS.amber[700], marginLeft: 12, flex: 1, lineHeight: 22, fontSize: 14 }}>
                  {activity.notes}
                </Text>
              </View>
            </Card>
          )}

          {/* Alternatives */}
          {activity.alternatives && activity.alternatives.length > 0 && (
            <Card variant="outlined" padding="lg" style={{ marginTop: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontWeight: '700', color: COLORS.ink[900], fontSize: 17 }}>
                  Alternatives
                </Text>
                <View style={{
                  backgroundColor: COLORS.terracotta[100],
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.terracotta[600] }}>
                    {activity.alternatives.length} option{activity.alternatives.length > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <Text style={{ color: COLORS.stone[500], fontSize: 14, marginBottom: 16 }}>
                Backup options in case of weather or cancellation
              </Text>

              {activity.alternatives.map((alt) => (
                <Pressable
                  key={alt.id}
                  style={({ pressed }) => ({
                    borderWidth: 1,
                    borderColor: COLORS.stone[200],
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    backgroundColor: pressed ? COLORS.stone[100] : '#FFFFFF',
                  })}
                >
                  <Text style={{ fontWeight: '600', color: COLORS.ink[900], fontSize: 16 }}>
                    {alt.title}
                  </Text>
                  {alt.description && (
                    <Text style={{ color: COLORS.stone[500], fontSize: 14, marginTop: 4 }}>
                      {alt.description}
                    </Text>
                  )}
                  {alt.estimatedCost && (
                    <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', marginTop: 8 }}>
                      {formatCurrency(alt.estimatedCost.amount)}
                    </Text>
                  )}
                </Pressable>
              ))}
            </Card>
          )}

          {/* Action Buttons */}
          <View style={{ marginTop: 24, marginBottom: 16 }}>
            <Pressable
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              style={({ pressed }) => ({
                backgroundColor: COLORS.forest[700],
                borderRadius: 16,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8, fontSize: 16 }}>
                Mark as Completed
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => ({
                marginTop: 16,
                paddingVertical: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ textAlign: 'center', color: '#DC2626', fontWeight: '600', fontSize: 15 }}>
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
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: COLORS.stone[200],
    }}>
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.stone[100],
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ionicons name={icon as any} size={20} color={COLORS.stone[700]} />
      </View>
      <Text style={{ marginLeft: 12, color: COLORS.stone[500], flex: 1, fontSize: 15 }}>{label}</Text>
      <Text style={{ fontWeight: '600', color: COLORS.ink[900], fontSize: 15 }}>{value}</Text>
    </View>
  );
}
