import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getTripById, getChatMessagesForTrip } from '@/lib/mock-data';
import { ChatMessage } from '@/types';
import * as Haptics from 'expo-haptics';

const mockAIResponses = [
  "I'd recommend checking out the local markets in the morning when they're less crowded. The Medina comes alive around 9 AM!",
  "Based on your itinerary, you have some free time on Day 3 afternoon. Would you like me to suggest some activities?",
  "Great choice! I've noted that preference. Would you like me to find similar experiences for other days?",
  "The weather forecast shows potential rain on Day 4. I can suggest some indoor alternatives if you'd like.",
  "That's a popular spot! I'd recommend booking ahead - here are a few options with good reviews and availability.",
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
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
      className="flex-1 bg-slate-50"
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
              { emoji: '🗺️', text: 'Suggest activities' },
              { emoji: '🌤️', text: 'Check weather' },
              { emoji: '🍽️', text: 'Find restaurants' },
              { emoji: '🚕', text: 'Transport tips' },
            ].map((suggestion) => (
              <Pressable
                key={suggestion.text}
                onPress={() => setInputText(suggestion.text)}
                className="bg-white border border-slate-200 rounded-full px-4 py-2.5 mr-2 flex-row items-center active:bg-slate-50"
              >
                <Text className="mr-1.5">{suggestion.emoji}</Text>
                <Text className="text-slate-700 font-medium">{suggestion.text}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View className="bg-white border-t border-slate-100 px-4 py-3">
        <View className="flex-row items-end">
          <View className="flex-1 bg-slate-100 rounded-2xl px-4 py-2.5 mr-2 min-h-[48px] max-h-[120px]">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your trip..."
              placeholderTextColor="#94A3B8"
              multiline
              className="text-slate-900 text-base leading-6"
              style={{ maxHeight: 100 }}
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim()}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() ? 'bg-primary-500 active:bg-primary-600' : 'bg-slate-200'
            }`}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? 'white' : '#94A3B8'}
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
    <View className="bg-white rounded-3xl p-6 mb-4 items-center shadow-soft">
      <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mb-4">
        <Ionicons name="sparkles" size={32} color="#0D9488" />
      </View>
      <Text className="text-xl font-bold text-slate-900 text-center">
        Hi! I'm your trip assistant
      </Text>
      <Text className="text-slate-500 text-center mt-2 leading-relaxed">
        I can help you with your {tripName} to {destination}. Ask me about
        activities, restaurants, weather, or anything else!
      </Text>

      <View className="mt-6 w-full">
        <Text className="text-sm font-semibold text-slate-700 mb-3">
          Try asking:
        </Text>
        {[
          'What are the best things to do on a rainy day?',
          'Find me a good restaurant near the main square',
          'What should I pack for this trip?',
        ].map((example, index) => (
          <View
            key={index}
            className="bg-slate-50 rounded-2xl p-4 mb-2 flex-row items-center"
          >
            <Ionicons name="chatbubble-outline" size={16} color="#0D9488" />
            <Text className="text-slate-600 ml-3 flex-1">{example}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <View className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && (
        <View className="flex-row items-center mb-2">
          <View className="w-6 h-6 bg-primary-500 rounded-lg items-center justify-center mr-2">
            <Ionicons name="sparkles" size={14} color="white" />
          </View>
          <Text className="text-slate-500 text-sm font-medium">Wayfare AI</Text>
        </View>
      )}
      <View
        className={`max-w-[85%] rounded-3xl px-5 py-3.5 ${
          isUser
            ? 'bg-primary-500 rounded-tr-lg'
            : 'bg-white rounded-tl-lg shadow-soft'
        }`}
      >
        <Text
          className={`text-base leading-relaxed ${
            isUser ? 'text-white' : 'text-slate-800'
          }`}
        >
          {message.content}
        </Text>
      </View>
      <Text className="text-xs text-slate-400 mt-1.5 mx-2">
        {format(message.timestamp, 'h:mm a')}
      </Text>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View className="items-start mb-4">
      <View className="flex-row items-center mb-2">
        <View className="w-6 h-6 bg-primary-500 rounded-lg items-center justify-center mr-2">
          <Ionicons name="sparkles" size={14} color="white" />
        </View>
        <Text className="text-slate-500 text-sm font-medium">Wayfare AI</Text>
      </View>
      <View className="bg-white rounded-3xl rounded-tl-lg px-5 py-4 shadow-soft">
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-slate-400 rounded-full mr-1.5 opacity-40" />
          <View className="w-2 h-2 bg-slate-400 rounded-full mr-1.5 opacity-60" />
          <View className="w-2 h-2 bg-slate-400 rounded-full opacity-80" />
        </View>
      </View>
    </View>
  );
}
