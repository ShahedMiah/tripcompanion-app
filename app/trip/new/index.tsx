import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, IconButton, Card } from '@/components/ui';
import { getFlagEmoji } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE New Trip Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Destination selection with popular choices.
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.stone[200],
        backgroundColor: '#FFFFFF',
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
        <Text style={{ fontSize: 17, fontWeight: '600', color: COLORS.ink[900] }}>New Trip</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {/* Title */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '700',
              color: COLORS.ink[900],
              letterSpacing: -0.5,
            }}>
              Where to next?
            </Text>
            <Text style={{
              color: COLORS.stone[500],
              marginTop: 6,
              fontSize: 16,
            }}>
              Tell us about your dream destination
            </Text>
          </View>

          {/* Trip Name Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.stone[700],
              marginBottom: 10,
            }}>
              Trip name (optional)
            </Text>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.stone[200],
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons name="airplane" size={20} color={COLORS.stone[500]} />
              <TextInput
                placeholder="e.g., Summer Adventure 2025"
                placeholderTextColor={COLORS.stone[500]}
                value={tripName}
                onChangeText={setTripName}
                style={{ flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.ink[900] }}
              />
            </View>
          </View>

          {/* Destination Search */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.stone[700],
              marginBottom: 10,
            }}>
              Destination
            </Text>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.stone[200],
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons name="search" size={20} color={COLORS.stone[500]} />
              <TextInput
                placeholder="Search city or country..."
                placeholderTextColor={COLORS.stone[500]}
                value={destination}
                onChangeText={(text) => {
                  setDestination(text);
                  setSelectedDestination(null);
                }}
                style={{ flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.ink[900] }}
              />
            </View>
          </View>

          {/* Popular Destinations */}
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: COLORS.stone[500],
              marginBottom: 16,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Popular destinations
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
              {popularDestinations.map((dest) => (
                <Pressable
                  key={dest.city}
                  onPress={() => handleSelectDestination(dest)}
                  style={{ width: '33.333%', padding: 6 }}
                >
                  <View style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: selectedDestination?.city === dest.city
                      ? COLORS.terracotta[500]
                      : 'transparent',
                  }}>
                    <Image
                      source={{ uri: dest.image }}
                      style={{ width: '100%', height: 100 }}
                      resizeMode="cover"
                    />
                    <View style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.35)',
                      justifyContent: 'flex-end',
                      padding: 10,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'white', marginRight: 4 }}>
                          {getFlagEmoji(dest.countryCode)}
                        </Text>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>
                          {dest.city}
                        </Text>
                      </View>
                    </View>
                    {selectedDestination?.city === dest.city && (
                      <View style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 26,
                        height: 26,
                        backgroundColor: COLORS.terracotta[500],
                        borderRadius: 13,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
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
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.stone[200],
        backgroundColor: '#FFFFFF',
      }}>
        <Pressable
          onPress={handleContinue}
          disabled={!canContinue}
          style={({ pressed }) => ({
            backgroundColor: canContinue ? COLORS.forest[700] : COLORS.stone[300],
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed && canContinue ? 0.9 : 1,
          })}
        >
          <Text style={{
            color: canContinue ? '#FFFFFF' : COLORS.stone[500],
            fontWeight: '600',
            fontSize: 16,
            marginRight: 8,
          }}>
            Continue
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={canContinue ? '#FFFFFF' : COLORS.stone[500]}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
