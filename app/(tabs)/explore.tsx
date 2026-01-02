import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge } from '@/components/ui';
import * as Haptics from 'expo-haptics';

const popularDestinations = [
  {
    id: '1',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'Ancient temples meet cutting-edge technology',
    tags: ['Culture', 'Food', 'Modern'],
  },
  {
    id: '2',
    city: 'Marrakesh',
    country: 'Morocco',
    countryCode: 'MA',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800',
    description: 'Vibrant souks and stunning riads',
    tags: ['Adventure', 'Culture', 'Historic'],
  },
  {
    id: '3',
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    description: 'Gaudí masterpieces and Mediterranean vibes',
    tags: ['Architecture', 'Beach', 'Food'],
  },
  {
    id: '4',
    city: 'Bali',
    country: 'Indonesia',
    countryCode: 'ID',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    description: 'Tropical paradise with spiritual soul',
    tags: ['Nature', 'Wellness', 'Beach'],
  },
];

const categories = [
  { id: 'beach', icon: 'sunny', label: 'Beach', color: '#F59E0B' },
  { id: 'culture', icon: 'library', label: 'Culture', color: '#8B5CF6' },
  { id: 'adventure', icon: 'compass', label: 'Adventure', color: '#0D9488' },
  { id: 'food', icon: 'restaurant', label: 'Food', color: '#F06449' },
  { id: 'nature', icon: 'leaf', label: 'Nature', color: '#10B981' },
  { id: 'city', icon: 'business', label: 'City', color: '#3B82F6' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDestinationPress = (destination: typeof popularDestinations[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to new trip with pre-filled destination
    router.push({
      pathname: '/trip/new',
      params: {
        city: destination.city,
        country: destination.country,
        countryCode: destination.countryCode,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-2xl font-bold text-slate-900 mb-1">
          Explore
        </Text>
        <Text className="text-slate-500">
          Find inspiration for your next adventure
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-5 mb-4">
        <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center border border-slate-200">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Search destinations..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base text-slate-900"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-900 px-5 mb-4">
            Browse by category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="items-center mr-5 active:opacity-80"
              >
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={category.color}
                  />
                </View>
                <Text className="text-slate-600 font-medium text-sm">
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Popular Destinations */}
        <View className="px-5 pb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-slate-900">
              Popular destinations
            </Text>
            <Pressable>
              <Text className="text-primary-600 font-semibold">See all</Text>
            </Pressable>
          </View>

          {popularDestinations.map((destination) => (
            <Pressable
              key={destination.id}
              onPress={() => handleDestinationPress(destination)}
              className="mb-4 active:scale-[0.98] active:opacity-90"
            >
              <Card variant="elevated" padding="none">
                <View className="flex-row">
                  <Image
                    source={{ uri: destination.image }}
                    className="w-28 h-28 rounded-l-3xl"
                    resizeMode="cover"
                  />
                  <View className="flex-1 p-4 justify-center">
                    <Text className="text-lg font-bold text-slate-900">
                      {destination.city}
                    </Text>
                    <Text className="text-slate-500 text-sm mb-2">
                      {destination.country}
                    </Text>
                    <Text className="text-slate-400 text-sm mb-3" numberOfLines={1}>
                      {destination.description}
                    </Text>
                    <View className="flex-row flex-wrap">
                      {destination.tags.map((tag) => (
                        <View
                          key={tag}
                          className="bg-slate-100 rounded-full px-2.5 py-1 mr-1.5 mb-1"
                        >
                          <Text className="text-slate-600 text-xs font-medium">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="justify-center pr-4">
                    <View className="w-8 h-8 bg-primary-50 rounded-full items-center justify-center">
                      <Ionicons name="arrow-forward" size={16} color="#0D9488" />
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Inspiration Section */}
        <View className="px-5 pb-8">
          <Card variant="filled" padding="lg">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-primary-500 rounded-xl items-center justify-center mr-3">
                <Ionicons name="sparkles" size={20} color="white" />
              </View>
              <Text className="text-lg font-bold text-slate-900">
                Need inspiration?
              </Text>
            </View>
            <Text className="text-slate-500 mb-4">
              Tell our AI what kind of trip you're dreaming about and we'll suggest the perfect destination.
            </Text>
            <Pressable
              onPress={() => router.push('/trip/new')}
              className="bg-primary-600 rounded-xl py-3 px-5 flex-row items-center justify-center active:bg-primary-700"
            >
              <Text className="text-white font-semibold mr-2">
                Let AI suggest a trip
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
