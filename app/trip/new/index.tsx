import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, IconButton, Card } from '@/components/ui';
import { getFlagEmoji } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

const popularDestinations = [
  {
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
  },
  {
    city: 'New York',
    country: 'USA',
    countryCode: 'US',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    countryCode: 'ID',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    countryCode: 'AE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
  },
];

export default function NewTripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    city?: string;
    country?: string;
    countryCode?: string;
  }>();

  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<
    (typeof popularDestinations)[0] | null
  >(null);

  // Pre-fill from params if coming from Explore
  useEffect(() => {
    if (params.city && params.country) {
      setDestination(`${params.city}, ${params.country}`);
      setSelectedDestination({
        city: params.city,
        country: params.country,
        countryCode: params.countryCode || '',
        image: '',
      });
    }
  }, [params]);

  const handleSelectDestination = (dest: (typeof popularDestinations)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDestination(dest);
    setDestination(`${dest.city}, ${dest.country}`);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/trip/new/onboarding',
      params: {
        name: tripName || `Trip to ${selectedDestination?.city || destination.split(',')[0]}`,
        destination: destination,
        city: selectedDestination?.city || destination.split(',')[0]?.trim(),
        country: selectedDestination?.country || destination.split(',')[1]?.trim() || '',
        countryCode: selectedDestination?.countryCode || '',
      },
    });
  };

  const canContinue = destination.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
        <IconButton icon="close" onPress={() => router.back()} variant="ghost" />
        <Text className="text-lg font-semibold text-slate-900">New Trip</Text>
        <View className="w-11" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6">
          {/* Title */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-slate-900">
              Where to next?
            </Text>
            <Text className="text-slate-500 mt-2 text-lg">
              Tell us about your dream destination
            </Text>
          </View>

          {/* Trip Name */}
          <View className="mb-6">
            <Input
              label="Trip name (optional)"
              placeholder="e.g., Summer Adventure 2025"
              value={tripName}
              onChangeText={setTripName}
              leftIcon={<Ionicons name="airplane" size={20} color="#94A3B8" />}
            />
          </View>

          {/* Destination Search */}
          <View className="mb-8">
            <Input
              label="Destination"
              placeholder="Search city or country..."
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                setSelectedDestination(null);
              }}
              leftIcon={<Ionicons name="search" size={20} color="#94A3B8" />}
            />
          </View>

          {/* Popular Destinations */}
          <View>
            <Text className="text-sm font-semibold text-slate-700 mb-4 tracking-wide">
              POPULAR DESTINATIONS
            </Text>
            <View className="flex-row flex-wrap -mx-1.5">
              {popularDestinations.map((dest) => (
                <Pressable
                  key={dest.city}
                  onPress={() => handleSelectDestination(dest)}
                  className="w-1/3 p-1.5"
                >
                  <View
                    className={`rounded-2xl overflow-hidden border-2 ${
                      selectedDestination?.city === dest.city
                        ? 'border-primary-500'
                        : 'border-transparent'
                    }`}
                  >
                    <Image
                      source={{ uri: dest.image }}
                      className="w-full h-24"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/40 justify-end p-2.5">
                      <View className="flex-row items-center">
                        <Text className="text-white mr-1">
                          {getFlagEmoji(dest.countryCode)}
                        </Text>
                        <Text className="text-white font-bold text-sm">
                          {dest.city}
                        </Text>
                      </View>
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
      <View className="px-6 py-4 border-t border-slate-100">
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canContinue}
          icon={<Ionicons name="arrow-forward" size={20} color="white" />}
          iconPosition="right"
        />
      </View>
    </SafeAreaView>
  );
}
