import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addDays } from 'date-fns';
import * as Haptics from 'expo-haptics';

/**
 * WAYFARE Onboarding Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Step-by-step trip configuration wizard.
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
    100: '#E0EBE4',
    500: '#4A7B5A',
    700: '#2D4739',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#D4A574',
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

type Step = 'dates' | 'bookings' | 'purpose' | 'budget' | 'travelers';

interface OnboardingData {
  startDate: Date | null;
  endDate: Date | null;
  datesFlexible: boolean;
  hasFlights: boolean | null;
  hasHotels: boolean | null;
  purpose: string | null;
  budget: { type: string } | null;
  travelerCount: number;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string;
    destination: string;
    city: string;
    country: string;
    countryCode: string;
  }>();

  const [step, setStep] = useState<Step>('dates');
  const [data, setData] = useState<OnboardingData>({
    startDate: null,
    endDate: null,
    datesFlexible: false,
    hasFlights: null,
    hasHotels: null,
    purpose: null,
    budget: null,
    travelerCount: 1,
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps: Step[] = ['dates', 'bookings', 'purpose', 'budget', 'travelers'];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    } else {
      router.back();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate AI processing
    setTimeout(() => {
      router.replace('/trip/trip-1');
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case 'dates':
        return data.startDate !== null || data.datesFlexible;
      case 'bookings':
        return data.hasFlights !== null && data.hasHotels !== null;
      case 'purpose':
        return data.purpose !== null;
      case 'budget':
        return true;
      case 'travelers':
        return data.travelerCount > 0;
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'dates':
        return 'When are you travelling?';
      case 'bookings':
        return "What's already booked?";
      case 'purpose':
        return "What's the occasion?";
      case 'budget':
        return "What's your budget?";
      case 'travelers':
        return 'Who is travelling?';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Header with Progress */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: COLORS.stone[100],
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.stone[700]} />
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 16, height: 6, backgroundColor: COLORS.stone[200], borderRadius: 3, overflow: 'hidden' }}>
            <View
              style={{
                height: '100%',
                backgroundColor: COLORS.terracotta[500],
                borderRadius: 3,
                width: `${progress}%`,
              }}
            />
          </View>
          <Text style={{ color: COLORS.stone[500], fontSize: 14, fontWeight: '500', width: 50, textAlign: 'right' }}>
            {currentIndex + 1}/{steps.length}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: COLORS.terracotta[500], fontWeight: '600' }}>
          {params.name}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        {/* Step Title */}
        <Text style={{
          fontSize: 26,
          fontWeight: '700',
          color: COLORS.ink[900],
          marginTop: 16,
          marginBottom: 32,
          letterSpacing: -0.3,
        }}>
          {getStepTitle()}
        </Text>

        {/* Dates Step */}
        {step === 'dates' && (
          <View>
            <Pressable
              onPress={() => setShowStartPicker(true)}
              style={({ pressed }) => ({
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
                borderWidth: 1,
                borderColor: COLORS.stone[200],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View style={{
                width: 48,
                height: 48,
                backgroundColor: COLORS.terracotta[50],
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="calendar" size={24} color={COLORS.terracotta[500]} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ fontSize: 13, color: COLORS.stone[500] }}>Start date</Text>
                <Text style={{ color: COLORS.ink[900], fontWeight: '600', fontSize: 17, marginTop: 2 }}>
                  {data.startDate
                    ? format(data.startDate, 'EEE, MMM d, yyyy')
                    : 'Select date'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.stone[500]} />
            </Pressable>

            <Pressable
              onPress={() => setShowEndPicker(true)}
              style={({ pressed }) => ({
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                borderWidth: 1,
                borderColor: COLORS.stone[200],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View style={{
                width: 48,
                height: 48,
                backgroundColor: COLORS.forest[50],
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.forest[500]} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ fontSize: 13, color: COLORS.stone[500] }}>End date</Text>
                <Text style={{ color: COLORS.ink[900], fontWeight: '600', fontSize: 17, marginTop: 2 }}>
                  {data.endDate
                    ? format(data.endDate, 'EEE, MMM d, yyyy')
                    : 'Select date'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.stone[500]} />
            </Pressable>

            <Pressable
              onPress={() => setData({ ...data, datesFlexible: !data.datesFlexible })}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}
            >
              <View style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: data.datesFlexible ? COLORS.terracotta[500] : COLORS.stone[300],
                backgroundColor: data.datesFlexible ? COLORS.terracotta[500] : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {data.datesFlexible && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={{ marginLeft: 12, color: COLORS.stone[700], fontSize: 16 }}>
                My dates are flexible
              </Text>
            </Pressable>

            {showStartPicker && (
              <DateTimePicker
                value={data.startDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={(_, date) => {
                  setShowStartPicker(false);
                  if (date) {
                    setData({
                      ...data,
                      startDate: date,
                      endDate: data.endDate && data.endDate < date ? null : data.endDate,
                    });
                  }
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={data.endDate || addDays(data.startDate || new Date(), 7)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={data.startDate || new Date()}
                onChange={(_, date) => {
                  setShowEndPicker(false);
                  if (date) setData({ ...data, endDate: date });
                }}
              />
            )}
          </View>
        )}

        {/* Bookings Step */}
        {step === 'bookings' && (
          <View>
            <BookingQuestion
              icon="airplane"
              iconBg={COLORS.terracotta[50]}
              iconColor={COLORS.terracotta[500]}
              title="Flights"
              question="Have you booked your flights?"
              value={data.hasFlights}
              onChange={(val) => setData({ ...data, hasFlights: val })}
            />
            <View style={{ height: 24 }} />
            <BookingQuestion
              icon="bed"
              iconBg={COLORS.forest[50]}
              iconColor={COLORS.forest[500]}
              title="Accommodation"
              question="Have you booked your stays?"
              value={data.hasHotels}
              onChange={(val) => setData({ ...data, hasHotels: val })}
            />
          </View>
        )}

        {/* Purpose Step */}
        {step === 'purpose' && (
          <View>
            {[
              { id: 'romantic', label: 'Romantic getaway', emoji: '💕' },
              { id: 'friends', label: 'Trip with friends', emoji: '🎉' },
              { id: 'solo', label: 'Solo adventure', emoji: '🎒' },
              { id: 'family', label: 'Family holiday', emoji: '👨‍👩‍👧‍👦' },
              { id: 'work', label: 'Business travel', emoji: '💼' },
            ].map((option) => (
              <Pressable
                key={option.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setData({ ...data, purpose: option.id });
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 18,
                  borderRadius: 20,
                  borderWidth: 2,
                  marginBottom: 12,
                  backgroundColor: data.purpose === option.id ? COLORS.terracotta[50] : '#FFFFFF',
                  borderColor: data.purpose === option.id ? COLORS.terracotta[500] : COLORS.stone[200],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ fontSize: 28, marginRight: 16 }}>{option.emoji}</Text>
                <Text style={{
                  flex: 1,
                  fontWeight: '600',
                  fontSize: 17,
                  color: data.purpose === option.id ? COLORS.terracotta[600] : COLORS.stone[700],
                }}>
                  {option.label}
                </Text>
                {data.purpose === option.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.terracotta[500]} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Budget Step */}
        {step === 'budget' && (
          <View>
            {[
              { id: 'budget', label: 'Budget-friendly', desc: 'Keep costs low', emoji: '💵' },
              { id: 'moderate', label: 'Moderate', desc: 'Balance comfort & value', emoji: '💳' },
              { id: 'luxury', label: 'Luxury', desc: 'Treat yourself', emoji: '💎' },
              { id: 'any', label: 'No preference', desc: 'Show me everything', emoji: '🌟' },
            ].map((option) => (
              <Pressable
                key={option.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setData({ ...data, budget: { type: option.id } });
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 18,
                  borderRadius: 20,
                  borderWidth: 2,
                  marginBottom: 12,
                  backgroundColor: data.budget?.type === option.id ? COLORS.terracotta[50] : '#FFFFFF',
                  borderColor: data.budget?.type === option.id ? COLORS.terracotta[500] : COLORS.stone[200],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ fontSize: 28, marginRight: 16 }}>{option.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontWeight: '600',
                    fontSize: 17,
                    color: data.budget?.type === option.id ? COLORS.terracotta[600] : COLORS.stone[700],
                  }}>
                    {option.label}
                  </Text>
                  <Text style={{ color: COLORS.stone[500], fontSize: 14, marginTop: 2 }}>
                    {option.desc}
                  </Text>
                </View>
                {data.budget?.type === option.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.terracotta[500]} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Travelers Step */}
        {step === 'travelers' && (
          <View>
            <Card variant="elevated" padding="lg">
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: COLORS.stone[700], fontWeight: '600', fontSize: 17 }}>
                  Number of travellers
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pressable
                    onPress={() => {
                      if (data.travelerCount > 1) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setData({ ...data, travelerCount: data.travelerCount - 1 });
                      }
                    }}
                    style={({ pressed }) => ({
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      borderWidth: 2,
                      borderColor: data.travelerCount <= 1 ? COLORS.stone[200] : COLORS.stone[300],
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed && data.travelerCount > 1 ? 0.8 : 1,
                    })}
                  >
                    <Ionicons
                      name="remove"
                      size={24}
                      color={data.travelerCount <= 1 ? COLORS.stone[300] : COLORS.stone[700]}
                    />
                  </Pressable>
                  <Text style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: COLORS.ink[900],
                    marginHorizontal: 24,
                    width: 40,
                    textAlign: 'center',
                  }}>
                    {data.travelerCount}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setData({ ...data, travelerCount: data.travelerCount + 1 });
                    }}
                    style={({ pressed }) => ({
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: COLORS.terracotta[500],
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </Pressable>
                </View>
              </View>
            </Card>

            <View style={{
              backgroundColor: COLORS.terracotta[50],
              borderRadius: 16,
              padding: 16,
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}>
              <Ionicons name="information-circle" size={20} color={COLORS.terracotta[500]} />
              <Text style={{ color: COLORS.terracotta[600], marginLeft: 12, flex: 1, fontSize: 14, lineHeight: 22 }}>
                You can invite other travellers to view and edit the trip later from the trip settings.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.stone[200],
        backgroundColor: '#FFFFFF',
      }}>
        <Pressable
          onPress={handleNext}
          disabled={!canProceed() || loading}
          style={({ pressed }) => ({
            backgroundColor: canProceed() && !loading ? COLORS.forest[700] : COLORS.stone[300],
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed && canProceed() && !loading ? 0.9 : 1,
          })}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={{
                color: canProceed() ? '#FFFFFF' : COLORS.stone[500],
                fontWeight: '600',
                fontSize: 16,
                marginRight: 8,
              }}>
                {currentIndex === steps.length - 1 ? 'Create Itinerary' : 'Continue'}
              </Text>
              <Ionicons
                name={currentIndex === steps.length - 1 ? 'sparkles' : 'arrow-forward'}
                size={20}
                color={canProceed() ? '#FFFFFF' : COLORS.stone[500]}
              />
            </>
          )}
        </Pressable>
        {currentIndex === steps.length - 1 && !loading && (
          <Text style={{ textAlign: 'center', color: COLORS.stone[500], fontSize: 13, marginTop: 12 }}>
            AI will generate your personalised itinerary
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function BookingQuestion({
  icon,
  iconBg,
  iconColor,
  title,
  question,
  value,
  onChange,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  question: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <Text style={{ fontWeight: '700', color: COLORS.ink[900], fontSize: 18 }}>{title}</Text>
      </View>
      <Text style={{ color: COLORS.stone[500], marginBottom: 16, fontSize: 15 }}>{question}</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(true);
          }}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 16,
            borderRadius: 16,
            borderWidth: 2,
            alignItems: 'center',
            backgroundColor: value === true ? COLORS.terracotta[50] : '#FFFFFF',
            borderColor: value === true ? COLORS.terracotta[500] : COLORS.stone[200],
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{
            fontWeight: '600',
            fontSize: 15,
            color: value === true ? COLORS.terracotta[600] : COLORS.stone[500],
          }}>
            Yes, booked
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(false);
          }}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 16,
            borderRadius: 16,
            borderWidth: 2,
            alignItems: 'center',
            backgroundColor: value === false ? COLORS.terracotta[50] : '#FFFFFF',
            borderColor: value === false ? COLORS.terracotta[500] : COLORS.stone[200],
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{
            fontWeight: '600',
            fontSize: 15,
            color: value === false ? COLORS.terracotta[600] : COLORS.stone[500],
          }}>
            Not yet
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
