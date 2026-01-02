import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card, Avatar, Badge } from '@/components/ui';
import { useAppStore } from '@/stores/appStore';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Profile Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * User settings and account management.
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
    800: '#3D352F',
  },
  ink: {
    900: '#1A1A1A',
  },
};

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
      color: COLORS.terracotta[500],
    },
    {
      id: 'preferences',
      title: 'Travel Preferences',
      icon: 'heart-outline',
      color: '#EC4899',
    },
    {
      id: 'currency',
      title: 'Currency & Units',
      icon: 'cash-outline',
      color: COLORS.amber[500],
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }} edges={['top']}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar
              source={user?.avatarUrl}
              name={user?.displayName || 'User'}
              size="xl"
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.ink[900], letterSpacing: -0.5 }}>
                {user?.displayName || 'Traveller'}
              </Text>
              <Text style={{ color: COLORS.stone[500], fontSize: 14, marginTop: 2 }}>
                {user?.email || 'Set up your profile'}
              </Text>
              <View style={{ marginTop: 6 }}>
                <Badge
                  label={user?.subscription === 'pro' ? 'Pro' : 'Free'}
                  variant={user?.subscription === 'pro' ? 'primary' : 'default'}
                  size="sm"
                />
              </View>
            </View>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                backgroundColor: COLORS.stone[100],
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.stone[700]} />
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Card variant="elevated" padding="md">
            <View style={{ flexDirection: 'row' }}>
              {stats.map((stat, index) => (
                <View
                  key={stat.label}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderRightWidth: index < stats.length - 1 ? 1 : 0,
                    borderRightColor: COLORS.stone[200],
                  }}
                >
                  <View style={{
                    width: 44,
                    height: 44,
                    backgroundColor: COLORS.terracotta[50],
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                    <Ionicons name={stat.icon as any} size={20} color={COLORS.terracotta[500]} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.ink[900], letterSpacing: -0.5 }}>
                    {stat.value}
                  </Text>
                  <Text style={{ color: COLORS.stone[500], fontSize: 13, marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Upgrade Banner */}
        {user?.subscription !== 'pro' && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={({ pressed }) => ({
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              })}
            >
              <Card variant="forest" padding="lg">
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Ionicons name="diamond" size={24} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 18, letterSpacing: -0.3 }}>
                      Upgrade to Pro
                    </Text>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, marginTop: 2 }}>
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
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: COLORS.stone[500],
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}>
            Settings
          </Text>
          <Card variant="elevated" padding="none">
            {/* Notifications Toggle */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.stone[200],
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.terracotta[50],
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Ionicons name="notifications-outline" size={20} color={COLORS.terracotta[500]} />
                </View>
                <Text style={{ color: COLORS.ink[900], fontWeight: '500', fontSize: 15 }}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setNotifications(value);
                }}
                trackColor={{ false: COLORS.stone[200], true: COLORS.terracotta[100] }}
                thumbColor={notifications ? COLORS.terracotta[500] : COLORS.stone[500]}
              />
            </View>

            {/* Dark Mode Toggle */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.stone[800],
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Ionicons name="moon-outline" size={20} color="white" />
                </View>
                <Text style={{ color: COLORS.ink[900], fontWeight: '500', fontSize: 15 }}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDarkMode(value);
                }}
                trackColor={{ false: COLORS.stone[200], true: COLORS.stone[700] }}
                thumbColor={darkMode ? '#FFFFFF' : COLORS.stone[500]}
              />
            </View>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: COLORS.stone[500],
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}>
            Menu
          </Text>
          <Card variant="elevated" padding="none">
            {menuItems.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  backgroundColor: pressed ? COLORS.stone[100] : 'transparent',
                  borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: COLORS.stone[200],
                })}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    backgroundColor: `${item.color}15`,
                  }}
                >
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={{ flex: 1, color: COLORS.ink[900], fontWeight: '500', fontSize: 15 }}>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.stone[500]} />
              </Pressable>
            ))}
          </Card>
        </View>

        {/* Sign Out */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => ({
              backgroundColor: '#FEF2F2',
              borderRadius: 16,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={{ color: '#DC2626', fontWeight: '600', marginLeft: 8, fontSize: 15 }}>Sign Out</Text>
          </Pressable>

          <Text style={{ textAlign: 'center', color: COLORS.stone[500], fontSize: 13, marginTop: 24 }}>
            Wayfare v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
