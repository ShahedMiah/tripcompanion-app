# Step 4: Auth & Home Screens

## Auth Flow Layout

### Create `app/(auth)/_layout.tsx`

```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
```

### Create `app/(auth)/welcome.tsx`

```tsx
import { View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Hero Image */}
      <View style={{ height: height * 0.55 }}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800' }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.8)', 'white']}
          className="absolute bottom-0 left-0 right-0 h-32"
        />
      </View>

      {/* Content */}
      <SafeAreaView edges={['bottom']} className="flex-1 px-6 -mt-8">
        <View className="flex-1">
          {/* Logo/Brand */}
          <View className="items-center mb-4">
            <View className="w-14 h-14 bg-primary-500 rounded-2xl items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">T</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">
              TripCompanion
            </Text>
            <Text className="text-lg text-gray-500 mt-1">
              Your travel itinerary in your pocket
            </Text>
          </View>

          {/* Features */}
          <View className="mt-6 space-y-3">
            <FeatureItem 
              emoji="✨" 
              text="AI-powered itinerary planning" 
            />
            <FeatureItem 
              emoji="👥" 
              text="Share trips with friends & family" 
            />
            <FeatureItem 
              emoji="💰" 
              text="Track expenses and split costs" 
            />
          </View>
        </View>

        {/* Buttons */}
        <View className="space-y-3 pb-4">
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/register')}
            variant="primary"
            size="lg"
            fullWidth
          />
          <Button
            title="I already have an account"
            onPress={() => router.push('/(auth)/login')}
            variant="ghost"
            size="lg"
            fullWidth
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function FeatureItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
      <Text className="text-xl mr-3">{emoji}</Text>
      <Text className="text-gray-700 font-medium">{text}</Text>
    </View>
  );
}
```

### Create `app/(auth)/login.tsx`

```tsx
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, IconButton } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Mock login - just navigate to tabs
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-2">
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>

        <View className="flex-1 px-6">
          {/* Title */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Welcome back
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Sign in to continue planning your adventures
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>
              }
            />

            <Pressable className="self-end">
              <Text className="text-primary-500 font-medium">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          {/* Social Login */}
          <View className="mt-8">
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-400">or continue with</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            <View className="flex-row justify-center space-x-4">
              <SocialButton icon="logo-google" />
              <SocialButton icon="logo-apple" />
            </View>
          </View>
        </View>

        {/* Bottom Button */}
        <View className="px-6 pb-4">
          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!email || !password}
          />

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary-500 font-semibold">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SocialButton({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable className="w-14 h-14 bg-gray-100 rounded-xl items-center justify-center active:bg-gray-200">
      <Ionicons name={icon} size={24} color="#374151" />
    </Pressable>
  );
}
```

### Create `app/(auth)/register.tsx`

```tsx
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, IconButton } from '@/components/ui';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-2">
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Create account
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Start planning your next adventure
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <Input
              label="Full name"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              leftIcon={<Ionicons name="person-outline" size={20} color="#9CA3AF" />}
            />

            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
              hint="Must be at least 8 characters"
            />
          </View>

          {/* Terms */}
          <Text className="text-sm text-gray-500 mt-6 text-center">
            By creating an account, you agree to our{' '}
            <Text className="text-primary-500">Terms of Service</Text> and{' '}
            <Text className="text-primary-500">Privacy Policy</Text>
          </Text>
        </ScrollView>

        {/* Bottom Button */}
        <View className="px-6 pb-4">
          <Button
            title="Create Account"
            onPress={handleRegister}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!name || !email || !password}
          />

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">Already have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary-500 font-semibold">Sign in</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

## Tabs Layout

### Create `app/(tabs)/_layout.tsx`

```tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Create `app/(tabs)/index.tsx` (Home - Trip List)

```tsx
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays, isPast, isFuture } from 'date-fns';
import { mockTrips, mockCurrentUser } from '@/lib/mock-data';
import { Trip } from '@/types';
import { Card, Badge, Avatar, EmptyState } from '@/components/ui';
import { purposeIcons } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  // Group trips by status
  const upcomingTrips = mockTrips.filter(
    t => t.status === 'booked' || (t.status === 'planning' && t.startDate && isFuture(t.startDate))
  );
  const planningTrips = mockTrips.filter(
    t => t.status === 'planning' && (!t.startDate || isFuture(t.startDate))
  );
  const pastTrips = mockTrips.filter(
    t => t.status === 'completed' || (t.startDate && isPast(t.endDate || t.startDate))
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 text-sm">Welcome back,</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {mockCurrentUser.displayName.split(' ')[0]} 👋
              </Text>
            </View>
            <Avatar 
              source={mockCurrentUser.avatarUrl} 
              name={mockCurrentUser.displayName}
              size="lg"
            />
          </View>
        </View>

        {/* New Trip Button */}
        <View className="px-5 mt-4">
          <Pressable
            onPress={() => router.push('/trip/new')}
            className="bg-primary-500 rounded-2xl p-5 flex-row items-center justify-between active:bg-primary-600"
          >
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">
                Plan a new trip
              </Text>
              <Text className="text-primary-100 mt-1">
                Let AI help you create the perfect itinerary
              </Text>
            </View>
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="add" size={28} color="white" />
            </View>
          </Pressable>
        </View>

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <View className="mt-8">
            <View className="px-5 flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">
                Upcoming Trips
              </Text>
              <Text className="text-primary-500 font-medium">See all</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              decelerationRate="fast"
              snapToInterval={width - 60}
            >
              {upcomingTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPress={() => router.push(`/trip/${trip.id}`)}
                  style={{ marginRight: index < upcomingTrips.length - 1 ? 16 : 0 }}
                  variant="large"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Planning */}
        {planningTrips.length > 0 && (
          <View className="mt-8 px-5">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Still Planning
            </Text>
            {planningTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                onPress={() => router.push(`/trip/${trip.id}`)}
                variant="compact"
                style={{ marginBottom: 12 }}
              />
            ))}
          </View>
        )}

        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <View className="mt-8 px-5 pb-8">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Past Adventures
            </Text>
            {pastTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                onPress={() => router.push(`/trip/${trip.id}`)}
                variant="compact"
                style={{ marginBottom: 12 }}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {mockTrips.length === 0 && (
          <EmptyState
            icon="airplane-outline"
            title="No trips yet"
            description="Start planning your next adventure!"
            actionLabel="Create Trip"
            onAction={() => router.push('/trip/new')}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  variant: 'large' | 'compact';
  style?: any;
}

function TripCard({ trip, onPress, variant, style }: TripCardProps) {
  const daysUntil = trip.startDate
    ? differenceInDays(trip.startDate, new Date())
    : null;

  const statusBadge = {
    planning: { label: 'Planning', variant: 'primary' as const },
    booked: { label: 'Booked', variant: 'success' as const },
    active: { label: 'Active', variant: 'warning' as const },
    completed: { label: 'Completed', variant: 'default' as const },
  };

  if (variant === 'large') {
    return (
      <Pressable
        onPress={onPress}
        className="active:scale-[0.98]"
        style={[{ width: width - 80 }, style]}
      >
        <View className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/5">
          {/* Image */}
          <View className="h-40 relative">
            <Image
              source={{ uri: trip.coverImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute top-3 left-3">
              <Badge
                label={statusBadge[trip.status].label}
                variant={statusBadge[trip.status].variant}
                size="md"
              />
            </View>
            {daysUntil !== null && daysUntil > 0 && (
              <View className="absolute top-3 right-3 bg-black/60 px-3 py-1 rounded-full">
                <Text className="text-white text-sm font-medium">
                  {daysUntil}d to go
                </Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-900">
              {trip.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text className="text-gray-500 ml-1">
                {trip.destination.city}, {trip.destination.country}
              </Text>
            </View>

            {/* Dates */}
            {trip.startDate && (
              <View className="flex-row items-center mt-3">
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text className="text-gray-600 ml-1 text-sm">
                  {format(trip.startDate, 'MMM d')} - {format(trip.endDate!, 'MMM d, yyyy')}
                </Text>
              </View>
            )}

            {/* Travelers */}
            <View className="flex-row items-center justify-between mt-4">
              <View className="flex-row">
                {trip.travelers.slice(0, 4).map((traveler, i) => (
                  <View
                    key={traveler.id}
                    style={{ marginLeft: i > 0 ? -8 : 0 }}
                  >
                    <Avatar
                      source={traveler.avatarUrl}
                      name={traveler.name}
                      size="sm"
                    />
                  </View>
                ))}
                {trip.travelers.length > 4 && (
                  <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center -ml-2">
                    <Text className="text-xs font-medium text-gray-600">
                      +{trip.travelers.length - 4}
                    </Text>
                  </View>
                )}
              </View>
              <Ionicons
                name={purposeIcons[trip.purpose] as any}
                size={18}
                color="#9CA3AF"
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  // Compact variant
  return (
    <Card onPress={onPress} padding="none" style={style}>
      <View className="flex-row">
        <Image
          source={{ uri: trip.coverImage }}
          className="w-24 h-24 rounded-l-2xl"
          resizeMode="cover"
        />
        <View className="flex-1 p-3 justify-center">
          <View className="flex-row items-center">
            <Badge
              label={statusBadge[trip.status].label}
              variant={statusBadge[trip.status].variant}
            />
          </View>
          <Text className="text-base font-bold text-gray-900 mt-1">
            {trip.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location" size={12} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm ml-1">
              {trip.destination.city}
            </Text>
            {trip.startDate && (
              <>
                <Text className="text-gray-300 mx-2">•</Text>
                <Text className="text-gray-500 text-sm">
                  {format(trip.startDate, 'MMM d')}
                </Text>
              </>
            )}
          </View>
        </View>
        <View className="justify-center pr-3">
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </View>
      </View>
    </Card>
  );
}
```

### Create `app/(tabs)/explore.tsx`

```tsx
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/ui';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Explore</Text>
      </View>
      <EmptyState
        icon="compass-outline"
        title="Coming Soon"
        description="Discover new destinations and get inspired for your next trip"
      />
    </SafeAreaView>
  );
}
```

### Create `app/(tabs)/profile.tsx`

```tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockCurrentUser, mockTrips } from '@/lib/mock-data';
import { Avatar, Card } from '@/components/ui';

export default function ProfileScreen() {
  const router = useRouter();

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', screen: '/profile/edit' },
    { icon: 'heart-outline', label: 'Travel Preferences', screen: '/profile/preferences' },
    { icon: 'notifications-outline', label: 'Notifications', screen: '/profile/notifications' },
    { icon: 'card-outline', label: 'Subscription', screen: '/profile/subscription' },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: '/profile/help' },
    { icon: 'information-circle-outline', label: 'About', screen: '/profile/about' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-2xl font-bold text-gray-900">Profile</Text>
        </View>

        {/* User Card */}
        <View className="px-5 mb-6">
          <Card padding="lg">
            <View className="flex-row items-center">
              <Avatar
                source={mockCurrentUser.avatarUrl}
                name={mockCurrentUser.displayName}
                size="xl"
              />
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  {mockCurrentUser.displayName}
                </Text>
                <Text className="text-gray-500">{mockCurrentUser.email}</Text>
                <View className="flex-row items-center mt-2">
                  <View className="bg-primary-100 px-2 py-1 rounded-full">
                    <Text className="text-primary-700 text-xs font-semibold">
                      {mockCurrentUser.subscription.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row mt-6 pt-4 border-t border-gray-100">
              <StatItem value={mockTrips.length} label="Trips" />
              <StatItem 
                value={mockTrips.filter(t => t.status === 'completed').length} 
                label="Completed" 
              />
              <StatItem 
                value={new Set(mockTrips.map(t => t.destination.country)).size} 
                label="Countries" 
              />
            </View>
          </Card>
        </View>

        {/* Menu */}
        <View className="px-5">
          <Card padding="none">
            {menuItems.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => console.log(`Navigate to ${item.screen}`)}
                className={`
                  flex-row items-center px-4 py-4
                  ${index < menuItems.length - 1 ? 'border-b border-gray-100' : ''}
                  active:bg-gray-50
                `}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color="#6B7280"
                  />
                </View>
                <Text className="flex-1 ml-3 text-gray-900 font-medium">
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </Pressable>
            ))}
          </Card>
        </View>

        {/* Sign Out */}
        <View className="px-5 mt-6 mb-8">
          <Pressable
            onPress={() => router.replace('/(auth)/welcome')}
            className="py-4 items-center"
          >
            <Text className="text-red-500 font-semibold">Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-gray-500 text-sm">{label}</Text>
    </View>
  );
}
```

## Root Index Redirect

### Update `app/index.tsx`

```tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // For now, always redirect to welcome screen
  // Later: check auth state and redirect accordingly
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
```
