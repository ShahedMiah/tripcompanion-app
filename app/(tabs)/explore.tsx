import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge } from '@/components/ui';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Explore Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Destination inspiration with category browsing.
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
    500: '#D4A574',
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
  { id: 'beach', icon: 'sunny', label: 'Beach', color: COLORS.amber[500] },
  { id: 'culture', icon: 'library', label: 'Culture', color: '#8B5CF6' },
  { id: 'adventure', icon: 'compass', label: 'Adventure', color: COLORS.terracotta[500] },
  { id: 'food', icon: 'restaurant', label: 'Food', color: '#F06449' },
  { id: 'nature', icon: 'leaf', label: 'Nature', color: COLORS.forest[500] },
  { id: 'city', icon: 'business', label: 'City', color: '#3B82F6' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDestinationPress = (destination: typeof popularDestinations[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.ink[900], letterSpacing: -0.5 }}>
          Explore
        </Text>
        <Text style={{ color: COLORS.stone[500], marginTop: 4, fontSize: 15 }}>
          Find inspiration for your next adventure
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.stone[200],
        }}>
          <Ionicons name="search" size={20} color={COLORS.stone[500]} />
          <TextInput
            placeholder="Search destinations..."
            placeholderTextColor={COLORS.stone[500]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.ink[900] }}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: COLORS.ink[900],
            paddingHorizontal: 24,
            marginBottom: 16,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}>
            Browse by category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  marginRight: 20,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                    backgroundColor: `${category.color}15`,
                  }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={category.color}
                  />
                </View>
                <Text style={{ color: COLORS.stone[700], fontWeight: '500', fontSize: 13 }}>
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Popular Destinations */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.ink[900], letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Popular destinations
            </Text>
            <Pressable>
              <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', fontSize: 13 }}>See all</Text>
            </Pressable>
          </View>

          {popularDestinations.map((destination) => (
            <Pressable
              key={destination.id}
              onPress={() => handleDestinationPress(destination)}
              style={({ pressed }) => ({
                marginBottom: 16,
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Card variant="elevated" padding="none">
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={{ uri: destination.image }}
                    style={{ width: 110, height: 110, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.ink[900], letterSpacing: -0.3 }}>
                      {destination.city}
                    </Text>
                    <Text style={{ color: COLORS.stone[500], fontSize: 14, marginBottom: 6 }}>
                      {destination.country}
                    </Text>
                    <Text style={{ color: COLORS.stone[500], fontSize: 13, marginBottom: 10 }} numberOfLines={1}>
                      {destination.description}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {destination.tags.map((tag) => (
                        <View
                          key={tag}
                          style={{
                            backgroundColor: COLORS.stone[100],
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            marginRight: 6,
                            marginBottom: 4,
                          }}
                        >
                          <Text style={{ color: COLORS.stone[700], fontSize: 11, fontWeight: '600' }}>
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={{ justifyContent: 'center', paddingRight: 16 }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      backgroundColor: COLORS.terracotta[50],
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons name="arrow-forward" size={18} color={COLORS.terracotta[500]} />
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Inspiration Section */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          <Card variant="filled" padding="lg">
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 44,
                height: 44,
                backgroundColor: COLORS.terracotta[500],
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="sparkles" size={22} color="white" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.ink[900], letterSpacing: -0.3 }}>
                Need inspiration?
              </Text>
            </View>
            <Text style={{ color: COLORS.stone[500], marginBottom: 16, lineHeight: 22, fontSize: 15 }}>
              Tell our AI what kind of trip you're dreaming about and we'll suggest the perfect destination.
            </Text>
            <Pressable
              onPress={() => router.push('/trip/new')}
              style={({ pressed }) => ({
                backgroundColor: COLORS.forest[700],
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600', marginRight: 8, fontSize: 15 }}>
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
