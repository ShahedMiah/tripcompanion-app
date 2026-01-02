export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  subscription: 'free' | 'pro';
  createdAt: Date;
}

export interface UserPreferences {
  activityTypes: ActivityType[];
  budgetTendency: 'budget' | 'moderate' | 'luxury';
  travelStyle: 'relaxed' | 'balanced' | 'packed';
}

export interface Trip {
  id: string;
  ownerId: string;
  name: string;
  destination: Destination;
  coverImage?: string;
  startDate: Date | null;
  endDate: Date | null;
  datesFlexible: boolean;
  budget: Budget | null;
  purpose: TripPurpose;
  travelers: Traveler[];
  hasFlights: boolean;
  hasHotels: boolean;
  status: TripStatus;
  shareCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TripStatus = 'planning' | 'booked' | 'active' | 'completed';
export type TripPurpose = 'romantic' | 'friends' | 'solo' | 'family' | 'work';

export interface Destination {
  city: string;
  country: string;
  countryCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timezone: string;
}

export interface Budget {
  amount: number;
  currency: string;
  type: 'total' | 'perDay' | 'perPerson';
}

export interface Traveler {
  id: string;
  userId: string | null;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: 'organizer' | 'editor' | 'viewer';
  departureCity?: string;
}

export interface ItineraryDay {
  id: string;
  tripId: string;
  date: Date;
  dayNumber: number;
  activities: Activity[];
  weather?: WeatherForecast;
  notes?: string;
}

export interface Activity {
  id: string;
  dayId: string;
  title: string;
  description?: string;
  type: ActivityType;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  location?: Location;
  bookingUrl?: string;
  bookingReference?: string;
  bookingStatus: BookingStatus;
  estimatedCost?: Money;
  notes?: string;
  alternatives?: Activity[];
  order: number;
}

export type ActivityType =
  | 'flight'
  | 'hotel'
  | 'activity'
  | 'restaurant'
  | 'transport'
  | 'other';

export type BookingStatus = 'suggested' | 'planned' | 'booked' | 'completed';

export interface Location {
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface WeatherForecast {
  date: Date;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  highTemp: number;
  lowTemp: number;
  precipitation: number;
  humidity: number;
}

export interface Expense {
  id: string;
  tripId: string;
  paidById: string;
  paidByName: string;
  amount: Money;
  description: string;
  category: ExpenseCategory;
  splitBetween: ExpenseSplit[];
  receiptUrl?: string;
  date: Date;
  createdAt: Date;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'activity'
  | 'accommodation'
  | 'shopping'
  | 'other';

export interface ExpenseSplit {
  travelerId: string;
  travelerName: string;
  amount: number;
  settled: boolean;
}

export interface ChatMessage {
  id: string;
  tripId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface OnboardingAnswer {
  question: string;
  answer: string | string[] | boolean | number;
}

export interface TripDraft {
  name?: string;
  destination?: Partial<Destination>;
  startDate?: Date;
  endDate?: Date;
  datesFlexible?: boolean;
  hasFlights?: boolean;
  hasHotels?: boolean;
  budget?: Partial<Budget>;
  purpose?: TripPurpose;
  travelers?: Partial<Traveler>[];
  activities?: string[];
}
