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
import { Card } from '@/components/ui';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Chat/Assistant Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * AI-powered trip assistant with conversational interface.
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
  stone: {
    100: '#F5F3F0',
    200: '#E8E4DE',
    300: '#D5CFC6',
    500: '#968B7D',
    700: '#5C5147',
  },
  ink: {
    900: '#1A1A1A',
  },
};

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
      style={{ flex: 1, backgroundColor: COLORS.cream }}
      keyboardVerticalOffset={90}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
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
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
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
                style={({ pressed }) => ({
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: COLORS.stone[200],
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  marginRight: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ marginRight: 6 }}>{suggestion.emoji}</Text>
                <Text style={{ color: COLORS.ink[900], fontWeight: '500', fontSize: 14 }}>
                  {suggestion.text}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={{
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: COLORS.stone[200],
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your trip..."
            placeholderTextColor={COLORS.stone[500]}
            multiline
            style={{
              flex: 1,
              backgroundColor: COLORS.stone[100],
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
              color: COLORS.ink[900],
              fontSize: 16,
              lineHeight: 22,
              maxHeight: 100,
              minHeight: 44,
            }}
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="send"
              size={24}
              color={inputText.trim() ? COLORS.terracotta[500] : COLORS.stone[300]}
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
    <Card variant="outlined" padding="lg" style={{ marginBottom: 16 }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{
          width: 64,
          height: 64,
          backgroundColor: COLORS.terracotta[100],
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Ionicons name="sparkles" size={32} color={COLORS.terracotta[500]} />
        </View>
        <Text style={{
          fontSize: 22,
          fontWeight: '700',
          color: COLORS.ink[900],
          textAlign: 'center',
          letterSpacing: -0.3,
        }}>
          Hi! I'm your trip assistant
        </Text>
        <Text style={{
          color: COLORS.stone[500],
          textAlign: 'center',
          marginTop: 8,
          lineHeight: 22,
          fontSize: 15,
        }}>
          I can help you with your {tripName} to {destination}. Ask me about
          activities, restaurants, weather, or anything else!
        </Text>

        <View style={{ marginTop: 24, width: '100%' }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: COLORS.ink[900],
            marginBottom: 12,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}>
            Try asking:
          </Text>
          {[
            'What are the best things to do on a rainy day?',
            'Find me a good restaurant near the main square',
            'What should I pack for this trip?',
          ].map((example, index) => (
            <View
              key={index}
              style={{
                backgroundColor: COLORS.stone[100],
                borderRadius: 14,
                padding: 14,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="chatbubble-outline" size={16} color={COLORS.terracotta[500]} />
              <Text style={{ color: COLORS.stone[700], marginLeft: 12, flex: 1, fontSize: 14 }}>
                {example}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <View style={{ marginBottom: 16, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{
            width: 28,
            height: 28,
            backgroundColor: COLORS.terracotta[500],
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}>
            <Ionicons name="sparkles" size={14} color="white" />
          </View>
          <Text style={{ color: COLORS.stone[500], fontSize: 13, fontWeight: '500' }}>Wayfare AI</Text>
        </View>
      )}
      <View
        style={{
          maxWidth: '85%',
          borderRadius: 20,
          paddingHorizontal: 18,
          paddingVertical: 14,
          backgroundColor: isUser ? COLORS.terracotta[500] : '#FFFFFF',
          borderTopRightRadius: isUser ? 8 : 20,
          borderTopLeftRadius: isUser ? 20 : 8,
          shadowColor: '#1A1714',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isUser ? 0 : 0.06,
          shadowRadius: 8,
          elevation: isUser ? 0 : 2,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            color: isUser ? '#FFFFFF' : COLORS.ink[900],
          }}
        >
          {message.content}
        </Text>
      </View>
      <Text style={{ fontSize: 11, color: COLORS.stone[500], marginTop: 6, marginHorizontal: 8 }}>
        {format(message.timestamp, 'h:mm a')}
      </Text>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View style={{
          width: 28,
          height: 28,
          backgroundColor: COLORS.terracotta[500],
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
        }}>
          <Ionicons name="sparkles" size={14} color="white" />
        </View>
        <Text style={{ color: COLORS.stone[500], fontSize: 13, fontWeight: '500' }}>Wayfare AI</Text>
      </View>
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderTopLeftRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 16,
        shadowColor: '#1A1714',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 8, height: 8, backgroundColor: COLORS.stone[300], borderRadius: 4, marginRight: 6, opacity: 0.4 }} />
          <View style={{ width: 8, height: 8, backgroundColor: COLORS.stone[300], borderRadius: 4, marginRight: 6, opacity: 0.6 }} />
          <View style={{ width: 8, height: 8, backgroundColor: COLORS.stone[300], borderRadius: 4, opacity: 0.8 }} />
        </View>
      </View>
    </View>
  );
}
