import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tab Layout - MINIMAL BRUTALIST Design
 *
 * Bold borders, hard shadows, high contrast tab bar.
 * Yellow accent for focused state.
 */
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#737373',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 3,
          borderTopColor: '#000000',
          paddingTop: 8,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          elevation: 0,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 4,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TRIPS',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: '#FACC15',
                      padding: 8,
                      borderWidth: 2,
                      borderColor: '#000000',
                    }
                  : {
                      padding: 8,
                    }
              }
            >
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={22}
                color={focused ? '#000000' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'EXPLORE',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: '#FACC15',
                      padding: 8,
                      borderWidth: 2,
                      borderColor: '#000000',
                    }
                  : {
                      padding: 8,
                    }
              }
            >
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={22}
                color={focused ? '#000000' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: '#FACC15',
                      padding: 8,
                      borderWidth: 2,
                      borderColor: '#000000',
                    }
                  : {
                      padding: 8,
                    }
              }
            >
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={focused ? '#000000' : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
