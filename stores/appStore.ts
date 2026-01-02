import { create } from 'zustand';
import { Trip, User, ItineraryDay, Expense, ChatMessage } from '@/types';
import {
  mockCurrentUser,
  mockTrips,
  mockItineraryDays,
  mockExpenses,
  mockChatMessages,
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ user: mockCurrentUser, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Trip actions
  setCurrentTrip: (tripId) => set({ currentTripId: tripId }),

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),

  updateTrip: (tripId, updates) =>
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === tripId ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  deleteTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== tripId),
      itineraryDays: state.itineraryDays.filter((d) => d.tripId !== tripId),
      expenses: state.expenses.filter((e) => e.tripId !== tripId),
      chatMessages: state.chatMessages.filter((m) => m.tripId !== tripId),
    })),

  // Expense actions
  addExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, expense],
    })),

  // Chat actions
  addChatMessage: (message) =>
    set((state) => ({
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
