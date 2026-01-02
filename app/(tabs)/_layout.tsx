import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * WAYFARE Tab Layout - Bento Editorial Design
 *
 * Editorial tab bar with warm terracotta accents on cream background.
 * Subtle elevation and refined typography for premium feel.
 */
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Terracotta for active state - warm editorial accent
        tabBarActiveTintColor: '#C4704A',
        // Muted stone for inactive - subtle contrast
        tabBarInactiveTintColor: '#968B7D',
        tabBarStyle: {
          // Cream background for editorial warmth
          backgroundColor: '#FFFBF5',
          borderTopWidth: 0,
          // Subtle editorial shadow instead of border
          shadowColor: '#1A1714',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 8,
          paddingTop: 12,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          // Editorial overline typography
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: 4,
        },
        // Active indicator styling
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journeys',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 6,
                borderRadius: 12,
                backgroundColor: focused ? 'rgba(196, 112, 74, 0.1)' : 'transparent',
              }}
            >
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 6,
                borderRadius: 12,
                backgroundColor: focused ? 'rgba(196, 112, 74, 0.1)' : 'transparent',
              }}
            >
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 6,
                borderRadius: 12,
                backgroundColor: focused ? 'rgba(196, 112, 74, 0.1)' : 'transparent',
              }}
            >
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
