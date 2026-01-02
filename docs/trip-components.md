# Step 9: Additional Components & Utilities

## Date Picker Component (if not using native)

### Create `components/ui/DatePicker.tsx`

```tsx
import { View, Text, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
} from 'date-fns';
import * as Haptics from 'expo-haptics';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  visible: boolean;
  onClose: () => void;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  visible,
  onClose,
}: DatePickerProps) {
  const [viewDate, setViewDate] = useState(value || new Date());

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month
  const startPadding = monthStart.getDay();
  const paddedDays = [...Array(startPadding).fill(null), ...days];

  const handleSelectDate = (date: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(date);
    onClose();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center px-6"
      >
        <Pressable className="bg-white rounded-2xl p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => setViewDate(subMonths(viewDate, 1))}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </Pressable>
            <Text className="text-lg font-semibold text-gray-900">
              {format(viewDate, 'MMMM yyyy')}
            </Text>
            <Pressable
              onPress={() => setViewDate(addMonths(viewDate, 1))}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="chevron-forward" size={24} color="#374151" />
            </Pressable>
          </View>

          {/* Weekday headers */}
          <View className="flex-row mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <View key={day} className="flex-1 items-center py-2">
                <Text className="text-xs text-gray-500 font-medium">{day}</Text>
              </View>
            ))}
          </View>

          {/* Days grid */}
          <View className="flex-row flex-wrap">
            {paddedDays.map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} className="w-[14.28%] h-10" />;
              }

              const isSelected = value && isSameDay(date, value);
              const isToday = isSameDay(date, new Date());
              const disabled = isDateDisabled(date);

              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => !disabled && handleSelectDate(date)}
                  className="w-[14.28%] h-10 items-center justify-center"
                >
                  <View
                    className={`w-9 h-9 rounded-full items-center justify-center ${
                      isSelected
                        ? 'bg-primary-500'
                        : isToday
                        ? 'bg-primary-100'
                        : ''
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? 'text-white font-semibold'
                          : disabled
                          ? 'text-gray-300'
                          : isToday
                          ? 'text-primary-600 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {format(date, 'd')}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Actions */}
          <View className="flex-row justify-end mt-4 pt-4 border-t border-gray-100">
            <Pressable onPress={onClose} className="px-4 py-2">
              <Text className="text-gray-500 font-medium">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

## Loading Skeleton Components

### Create `components/ui/Skeleton.tsx`

```tsx
import { View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      className={`bg-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        opacity,
      }}
    />
  );
}

// Pre-built skeleton patterns
export function TripCardSkeleton() {
  return (
    <View className="bg-white rounded-3xl overflow-hidden shadow-sm">
      <Skeleton height={160} borderRadius={0} />
      <View className="p-4">
        <Skeleton width="70%" height={24} className="mb-2" />
        <Skeleton width="50%" height={16} className="mb-4" />
        <View className="flex-row">
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width={32} height={32} borderRadius={16} className="ml-[-8px]" />
          <Skeleton width={32} height={32} borderRadius={16} className="ml-[-8px]" />
        </View>
      </View>
    </View>
  );
}

export function ActivityCardSkeleton() {
  return (
    <View className="flex-row mb-4">
      <Skeleton width={40} height={40} borderRadius={20} />
      <View className="flex-1 ml-4">
        <View className="bg-white rounded-xl p-4">
          <Skeleton width="30%" height={12} className="mb-2" />
          <Skeleton width="80%" height={18} className="mb-2" />
          <Skeleton width="60%" height={14} />
        </View>
      </View>
    </View>
  );
}
```

## Pull to Refresh Hook

### Create `hooks/usePullToRefresh.ts`

```typescript
import { useState, useCallback } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return { refreshing, onRefresh: handleRefresh };
}
```

## Utility Functions

### Create `lib/utils.ts`

```typescript
import { format, differenceInDays, differenceInHours } from 'date-fns';

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
    JPY: '¥',
  };
  return `${symbols[currency] || currency}${amount.toLocaleString()}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getTimeUntil(date: Date): string {
  const now = new Date();
  const days = differenceInDays(date, now);
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  return `${Math.floor(days / 30)} months`;
}

export function generateShareCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
```

## Zustand Store

### Create `stores/appStore.ts`

```typescript
import { create } from 'zustand';
import { Trip, User, ItineraryDay, Expense, ChatMessage } from '@/types';
import { 
  mockCurrentUser, 
  mockTrips, 
  mockItineraryDays, 
  mockExpenses,
  mockChatMessages 
} from '@/lib/mock-data';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Trips
  trips: Trip[];
  currentTripId: string | null;
  
  // Data
  itineraryDays: ItineraryDay[];
  expenses: Expense[];
  chatMessages: ChatMessage[];
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Trip actions
  setCurrentTrip: (tripId: string | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  
  // Expense actions
  addExpense: (expense: Expense) => void;
  
  // Chat actions
  addChatMessage: (message: ChatMessage) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  trips: mockTrips,
  currentTripId: null,
  itineraryDays: mockItineraryDays,
  expenses: mockExpenses,
  chatMessages: mockChatMessages,
  
  // Auth actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (email, password) => {
    // Mock login - in real app, call Firebase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ user: mockCurrentUser, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  // Trip actions
  setCurrentTrip: (tripId) => set({ currentTripId: tripId }),
  
  addTrip: (trip) => set((state) => ({
    trips: [...state.trips, trip],
  })),
  
  updateTrip: (tripId, updates) => set((state) => ({
    trips: state.trips.map((t) =>
      t.id === tripId ? { ...t, ...updates, updatedAt: new Date() } : t
    ),
  })),
  
  deleteTrip: (tripId) => set((state) => ({
    trips: state.trips.filter((t) => t.id !== tripId),
    itineraryDays: state.itineraryDays.filter((d) => d.tripId !== tripId),
    expenses: state.expenses.filter((e) => e.tripId !== tripId),
    chatMessages: state.chatMessages.filter((m) => m.tripId !== tripId),
  })),
  
  // Expense actions
  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, expense],
  })),
  
  // Chat actions
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),
}));

// Selectors
export const selectCurrentTrip = (state: AppState) =>
  state.trips.find((t) => t.id === state.currentTripId);

export const selectTripItinerary = (tripId: string) => (state: AppState) =>
  state.itineraryDays.filter((d) => d.tripId === tripId);

export const selectTripExpenses = (tripId: string) => (state: AppState) =>
  state.expenses.filter((e) => e.tripId === tripId);

export const selectTripChat = (tripId: string) => (state: AppState) =>
  state.chatMessages.filter((m) => m.tripId === tripId);
```

## App Configuration

### Create `app.json` updates

```json
{
  "expo": {
    "name": "TripCompanion",
    "slug": "trip-companion",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "tripcompanion",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6366F1"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.tripcompanion"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#6366F1"
      },
      "package": "com.yourcompany.tripcompanion"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow TripCompanion to access your photos for receipts"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```
