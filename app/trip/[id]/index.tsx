import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays } from 'date-fns';
import { getTripById, getItineraryForTrip, getExpensesForTrip, calculateBalances } from '@/lib/mock-data';
import { Card, Badge, Avatar } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export default function TripOverviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trip = getTripById(id);
  const itinerary = getItineraryForTrip(id);
  const expenses = getExpensesForTrip(id);

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
    { icon: 'calendar', value: `${totalDays}`, label: 'Days', color: '#0D9488' },
    { icon: 'compass', value: `${totalActivities}`, label: 'Activities', color: '#F06449' },
    { icon: 'wallet', value: formatCurrency(totalExpenses), label: 'Total', color: '#D4A574' },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      <View className="px-5 py-6">
        {/* Quick Stats */}
        <View className="flex-row -mx-1.5 mb-6">
          {quickStats.map((stat) => (
            <View key={stat.label} className="flex-1 px-1.5">
              <Card variant="elevated" padding="md">
                <View className="items-center">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                  </View>
                  <Text className="text-xl font-bold text-slate-900">
                    {stat.value}
                  </Text>
                  <Text className="text-slate-500 text-sm">{stat.label}</Text>
                </View>
              </Card>
            </View>
          ))}
        </View>

        {/* Trip Details */}
        <Card variant="elevated" className="mb-4">
          <Text className="font-bold text-slate-900 mb-4 text-lg">
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
            valueColor={trip.hasFlights ? 'text-emerald-600' : 'text-slate-500'}
            showCheck={trip.hasFlights}
          />
          <DetailRow
            icon="bed"
            label="Accommodation"
            value={trip.hasHotels ? 'Booked' : 'Not booked'}
            valueColor={trip.hasHotels ? 'text-emerald-600' : 'text-slate-500'}
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

        {/* Travelers */}
        <Card variant="elevated" className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-slate-900 text-lg">
              Travellers ({trip.travelers.length})
            </Text>
            <Pressable className="flex-row items-center">
              <Text className="text-primary-600 font-semibold mr-1">Invite</Text>
              <Ionicons name="add-circle" size={18} color="#0D9488" />
            </Pressable>
          </View>

          {trip.travelers.map((traveler, index) => (
            <View
              key={traveler.id}
              className={`flex-row items-center py-3 ${
                index < trip.travelers.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <Avatar
                source={traveler.avatarUrl}
                name={traveler.name}
                size="md"
              />
              <View className="ml-3 flex-1">
                <Text className="text-slate-900 font-semibold">
                  {traveler.name}
                </Text>
                {traveler.departureCity && (
                  <Text className="text-slate-500 text-sm">
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
        <Card variant="elevated" className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-slate-900 text-lg">
              Expense Summary
            </Text>
            <Pressable onPress={() => router.push(`/trip/${id}/expenses`)}>
              <Text className="text-primary-600 font-semibold">View all</Text>
            </Pressable>
          </View>

          <View className="bg-primary-50 rounded-2xl p-4 mb-4">
            <Text className="text-primary-700 text-sm">Total group expenses</Text>
            <Text className="text-3xl font-bold text-primary-900">
              {formatCurrency(totalExpenses)}
            </Text>
          </View>

          {Object.entries(balances)
            .slice(0, 3)
            .map(([name, balance]) => (
              <View
                key={name}
                className="flex-row items-center justify-between py-2"
              >
                <Text className="text-slate-700">{name}</Text>
                <Text
                  className={`font-semibold ${
                    balance > 0
                      ? 'text-emerald-600'
                      : balance < 0
                      ? 'text-red-500'
                      : 'text-slate-500'
                  }`}
                >
                  {balance > 0 ? 'gets back ' : balance < 0 ? 'owes ' : ''}
                  {formatCurrency(Math.abs(balance))}
                </Text>
              </View>
            ))}
        </Card>

        {/* Share Button */}
        <Pressable className="bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center justify-center active:bg-slate-50">
          <Ionicons name="share-outline" size={20} color="#0D9488" />
          <Text className="text-primary-600 font-semibold ml-2">Share Trip</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueColor = 'text-slate-900',
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
      className={`flex-row items-center py-3 ${
        !isLast ? 'border-b border-slate-100' : ''
      }`}
    >
      <View className="w-9 h-9 bg-slate-100 rounded-xl items-center justify-center">
        <Ionicons name={icon as any} size={18} color="#64748B" />
      </View>
      <Text className="ml-3 text-slate-500 flex-1">{label}</Text>
      <View className="flex-row items-center">
        <Text className={`font-semibold ${valueColor}`}>{value}</Text>
        {showCheck && (
          <Ionicons name="checkmark-circle" size={18} color="#059669" className="ml-1" />
        )}
      </View>
    </View>
  );
}
