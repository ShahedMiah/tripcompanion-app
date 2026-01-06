import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * WAYFARE Tab Layout - Bento Editorial Design
 *
 * Editorial tab bar with warm terracotta accents on cream background.
 * Subtle elevation and refined typography for premium feel.
 *
 * Note: Expo Router handles safe area insets automatically.
 */
export default function TabLayout() {
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
          // Subtle hairline border for clean separation
          borderTopWidth: 1,
          borderTopColor: 'rgba(150, 139, 125, 0.15)',
          // Soft shadow for depth
          shadowColor: '#1A1714',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          // Editorial overline typography
          fontSize: 9,
          fontWeight: '600',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journeys',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
