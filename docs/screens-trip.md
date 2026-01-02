# Step 5: Trip Wizard & Detail Screens

## New Trip Wizard

### Create `app/trip/new/index.tsx`

```tsx
import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, IconButton, Card } from '@/components/ui';
import * as Haptics from 'expo-haptics';

const popularDestinations = [
  { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', countryCode: 'FR' },
  { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', countryCode: 'JP' },
  { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', countryCode: 'US' },
  { city: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', countryCode: 'ES' },
  { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', countryCode: 'ID' },
  { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', countryCode: 'AE' },
];

export default function NewTripScreen() {
  const router = useRouter();
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<typeof popularDestinations[0] | null>(null);

  const handleSelectDestination = (dest: typeof popularDestinations[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDestination(dest);
    setDestination(`${dest.city}, ${dest.country}`);
  };

  const handleContinue = () => {
    router.push({
      pathname: '/trip/new/onboarding',
      params: {
        name: tripName || `Trip to ${selectedDestination?.city || destination}`,
        destination: destination,
        city: selectedDestination?.city || destination.split(',')[0],
        country: selectedDestination?.country || '',
        countryCode: selectedDestination?.countryCode || '',
      },
    });
  };

  const canContinue = tripName.length > 0 || destination.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <IconButton icon="close" onPress={() => router.back()} variant="ghost" />
        <Text className="text-lg font-semibold text-gray-900">New Trip</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900">
            Where to next? ✈️
          </Text>
          <Text className="text-gray-500 mt-2">
            Tell us about your dream destination
          </Text>

          {/* Trip Name */}
          <View className="mt-8">
            <Input
              label="Trip name (optional)"
              placeholder="e.g., Summer Adventure 2025"
              value={tripName}
              onChangeText={setTripName}
            />
          </View>

          {/* Destination Search */}
          <View className="mt-6">
            <Input
              label="Destination"
              placeholder="Search city or country..."
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                setSelectedDestination(null);
              }}
              leftIcon={<Ionicons name="search" size={20} color="#9CA3AF" />}
            />
          </View>

          {/* Popular Destinations */}
          <View className="mt-8">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Popular destinations
            </Text>
            <View className="flex-row flex-wrap -mx-1">
              {popularDestinations.map((dest) => (
                <Pressable
                  key={dest.city}
                  onPress={() => handleSelectDestination(dest)}
                  className="w-1/3 p-1"
                >
                  <View
                    className={`
                      rounded-2xl overflow-hidden
                      ${selectedDestination?.city === dest.city ? 'ring-2 ring-primary-500' : ''}
                    `}
                  >
                    <Image
                      source={{ uri: dest.image }}
                      className="w-full h-24"
                      resizeMode="cover"
                    />
                    <View
                      className={`
                        absolute inset-0 justify-end p-2
                        ${selectedDestination?.city === dest.city ? 'bg-primary-500/30' : 'bg-black/30'}
                      `}
                    >
                      <Text className="text-white font-semibold text-sm">
                        {dest.city}
                      </Text>
                      <Text className="text-white/80 text-xs">
                        {dest.country}
                      </Text>
                    </View>
                    {selectedDestination?.city === dest.city && (
                      <View className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-5 py-4 border-t border-gray-100">
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canContinue}
        />
      </View>
    </SafeAreaView>
  );
}
```

### Create `app/trip/new/onboarding.tsx`

```tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, IconButton, Card } from '@/components/ui';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addDays } from 'date-fns';

type Step = 'dates' | 'bookings' | 'purpose' | 'budget' | 'travelers';

interface OnboardingData {
  startDate: Date | null;
  endDate: Date | null;
  datesFlexible: boolean;
  hasFlights: boolean | null;
  hasHotels: boolean | null;
  purpose: string | null;
  budget: { amount: number; type: string } | null;
  travelerCount: number;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string;
    destination: string;
    city: string;
    country: string;
  }>();

  const [step, setStep] = useState<Step>('dates');
  const [data, setData] = useState<OnboardingData>({
    startDate: null,
    endDate: null,
    datesFlexible: false,
    hasFlights: null,
    hasHotels: null,
    purpose: null,
    budget: null,
    travelerCount: 1,
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps: Step[] = ['dates', 'bookings', 'purpose', 'budget', 'travelers'];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    } else {
      router.back();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      // Navigate to the new trip (using mock trip-1 for now)
      router.replace('/trip/trip-1');
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case 'dates':
        return data.startDate !== null || data.datesFlexible;
      case 'bookings':
        return data.hasFlights !== null && data.hasHotels !== null;
      case 'purpose':
        return data.purpose !== null;
      case 'budget':
        return true; // Budget is optional
      case 'travelers':
        return data.travelerCount > 0;
      default:
        return true;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between mb-4">
          <IconButton icon="arrow-back" onPress={handleBack} variant="ghost" />
          <View className="flex-1 mx-4">
            <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
          <Text className="text-gray-400 text-sm">
            {currentIndex + 1}/{steps.length}
          </Text>
        </View>
        <Text className="text-sm text-gray-500">
          Planning: {params.name}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Dates Step */}
        {step === 'dates' && (
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900">
              When are you traveling? 📅
            </Text>
            <Text className="text-gray-500 mt-2">
              This helps us find the best activities and weather info
            </Text>

            <View className="mt-8 space-y-4">
              {/* Start Date */}
              <Pressable
                onPress={() => setShowStartPicker(true)}
                className="bg-gray-50 rounded-xl p-4 flex-row items-center"
              >
                <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
                  <Ionicons name="calendar" size={20} color="#6366F1" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-500">Start date</Text>
                  <Text className="text-gray-900 font-medium">
                    {data.startDate ? format(data.startDate, 'EEE, MMM d, yyyy') : 'Select date'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>

              {/* End Date */}
              <Pressable
                onPress={() => setShowEndPicker(true)}
                className="bg-gray-50 rounded-xl p-4 flex-row items-center"
              >
                <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
                  <Ionicons name="calendar-outline" size={20} color="#6366F1" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-500">End date</Text>
                  <Text className="text-gray-900 font-medium">
                    {data.endDate ? format(data.endDate, 'EEE, MMM d, yyyy') : 'Select date'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>

              {/* Flexible Toggle */}
              <Pressable
                onPress={() => setData({ ...data, datesFlexible: !data.datesFlexible })}
                className="flex-row items-center py-4"
              >
                <View
                  className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
                    data.datesFlexible
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {data.datesFlexible && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="ml-3 text-gray-700">
                  My dates are flexible
                </Text>
              </Pressable>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={data.startDate || new Date()}
                mode="date"
                display="spinner"
                minimumDate={new Date()}
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) {
                    setData({
                      ...data,
                      startDate: date,
                      endDate: data.endDate && data.endDate < date ? null : data.endDate,
                    });
                  }
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={data.endDate || addDays(data.startDate || new Date(), 7)}
                mode="date"
                display="spinner"
                minimumDate={data.startDate || new Date()}
                onChange={(_, date) => {
                  setShowEndPicker(false);
                  if (date) setData({ ...data, endDate: date });
                }}
              />
            )}
          </View>
        )}

        {/* Bookings Step */}
        {step === 'bookings' && (
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900">
              What have you booked? ✅
            </Text>
            <Text className="text-gray-500 mt-2">
              Let us know what's already sorted
            </Text>

            <View className="mt-8 space-y-6">
              <BookingQuestion
                icon="airplane"
                title="Flights"
                question="Have you booked your flights?"
                value={data.hasFlights}
                onChange={(val) => setData({ ...data, hasFlights: val })}
              />
              <BookingQuestion
                icon="bed"
                title="Accommodation"
                question="Have you booked your hotels/stays?"
                value={data.hasHotels}
                onChange={(val) => setData({ ...data, hasHotels: val })}
              />
            </View>
          </View>
        )}

        {/* Purpose Step */}
        {step === 'purpose' && (
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900">
              What's the occasion? 🎉
            </Text>
            <Text className="text-gray-500 mt-2">
              This helps us personalize your recommendations
            </Text>

            <View className="mt-8 space-y-3">
              {[
                { id: 'romantic', icon: 'heart', label: 'Romantic getaway', emoji: '💑' },
                { id: 'friends', icon: 'people', label: 'Trip with friends', emoji: '👯' },
                { id: 'solo', icon: 'person', label: 'Solo adventure', emoji: '🎒' },
                { id: 'family', icon: 'home', label: 'Family vacation', emoji: '👨‍👩‍👧‍👦' },
                { id: 'work', icon: 'briefcase', label: 'Business travel', emoji: '💼' },
              ].map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setData({ ...data, purpose: option.id });
                  }}
                  className={`
                    flex-row items-center p-4 rounded-xl border-2
                    ${data.purpose === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                    }
                  `}
                >
                  <Text className="text-2xl mr-3">{option.emoji}</Text>
                  <Text className={`flex-1 font-medium ${
                    data.purpose === option.id ? 'text-primary-700' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </Text>
                  {data.purpose === option.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Budget Step */}
        {step === 'budget' && (
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900">
              What's your budget? 💰
            </Text>
            <Text className="text-gray-500 mt-2">
              We'll tailor recommendations to fit your budget
            </Text>

            <View className="mt-8 space-y-3">
              {[
                { id: 'budget', label: 'Budget-friendly', desc: 'Keep costs low', emoji: '💵' },
                { id: 'moderate', label: 'Moderate', desc: 'Balance of comfort & value', emoji: '💳' },
                { id: 'luxury', label: 'Luxury', desc: 'Treat yourself', emoji: '💎' },
                { id: 'any', label: 'No budget in mind', desc: 'Show me everything', emoji: '🌟' },
              ].map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setData({ ...data, budget: { amount: 0, type: option.id } });
                  }}
                  className={`
                    flex-row items-center p-4 rounded-xl border-2
                    ${data.budget?.type === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                    }
                  `}
                >
                  <Text className="text-2xl mr-3">{option.emoji}</Text>
                  <View className="flex-1">
                    <Text className={`font-medium ${
                      data.budget?.type === option.id ? 'text-primary-700' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </Text>
                    <Text className="text-sm text-gray-500">{option.desc}</Text>
                  </View>
                  {data.budget?.type === option.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Travelers Step */}
        {step === 'travelers' && (
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900">
              How many travelers? 👥
            </Text>
            <Text className="text-gray-500 mt-2">
              You can invite others to view your trip later
            </Text>

            <View className="mt-8">
              <View className="bg-gray-50 rounded-2xl p-6">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 font-medium">
                    Number of travelers
                  </Text>
                  <View className="flex-row items-center">
                    <Pressable
                      onPress={() => {
                        if (data.travelerCount > 1) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setData({ ...data, travelerCount: data.travelerCount - 1 });
                        }
                      }}
                      className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200"
                    >
                      <Ionicons name="remove" size={20} color="#374151" />
                    </Pressable>
                    <Text className="text-2xl font-bold text-gray-900 mx-6 w-8 text-center">
                      {data.travelerCount}
                    </Text>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setData({ ...data, travelerCount: data.travelerCount + 1 });
                      }}
                      className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
                    >
                      <Ionicons name="add" size={20} color="white" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-5 py-4 border-t border-gray-100">
        <Button
          title={currentIndex === steps.length - 1 ? 'Create Itinerary ✨' : 'Continue'}
          onPress={handleNext}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canProceed()}
          loading={loading}
        />
        {currentIndex === steps.length - 1 && (
          <Text className="text-center text-gray-500 text-sm mt-3">
            AI will generate your personalized itinerary
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function BookingQuestion({
  icon,
  title,
  question,
  value,
  onChange,
}: {
  icon: string;
  title: string;
  question: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <View>
      <View className="flex-row items-center mb-3">
        <Ionicons name={icon as any} size={20} color="#6366F1" />
        <Text className="ml-2 font-semibold text-gray-900">{title}</Text>
      </View>
      <Text className="text-gray-600 mb-3">{question}</Text>
      <View className="flex-row space-x-3">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(true);
          }}
          className={`flex-1 py-3 rounded-xl border-2 items-center ${
            value === true
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200'
          }`}
        >
          <Text className={value === true ? 'text-primary-700 font-medium' : 'text-gray-600'}>
            Yes ✅
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(false);
          }}
          className={`flex-1 py-3 rounded-xl border-2 items-center ${
            value === false
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200'
          }`}
        >
          <Text className={value === false ? 'text-primary-700 font-medium' : 'text-gray-600'}>
            Not yet
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

## Trip Detail Layout with Tabs

### Create `app/trip/[id]/_layout.tsx`

```tsx
import { Tabs, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getTripById } from '@/lib/mock-data';
import { BlurView } from 'expo-blur';

export default function TripLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Trip not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with image */}
      <View style={{ paddingTop: insets.top }} className="bg-gray-900">
        <Image
          source={{ uri: trip.coverImage }}
          className="absolute inset-0 w-full h-full opacity-60"
          resizeMode="cover"
        />
        <View className="px-4 py-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </Pressable>
            <Pressable
              onPress={() => router.push(`/trip/${id}/settings`)}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            >
              <Ionicons name="ellipsis-horizontal" size={22} color="white" />
            </Pressable>
          </View>
          <View className="mt-4 pb-4">
            <Text className="text-white text-2xl font-bold">{trip.name}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 ml-1">
                {trip.destination.city}, {trip.destination.country}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#6366F1',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            paddingTop: 8,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Overview',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="itinerary"
          options={{
            title: 'Itinerary',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Expenses',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Assistant',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </View>
  );
}
```

### Create `app/trip/[id]/index.tsx` (Overview)

```tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays } from 'date-fns';
import { getTripById, getItineraryForTrip, getExpensesForTrip, calculateBalances } from '@/lib/mock-data';
import { Card, Badge, Avatar } from '@/components/ui';

export default function TripOverviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trip = getTripById(id);
  const itinerary = getItineraryForTrip(id);
  const expenses = getExpensesForTrip(id);

  if (!trip) return null;

  const totalDays = trip.startDate && trip.endDate
    ? differenceInDays(trip.endDate, trip.startDate) + 1
    : 0;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount.amount, 0);
  const balances = calculateBalances(expenses);

  const quickStats = [
    { icon: 'calendar', value: `${totalDays}`, label: 'Days' },
    { icon: 'compass', value: `${itinerary.reduce((sum, d) => sum + d.activities.length, 0)}`, label: 'Activities' },
    { icon: 'wallet', value: `£${totalExpenses}`, label: 'Total Cost' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="px-5 py-6">
        {/* Quick Stats */}
        <View className="flex-row -mx-1.5">
          {quickStats.map((stat) => (
            <View key={stat.label} className="flex-1 px-1.5">
              <Card padding="md">
                <View className="items-center">
                  <Ionicons name={stat.icon as any} size={24} color="#6366F1" />
                  <Text className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </Text>
                  <Text className="text-gray-500 text-sm">{stat.label}</Text>
                </View>
              </Card>
            </View>
          ))}
        </View>

        {/* Trip Details */}
        <Card className="mt-4">
          <Text className="font-semibold text-gray-900 mb-4">Trip Details</Text>
          
          <DetailRow
            icon="calendar"
            label="Dates"
            value={trip.startDate
              ? `${format(trip.startDate, 'MMM d')} - ${format(trip.endDate!, 'MMM d, yyyy')}`
              : 'Not set'
            }
          />
          <DetailRow
            icon="airplane"
            label="Flights"
            value={trip.hasFlights ? 'Booked ✓' : 'Not booked'}
            valueColor={trip.hasFlights ? 'text-green-600' : 'text-gray-500'}
          />
          <DetailRow
            icon="bed"
            label="Accommodation"
            value={trip.hasHotels ? 'Booked ✓' : 'Not booked'}
            valueColor={trip.hasHotels ? 'text-green-600' : 'text-gray-500'}
          />
          <DetailRow
            icon="cash"
            label="Budget"
            value={trip.budget
              ? `£${trip.budget.amount} ${trip.budget.type}`
              : 'Not set'
            }
          />
        </Card>

        {/* Travelers */}
        <Card className="mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-semibold text-gray-900">
              Travelers ({trip.travelers.length})
            </Text>
            <Pressable className="flex-row items-center">
              <Text className="text-primary-500 font-medium mr-1">Invite</Text>
              <Ionicons name="add-circle" size={18} color="#6366F1" />
            </Pressable>
          </View>
          
          {trip.travelers.map((traveler) => (
            <View key={traveler.id} className="flex-row items-center py-2">
              <Avatar
                source={traveler.avatarUrl}
                name={traveler.name}
                size="md"
              />
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-medium">{traveler.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {traveler.departureCity && `Flying from ${traveler.departureCity}`}
                </Text>
              </View>
              <Badge
                label={traveler.role}
                variant={traveler.role === 'organizer' ? 'primary' : 'default'}
              />
            </View>
          ))}
        </Card>

        {/* Expense Summary */}
        <Card className="mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-semibold text-gray-900">Expense Summary</Text>
            <Pressable onPress={() => router.push(`/trip/${id}/expenses`)}>
              <Text className="text-primary-500 font-medium">View all</Text>
            </Pressable>
          </View>
          
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-500 text-sm">Total group expenses</Text>
            <Text className="text-3xl font-bold text-gray-900">
              £{totalExpenses.toLocaleString()}
            </Text>
          </View>

          {Object.entries(balances).slice(0, 3).map(([name, balance]) => (
            <View key={name} className="flex-row items-center justify-between py-2">
              <Text className="text-gray-700">{name}</Text>
              <Text className={`font-semibold ${
                balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {balance > 0 ? '+' : ''}£{balance.toFixed(2)}
              </Text>
            </View>
          ))}
        </Card>

        {/* Share Button */}
        <Pressable className="mt-6 bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center justify-center active:bg-gray-50">
          <Ionicons name="share-outline" size={20} color="#6366F1" />
          <Text className="text-primary-600 font-semibold ml-2">
            Share Trip
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueColor = 'text-gray-900',
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
      <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
        <Ionicons name={icon as any} size={16} color="#6B7280" />
      </View>
      <Text className="ml-3 text-gray-500 flex-1">{label}</Text>
      <Text className={`font-medium ${valueColor}`}>{value}</Text>
    </View>
  );
}
```
