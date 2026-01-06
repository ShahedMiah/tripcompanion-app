import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays } from 'date-fns';
import { getTripById, getItineraryForTrip, getExpensesForTrip, calculateBalances } from '@/lib/mock-data';
import { Card, Badge, Avatar } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useScrollContext, HEADER_MAX_HEIGHT } from '@/contexts/ScrollContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * WAYFARE Trip Overview - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Bento grid layout with asymmetric cards.
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
    500: '#4A7B5A',
    700: '#2D4739',
  },
  amber: {
    50: '#FFFBEB',
    500: '#D4A574',
  },
  stone: {
    100: '#F5F3F0',
    200: '#E8E4DE',
    300: '#D5CFC6',
    400: '#B5AA9C',
    500: '#968B7D',
    700: '#5C5147',
  },
  ink: {
    900: '#1A1A1A',
  },
};

export default function TripOverviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const trip = getTripById(id);
  const itinerary = getItineraryForTrip(id);
  const expenses = getExpensesForTrip(id);
  const { scrollY } = useScrollContext();

  // Calculate content padding to account for the collapsing header
  const contentTopPadding = HEADER_MAX_HEIGHT + insets.top;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!trip) return null;

  const totalDays =
    trip.startDate && trip.endDate
      ? differenceInDays(trip.endDate, trip.startDate) + 1
      : 0;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount.amount, 0);
  const totalActivities = itinerary.reduce(
    (sum, d) => sum + d.activities.length,
    0
  );
  const balances = calculateBalances(expenses);

  const quickStats = [
    { icon: 'calendar', value: `${totalDays}`, label: 'Days', color: COLORS.terracotta[500], route: null },
    { icon: 'compass', value: `${totalActivities}`, label: 'Activities', color: COLORS.forest[500], route: `/trip/${id}/itinerary` },
    { icon: 'wallet', value: formatCurrency(totalExpenses), label: 'Total', color: COLORS.stone[700], route: `/trip/${id}/expenses` },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: contentTopPadding, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
      <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
        {/* Quick Stats - Bento Grid (tappable for navigation) */}
        <View style={{ flexDirection: 'row', marginHorizontal: -6, marginBottom: 20 }}>
          {quickStats.map((stat) => (
            <View key={stat.label} style={{ flex: 1, paddingHorizontal: 6 }}>
              <Pressable
                onPress={() => {
                  if (stat.route) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(stat.route as any);
                  }
                }}
                disabled={!stat.route}
                style={({ pressed }) => ({ opacity: pressed && stat.route ? 0.8 : 1 })}
              >
                <Card variant="outlined" padding="md">
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                        backgroundColor: `${stat.color}15`,
                      }}
                    >
                      <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.ink[900], letterSpacing: -0.5 }}>
                      {stat.value}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Text style={{ fontSize: 13, color: COLORS.stone[500] }}>
                        {stat.label}
                      </Text>
                      {stat.route && (
                        <Ionicons name="chevron-forward" size={12} color={COLORS.stone[400]} style={{ marginLeft: 2 }} />
                      )}
                    </View>
                  </View>
                </Card>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Trip Details */}
        <Card variant="outlined" style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '700', color: COLORS.ink[900], marginBottom: 16, fontSize: 18, letterSpacing: -0.3 }}>
            Trip Details
          </Text>

          <DetailRow
            icon="calendar"
            label="Dates"
            value={
              trip.startDate
                ? `${format(trip.startDate, 'MMM d')} - ${format(trip.endDate!, 'MMM d, yyyy')}`
                : 'Not set'
            }
          />
          <DetailRow
            icon="airplane"
            label="Flights"
            value={trip.hasFlights ? 'Booked' : 'Not booked'}
            valueColor={trip.hasFlights ? COLORS.forest[500] : COLORS.stone[500]}
            showCheck={trip.hasFlights}
          />
          <DetailRow
            icon="bed"
            label="Accommodation"
            value={trip.hasHotels ? 'Booked' : 'Not booked'}
            valueColor={trip.hasHotels ? COLORS.forest[500] : COLORS.stone[500]}
            showCheck={trip.hasHotels}
          />
          <DetailRow
            icon="cash"
            label="Budget"
            value={
              trip.budget
                ? `${formatCurrency(trip.budget.amount)} ${trip.budget.type}`
                : 'Not set'
            }
            isLast
          />
        </Card>

        {/* Travellers */}
        <Card variant="outlined" style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontWeight: '700', color: COLORS.ink[900], fontSize: 18, letterSpacing: -0.3 }}>
              Travellers ({trip.travelers.length})
            </Text>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', marginRight: 4, fontSize: 14 }}>
                Invite
              </Text>
              <Ionicons name="add-circle" size={18} color={COLORS.terracotta[500]} />
            </Pressable>
          </View>

          {trip.travelers.map((traveler, index) => (
            <View
              key={traveler.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: index < trip.travelers.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.stone[200],
              }}
            >
              <Avatar
                source={traveler.avatarUrl}
                name={traveler.name}
                size="md"
              />
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ color: COLORS.ink[900], fontWeight: '600', fontSize: 15 }}>
                  {traveler.name}
                </Text>
                {traveler.departureCity && (
                  <Text style={{ color: COLORS.stone[500], fontSize: 13, marginTop: 2 }}>
                    Flying from {traveler.departureCity}
                  </Text>
                )}
              </View>
              <Badge
                label={traveler.role}
                variant={traveler.role === 'organizer' ? 'primary' : 'default'}
              />
            </View>
          ))}
        </Card>

        {/* Expense Summary */}
        <Card variant="outlined" style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontWeight: '700', color: COLORS.ink[900], fontSize: 18, letterSpacing: -0.3 }}>
              Expense Summary
            </Text>
            <Pressable onPress={() => router.push(`/trip/${id}/expenses`)}>
              <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', fontSize: 14 }}>View all</Text>
            </Pressable>
          </View>

          <View style={{ backgroundColor: COLORS.terracotta[50], borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <Text style={{ color: COLORS.terracotta[600], fontSize: 13, fontWeight: '500' }}>Total group expenses</Text>
            <Text style={{ fontSize: 32, fontWeight: '700', color: COLORS.terracotta[600], marginTop: 4, letterSpacing: -1 }}>
              {formatCurrency(totalExpenses)}
            </Text>
          </View>

          {Object.entries(balances)
            .slice(0, 3)
            .map(([name, balance]) => (
              <View
                key={name}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}
              >
                <Text style={{ color: COLORS.stone[700], fontSize: 15 }}>{name}</Text>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 15,
                    color: balance > 0
                      ? COLORS.forest[500]
                      : balance < 0
                      ? '#DC2626'
                      : COLORS.stone[500],
                  }}
                >
                  {balance > 0 ? 'gets back ' : balance < 0 ? 'owes ' : ''}
                  {formatCurrency(Math.abs(balance))}
                </Text>
              </View>
            ))}
        </Card>


              </View>
      </Animated.ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueColor = COLORS.ink[900],
  showCheck = false,
  isLast = false,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
  showCheck?: boolean;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: !isLast ? 1 : 0,
        borderBottomColor: COLORS.stone[200],
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.stone[100],
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ionicons name={icon as any} size={18} color={COLORS.stone[500]} />
      </View>
      <Text style={{ marginLeft: 14, color: COLORS.stone[500], flex: 1, fontSize: 15 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontWeight: '600', color: valueColor, fontSize: 15 }}>{value}</Text>
        {showCheck && (
          <Ionicons name="checkmark-circle" size={18} color={COLORS.forest[500]} style={{ marginLeft: 6 }} />
        )}
      </View>
    </View>
  );
}
