import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card, Avatar, Badge } from '@/components/ui';
import { useAppStore } from '@/stores/appStore';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, trips } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  const stats = [
    { label: 'Trips', value: trips.length, icon: 'compass' },
    { label: 'Countries', value: new Set(trips.map(t => t.destination.countryCode)).size, icon: 'globe' },
    { label: 'Days Away', value: 45, icon: 'calendar' },
  ];

  const menuItems = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'person-outline',
      color: '#0D9488',
    },
    {
      id: 'preferences',
      title: 'Travel Preferences',
      icon: 'heart-outline',
      color: '#F06449',
    },
    {
      id: 'currency',
      title: 'Currency & Units',
      icon: 'cash-outline',
      color: '#D4A574',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: '#3B82F6',
    },
    {
      id: 'about',
      title: 'About Wayfare',
      icon: 'information-circle-outline',
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center">
            <Avatar
              source={user?.avatarUrl}
              name={user?.displayName || 'User'}
              size="xl"
            />
            <View className="ml-4 flex-1">
              <Text className="text-2xl font-bold text-slate-900">
                {user?.displayName || 'Traveller'}
              </Text>
              <Text className="text-slate-500">
                {user?.email || 'Set up your profile'}
              </Text>
              <Badge
                label={user?.subscription === 'pro' ? 'Pro' : 'Free'}
                variant={user?.subscription === 'pro' ? 'primary' : 'default'}
                size="sm"
              />
            </View>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
            >
              <Ionicons name="create-outline" size={20} color="#64748B" />
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View className="px-5 mb-6">
          <Card variant="elevated" padding="md">
            <View className="flex-row">
              {stats.map((stat, index) => (
                <View
                  key={stat.label}
                  className={`flex-1 items-center ${
                    index < stats.length - 1 ? 'border-r border-slate-100' : ''
                  }`}
                >
                  <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center mb-2">
                    <Ionicons name={stat.icon as any} size={20} color="#0D9488" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </Text>
                  <Text className="text-slate-500 text-sm">{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Upgrade Banner */}
        {user?.subscription !== 'pro' && (
          <View className="px-5 mb-6">
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              className="active:scale-[0.98]"
            >
              <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-primary-600 to-primary-500">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4">
                    <Ionicons name="diamond" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">
                      Upgrade to Pro
                    </Text>
                    <Text className="text-white/80 text-sm">
                      Unlimited trips, AI features, and more
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </View>
              </Card>
            </Pressable>
          </View>
        )}

        {/* Settings */}
        <View className="px-5 mb-6">
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">
            Settings
          </Text>
          <Card variant="elevated" padding="none">
            {/* Notifications Toggle */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="notifications-outline" size={20} color="#0D9488" />
                </View>
                <Text className="text-slate-800 font-medium">Notifications</Text>
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

            {/* Dark Mode Toggle */}
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-slate-800 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="moon-outline" size={20} color="white" />
                </View>
                <Text className="text-slate-800 font-medium">Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDarkMode(value);
                }}
                trackColor={{ false: '#E2E8F0', true: '#1E293B' }}
                thumbColor={darkMode ? '#F1F5F9' : '#94A3B8'}
              />
            </View>
          </Card>
        </View>

        {/* Menu Items */}
        <View className="px-5 mb-6">
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">
            Menu
          </Text>
          <Card variant="elevated" padding="none">
            {menuItems.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className={`flex-row items-center px-4 py-4 active:bg-slate-50 ${
                  index < menuItems.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text className="flex-1 text-slate-800 font-medium">
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>
            ))}
          </Card>
        </View>

        {/* Sign Out */}
        <View className="px-5 pb-8">
          <Pressable
            onPress={handleLogout}
            className="bg-red-50 rounded-2xl py-4 flex-row items-center justify-center active:bg-red-100"
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
          </Pressable>

          <Text className="text-center text-slate-400 text-sm mt-6">
            Wayfare v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
