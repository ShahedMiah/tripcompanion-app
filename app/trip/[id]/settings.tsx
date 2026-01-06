import { View, Text, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getTripById } from '@/lib/mock-data';
import { Card, Avatar, IconButton, Button } from '@/components/ui';
import { getFlagEmoji } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

export default function TripSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trip = getTripById(id);

  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  if (!trip) return null;

  const shareLink = `https://wayfare.app/trip/${trip.shareCode}`;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(shareLink);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Share link copied to clipboard');
  };

  const handleDeleteTrip = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-slate-100">
        <IconButton icon="arrow-back" onPress={() => router.back()} variant="ghost" />
        <Text className="flex-1 text-lg font-bold text-slate-900 ml-2">
          Trip Settings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-6">
          {/* Trip Info */}
          <Card variant="outlined" padding="lg" className="mb-6">
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-primary-100 rounded-2xl items-center justify-center">
                <Text className="text-2xl">
                  {getFlagEmoji(trip.destination.countryCode)}
                </Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold text-slate-900">
                  {trip.name}
                </Text>
                <Text className="text-slate-500">
                  {trip.destination.city}, {trip.destination.country}
                </Text>
              </View>
              <IconButton icon="create-outline" onPress={() => {}} variant="ghost" />
            </View>
          </Card>

          {/* Sharing */}
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">
            Sharing
          </Text>
          <Card variant="outlined" padding="md" className="mb-6">
            <Text className="font-bold text-slate-900 mb-2">Share Link</Text>
            <Text className="text-slate-500 text-sm mb-4">
              Anyone with this link can view your trip itinerary
            </Text>
            <View className="bg-slate-50 rounded-2xl p-4 flex-row items-center">
              <Text className="flex-1 text-slate-600 text-sm" numberOfLines={1}>
                {shareLink}
              </Text>
              <Pressable
                onPress={handleCopyLink}
                className="ml-3 px-4 py-2 bg-primary-500 rounded-xl active:bg-primary-600"
              >
                <Text className="text-white font-semibold">Copy</Text>
              </Pressable>
            </View>

            <View className="flex-row mt-4 pt-4 border-t border-slate-100">
              <Pressable className="flex-1 flex-row items-center justify-center py-2 active:opacity-80">
                <Ionicons name="mail-outline" size={20} color="#0D9488" />
                <Text className="text-primary-600 font-semibold ml-2">Email</Text>
              </Pressable>
              <View className="w-px bg-slate-200" />
              <Pressable className="flex-1 flex-row items-center justify-center py-2 active:opacity-80">
                <Ionicons name="logo-whatsapp" size={20} color="#0D9488" />
                <Text className="text-primary-600 font-semibold ml-2">WhatsApp</Text>
              </Pressable>
            </View>
          </Card>

          {/* Travelers */}
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">
            Travellers ({trip.travelers.length})
          </Text>
          <Card variant="outlined" padding="md" className="mb-6">
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
                  <Text className="font-semibold text-slate-900">{traveler.name}</Text>
                  <Text className="text-slate-500 text-sm">{traveler.email}</Text>
                </View>
                <View className="bg-slate-100 px-2.5 py-1 rounded-full">
                  <Text className="text-slate-600 text-xs font-medium capitalize">
                    {traveler.role}
                  </Text>
                </View>
              </View>
            ))}
            <Pressable className="flex-row items-center justify-center py-4 mt-2 active:opacity-80">
              <Ionicons name="person-add" size={20} color="#0D9488" />
              <Text className="text-primary-600 font-semibold ml-2">
                Invite Traveller
              </Text>
            </Pressable>
          </Card>

          {/* Preferences */}
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">
            Preferences
          </Text>
          <Card variant="outlined" padding="none" className="mb-6">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-primary-100 rounded-xl items-center justify-center">
                  <Ionicons name="notifications" size={20} color="#0D9488" />
                </View>
                <View className="ml-3">
                  <Text className="font-semibold text-slate-900">Notifications</Text>
                  <Text className="text-slate-500 text-sm">Reminders and updates</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setNotifications(value);
                }}
                trackColor={{ false: '#E2E8F0', true: '#99F6EC' }}
                thumbColor={notifications ? '#0D9488' : '#94A3B8'}
              />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl items-center justify-center">
                  <Ionicons name="sync" size={20} color="#059669" />
                </View>
                <View className="ml-3">
                  <Text className="font-semibold text-slate-900">Auto-sync email</Text>
                  <Text className="text-slate-500 text-sm">Import bookings from Gmail</Text>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAutoSync(value);
                }}
                trackColor={{ false: '#E2E8F0', true: '#A7F3D0' }}
                thumbColor={autoSync ? '#059669' : '#94A3B8'}
              />
            </View>
          </Card>

          {/* Danger Zone */}
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">
            Danger Zone
          </Text>
          <Card variant="outlined" padding="md">
            <Pressable
              onPress={handleDeleteTrip}
              className="flex-row items-center py-2 active:opacity-80"
            >
              <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center">
                <Ionicons name="trash" size={20} color="#DC2626" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-red-600">Delete Trip</Text>
                <Text className="text-slate-500 text-sm">
                  Permanently delete this trip and all data
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#DC2626" />
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
