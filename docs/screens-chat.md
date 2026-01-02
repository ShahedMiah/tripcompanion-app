# Step 8: AI Chat Assistant Screen

## Chat Interface

### Create `app/trip/[id]/chat.tsx`

```tsx
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getTripById, getChatMessagesForTrip } from '@/lib/mock-data';
import { ChatMessage } from '@/types';
import * as Haptics from 'expo-haptics';

// Mock AI responses
const mockAIResponses = [
  "I'd recommend checking out the local markets in the morning when they're less crowded. The Medina comes alive around 9 AM!",
  "Based on your itinerary, you have some free time on Day 3 afternoon. Would you like me to suggest some activities?",
  "Great choice! I've noted that preference. Would you like me to find similar experiences for other days?",
  "The weather forecast shows potential rain on Day 4. I can suggest some indoor alternatives if you'd like.",
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(id);
  const existingMessages = getChatMessagesForTrip(id);
  
  const [messages, setMessages] = useState<ChatMessage[]>(existingMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      tripId: id,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        tripId: id,
        role: 'assistant',
        content: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  if (!trip) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
      keyboardVerticalOffset={180}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <WelcomeCard tripName={trip.name} destination={trip.destination.city} />
        )}

        {/* Chat Messages */}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <View className="px-4 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              '🗺️ Suggest activities',
              '🌤️ Check weather',
              '🍽️ Find restaurants',
              '🚕 Transport tips',
            ].map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => setInputText(suggestion.slice(3))}
                className="bg-white border border-gray-200 rounded-full px-4 py-2 mr-2"
              >
                <Text className="text-gray-700">{suggestion}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View className="bg-white border-t border-gray-100 px-4 py-3">
        <View className="flex-row items-end">
          <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 mr-2 min-h-[44px] max-h-[120px]">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your trip..."
              placeholderTextColor="#9CA3AF"
              multiline
              className="text-gray-900 text-base leading-5 py-1"
              style={{ maxHeight: 100 }}
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim()}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              inputText.trim() ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? 'white' : '#9CA3AF'}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function WelcomeCard({
  tripName,
  destination,
}: {
  tripName: string;
  destination: string;
}) {
  return (
    <View className="bg-white rounded-2xl p-6 mb-4 items-center">
      <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="sparkles" size={32} color="#6366F1" />
      </View>
      <Text className="text-xl font-bold text-gray-900 text-center">
        Hi! I'm your trip assistant
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        I can help you with your {tripName} to {destination}. Ask me about
        activities, restaurants, weather, or anything else!
      </Text>

      <View className="mt-6 w-full">
        <Text className="text-sm font-medium text-gray-700 mb-3">
          Try asking:
        </Text>
        {[
          'What are the best things to do on a rainy day?',
          'Find me a good restaurant near Jemaa el-Fnaa',
          'What should I pack for this trip?',
        ].map((example, index) => (
          <View
            key={index}
            className="bg-gray-50 rounded-xl p-3 mb-2 flex-row items-center"
          >
            <Ionicons name="chatbubble-outline" size={16} color="#6366F1" />
            <Text className="text-gray-600 ml-2 flex-1">{example}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <View
      className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-500 rounded-tr-sm'
            : 'bg-white rounded-tl-sm shadow-sm'
        }`}
      >
        <Text
          className={`text-base leading-relaxed ${
            isUser ? 'text-white' : 'text-gray-800'
          }`}
        >
          {message.content}
        </Text>
      </View>
      <Text className="text-xs text-gray-400 mt-1 mx-1">
        {format(message.timestamp, 'h:mm a')}
      </Text>
    </View>
  );
}

function TypingIndicator() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="items-start mb-4">
      <View className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse" />
          <View className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse" />
          <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        </View>
      </View>
    </View>
  );
}
```

## Trip Settings Screen

### Create `app/trip/[id]/settings.tsx`

```tsx
import { View, Text, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getTripById } from '@/lib/mock-data';
import { Card, Button, IconButton, Avatar } from '@/components/ui';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

export default function TripSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trip = getTripById(id);

  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  if (!trip) return null;

  const shareLink = `https://tripcompanion.app/shared/${trip.shareCode}`;

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
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100">
        <IconButton icon="arrow-back" onPress={() => router.back()} variant="ghost" />
        <Text className="flex-1 text-lg font-semibold text-gray-900 ml-2">
          Trip Settings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-6">
          {/* Trip Info */}
          <Card padding="lg" className="mb-4">
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-primary-100 rounded-2xl items-center justify-center">
                <Text className="text-2xl">✈️</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  {trip.name}
                </Text>
                <Text className="text-gray-500">
                  {trip.destination.city}, {trip.destination.country}
                </Text>
              </View>
              <IconButton icon="create-outline" onPress={() => {}} variant="ghost" />
            </View>
          </Card>

          {/* Sharing */}
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Sharing
          </Text>
          <Card padding="md" className="mb-6">
            <Text className="font-semibold text-gray-900 mb-2">Share Link</Text>
            <Text className="text-gray-500 text-sm mb-4">
              Anyone with this link can view your trip itinerary
            </Text>
            <View className="bg-gray-50 rounded-xl p-3 flex-row items-center">
              <Text className="flex-1 text-gray-600 text-sm" numberOfLines={1}>
                {shareLink}
              </Text>
              <Pressable
                onPress={handleCopyLink}
                className="ml-2 px-3 py-1.5 bg-primary-500 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">Copy</Text>
              </Pressable>
            </View>

            <View className="flex-row mt-4 pt-4 border-t border-gray-100">
              <Pressable className="flex-1 flex-row items-center justify-center py-2">
                <Ionicons name="mail-outline" size={20} color="#6366F1" />
                <Text className="text-primary-500 font-medium ml-2">Email</Text>
              </Pressable>
              <View className="w-px bg-gray-200" />
              <Pressable className="flex-1 flex-row items-center justify-center py-2">
                <Ionicons name="logo-whatsapp" size={20} color="#6366F1" />
                <Text className="text-primary-500 font-medium ml-2">WhatsApp</Text>
              </Pressable>
            </View>
          </Card>

          {/* Travelers */}
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Travelers ({trip.travelers.length})
          </Text>
          <Card padding="md" className="mb-6">
            {trip.travelers.map((traveler, index) => (
              <View
                key={traveler.id}
                className={`flex-row items-center py-3 ${
                  index < trip.travelers.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <Avatar
                  source={traveler.avatarUrl}
                  name={traveler.name}
                  size="md"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-900">{traveler.name}</Text>
                  <Text className="text-gray-500 text-sm">{traveler.email}</Text>
                </View>
                <View className="bg-gray-100 px-2 py-1 rounded-full">
                  <Text className="text-gray-600 text-xs capitalize">
                    {traveler.role}
                  </Text>
                </View>
              </View>
            ))}
            <Pressable className="flex-row items-center justify-center py-3 mt-2">
              <Ionicons name="person-add" size={20} color="#6366F1" />
              <Text className="text-primary-500 font-medium ml-2">
                Invite Traveler
              </Text>
            </Pressable>
          </Card>

          {/* Preferences */}
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Preferences
          </Text>
          <Card padding="none" className="mb-6">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
                  <Ionicons name="notifications" size={20} color="#6366F1" />
                </View>
                <View className="ml-3">
                  <Text className="font-medium text-gray-900">Notifications</Text>
                  <Text className="text-gray-500 text-sm">Reminders and updates</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                thumbColor={notifications ? '#6366F1' : '#9CA3AF'}
              />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="sync" size={20} color="#10B981" />
                </View>
                <View className="ml-3">
                  <Text className="font-medium text-gray-900">Auto-sync email</Text>
                  <Text className="text-gray-500 text-sm">Import bookings from Gmail</Text>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }}
                thumbColor={autoSync ? '#10B981' : '#9CA3AF'}
              />
            </View>
          </Card>

          {/* Danger Zone */}
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Danger Zone
          </Text>
          <Card padding="md">
            <Pressable
              onPress={handleDeleteTrip}
              className="flex-row items-center py-2"
            >
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                <Ionicons name="trash" size={20} color="#EF4444" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-medium text-red-600">Delete Trip</Text>
                <Text className="text-gray-500 text-sm">
                  Permanently delete this trip and all data
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```
