import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, IconButton, Card } from '@/components/ui';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addDays } from 'date-fns';
import * as Haptics from 'expo-haptics';

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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Progress */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between mb-4">
          <IconButton icon="arrow-back" onPress={handleBack} variant="ghost" />
          <View className="flex-1 mx-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-slate-400 text-sm font-medium w-12 text-right">
            {currentIndex + 1}/{steps.length}
          </Text>
        </View>
        <Text className="text-sm text-primary-600 font-medium">
          {params.name}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Step Title */}
        <Text className="text-2xl font-bold text-slate-900 mt-4 mb-8">
          {getStepTitle()}
        </Text>

        {/* Dates Step */}
        {step === 'dates' && (
          <View>
            <Pressable
              onPress={() => setShowStartPicker(true)}
              className="bg-slate-50 rounded-2xl p-4 flex-row items-center mb-3"
            >
              <View className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center">
                <Ionicons name="calendar" size={24} color="#0D9488" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-sm text-slate-500">Start date</Text>
                <Text className="text-slate-900 font-semibold text-lg">
                  {data.startDate
                    ? format(data.startDate, 'EEE, MMM d, yyyy')
                    : 'Select date'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </Pressable>

            <Pressable
              onPress={() => setShowEndPicker(true)}
              className="bg-slate-50 rounded-2xl p-4 flex-row items-center mb-6"
            >
              <View className="w-12 h-12 bg-coral-100 rounded-xl items-center justify-center">
                <Ionicons name="calendar-outline" size={24} color="#F06449" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-sm text-slate-500">End date</Text>
                <Text className="text-slate-900 font-semibold text-lg">
                  {data.endDate
                    ? format(data.endDate, 'EEE, MMM d, yyyy')
                    : 'Select date'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </Pressable>

            <Pressable
              onPress={() => setData({ ...data, datesFlexible: !data.datesFlexible })}
              className="flex-row items-center py-4"
            >
              <View
                className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
                  data.datesFlexible
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-slate-300'
                }`}
              >
                {data.datesFlexible && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text className="ml-3 text-slate-700 text-base">
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
              iconColor="#0891B2"
              title="Flights"
              question="Have you booked your flights?"
              value={data.hasFlights}
              onChange={(val) => setData({ ...data, hasFlights: val })}
            />
            <View className="h-6" />
            <BookingQuestion
              icon="bed"
              iconColor="#8B5CF6"
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
                className={`flex-row items-center p-4 rounded-2xl border-2 mb-3 ${
                  data.purpose === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text className="text-3xl mr-4">{option.emoji}</Text>
                <Text
                  className={`flex-1 font-semibold text-lg ${
                    data.purpose === option.id ? 'text-primary-700' : 'text-slate-700'
                  }`}
                >
                  {option.label}
                </Text>
                {data.purpose === option.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#0D9488" />
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
                className={`flex-row items-center p-4 rounded-2xl border-2 mb-3 ${
                  data.budget?.type === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text className="text-3xl mr-4">{option.emoji}</Text>
                <View className="flex-1">
                  <Text
                    className={`font-semibold text-lg ${
                      data.budget?.type === option.id ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-slate-500 text-sm">{option.desc}</Text>
                </View>
                {data.budget?.type === option.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#0D9488" />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Travelers Step */}
        {step === 'travelers' && (
          <View>
            <Card variant="filled" padding="lg">
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-700 font-semibold text-lg">
                  Number of travellers
                </Text>
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => {
                      if (data.travelerCount > 1) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setData({ ...data, travelerCount: data.travelerCount - 1 });
                      }
                    }}
                    className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                      data.travelerCount <= 1 ? 'border-slate-200' : 'border-slate-300'
                    }`}
                  >
                    <Ionicons
                      name="remove"
                      size={24}
                      color={data.travelerCount <= 1 ? '#CBD5E1' : '#334155'}
                    />
                  </Pressable>
                  <Text className="text-3xl font-bold text-slate-900 mx-6 w-10 text-center">
                    {data.travelerCount}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setData({ ...data, travelerCount: data.travelerCount + 1 });
                    }}
                    className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center"
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </Pressable>
                </View>
              </View>
            </Card>

            <View className="bg-primary-50 rounded-2xl p-4 mt-6 flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#0D9488" />
              <Text className="text-primary-700 ml-3 flex-1 text-sm leading-relaxed">
                You can invite other travellers to view and edit the trip later from the trip settings.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 py-4 border-t border-slate-100">
        <Button
          title={currentIndex === steps.length - 1 ? 'Create Itinerary' : 'Continue'}
          onPress={handleNext}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canProceed()}
          loading={loading}
          icon={
            currentIndex === steps.length - 1 ? (
              <Ionicons name="sparkles" size={20} color="white" />
            ) : (
              <Ionicons name="arrow-forward" size={20} color="white" />
            )
          }
          iconPosition="right"
        />
        {currentIndex === steps.length - 1 && (
          <Text className="text-center text-slate-400 text-sm mt-3">
            AI will generate your personalised itinerary
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function BookingQuestion({
  icon,
  iconColor,
  title,
  question,
  value,
  onChange,
}: {
  icon: string;
  iconColor: string;
  title: string;
  question: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <View>
      <View className="flex-row items-center mb-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <Text className="font-bold text-slate-900 text-lg">{title}</Text>
      </View>
      <Text className="text-slate-600 mb-4">{question}</Text>
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(true);
          }}
          className={`flex-1 py-4 rounded-2xl border-2 items-center ${
            value === true ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
          }`}
        >
          <Text
            className={`font-semibold ${
              value === true ? 'text-primary-700' : 'text-slate-600'
            }`}
          >
            Yes, booked
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(false);
          }}
          className={`flex-1 py-4 rounded-2xl border-2 items-center ${
            value === false ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
          }`}
        >
          <Text
            className={`font-semibold ${
              value === false ? 'text-primary-700' : 'text-slate-600'
            }`}
          >
            Not yet
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
