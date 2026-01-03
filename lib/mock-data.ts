import {
  User,
  Trip,
  ItineraryDay,
  Activity,
  Expense,
  ChatMessage,
  Traveler,
} from '@/types';

// Current user
export const mockCurrentUser: User = {
  id: 'user-1',
  email: 'alex@example.com',
  displayName: 'Alex Thompson',
  avatarUrl: 'https://i.pravatar.cc/150?img=33',
  preferences: {
    activityTypes: ['activity', 'restaurant', 'transport'],
    budgetTendency: 'moderate',
    travelStyle: 'balanced',
  },
  subscription: 'pro',
  createdAt: new Date('2024-01-15'),
};

// Sample travelers
export const mockTravelers: Traveler[] = [
  {
    id: 'traveler-1',
    userId: 'user-1',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    role: 'organizer',
    departureCity: 'London',
  },
  {
    id: 'traveler-2',
    userId: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    role: 'editor',
    departureCity: 'London',
  },
  {
    id: 'traveler-3',
    userId: null,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'viewer',
    departureCity: 'Manchester',
  },
  {
    id: 'traveler-4',
    userId: null,
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
    role: 'viewer',
    departureCity: 'London',
  },
];

// Sample trips
export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    ownerId: 'user-1',
    name: 'Marrakesh Adventure',
    destination: {
      city: 'Marrakesh',
      country: 'Morocco',
      countryCode: 'MA',
      coordinates: { lat: 31.6295, lng: -7.9811 },
      timezone: 'Africa/Casablanca',
    },
    coverImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800',
    startDate: new Date('2026-03-15'),
    endDate: new Date('2026-03-22'),
    datesFlexible: false,
    budget: { amount: 2000, currency: 'GBP', type: 'total' },
    purpose: 'friends',
    travelers: mockTravelers.slice(0, 4),
    hasFlights: true,
    hasHotels: true,
    status: 'booked',
    shareCode: 'mrk2026',
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: 'trip-2',
    ownerId: 'user-1',
    name: 'Tokyo Spring',
    destination: {
      city: 'Tokyo',
      country: 'Japan',
      countryCode: 'JP',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      timezone: 'Asia/Tokyo',
    },
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-04-10'),
    datesFlexible: true,
    budget: { amount: 150, currency: 'GBP', type: 'perDay' },
    purpose: 'romantic',
    travelers: mockTravelers.slice(0, 2),
    hasFlights: false,
    hasHotels: false,
    status: 'planning',
    shareCode: 'tky2026',
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2025-12-18'),
  },
  {
    id: 'trip-3',
    ownerId: 'user-1',
    name: 'Barcelona Weekend',
    destination: {
      city: 'Barcelona',
      country: 'Spain',
      countryCode: 'ES',
      coordinates: { lat: 41.3874, lng: 2.1686 },
      timezone: 'Europe/Madrid',
    },
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    startDate: new Date('2025-11-15'),
    endDate: new Date('2025-11-18'),
    datesFlexible: false,
    budget: { amount: 800, currency: 'GBP', type: 'total' },
    purpose: 'solo',
    travelers: [mockTravelers[0]],
    hasFlights: true,
    hasHotels: true,
    status: 'completed',
    shareCode: 'bcn2025',
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-11-20'),
  },
];

// Marrakesh trip itinerary
export const mockItineraryDays: ItineraryDay[] = [
  {
    id: 'day-1',
    tripId: 'trip-1',
    date: new Date('2026-03-15'),
    dayNumber: 1,
    weather: {
      date: new Date('2026-03-15'),
      condition: 'sunny',
      highTemp: 24,
      lowTemp: 12,
      precipitation: 0,
      humidity: 45,
    },
    activities: [
      {
        id: 'act-1',
        dayId: 'day-1',
        title: 'Flight to Marrakesh',
        description: 'Direct flight from London Gatwick',
        type: 'flight',
        startTime: new Date('2026-03-15T06:30:00'),
        endTime: new Date('2026-03-15T10:45:00'),
        duration: 195,
        location: { name: 'Marrakesh Menara Airport', address: 'RAK' },
        bookingUrl: 'https://skyscanner.com',
        bookingReference: 'BA2847',
        bookingStatus: 'booked',
        estimatedCost: { amount: 180, currency: 'GBP' },
        order: 1,
      },
      {
        id: 'act-2',
        dayId: 'day-1',
        title: 'Check-in: Riad Yasmine',
        description: 'Beautiful riad in the heart of the Medina with rooftop pool',
        type: 'hotel',
        startTime: new Date('2026-03-15T14:00:00'),
        location: {
          name: 'Riad Yasmine',
          address: '12 Derb Sidi Ali Tair, Medina',
        },
        bookingUrl: 'https://booking.com',
        bookingReference: 'BK789456',
        bookingStatus: 'booked',
        estimatedCost: { amount: 120, currency: 'GBP' },
        notes: 'Early check-in requested',
        order: 2,
      },
      {
        id: 'act-3',
        dayId: 'day-1',
        title: 'Explore Jemaa el-Fnaa',
        description: 'Main square and marketplace - watch snake charmers, get henna, enjoy street food',
        type: 'activity',
        startTime: new Date('2026-03-15T17:00:00'),
        duration: 180,
        location: {
          name: 'Jemaa el-Fnaa',
          address: 'Jemaa el-Fnaa, Marrakech',
        },
        bookingStatus: 'planned',
        order: 3,
      },
      {
        id: 'act-4',
        dayId: 'day-1',
        title: 'Dinner at Nomad',
        description: 'Modern Moroccan cuisine with terrace views',
        type: 'restaurant',
        startTime: new Date('2026-03-15T20:00:00'),
        duration: 90,
        location: {
          name: 'Nomad',
          address: '1 Derb Aarjan, Medina',
        },
        bookingUrl: 'https://nomadmarrakech.com',
        bookingStatus: 'booked',
        estimatedCost: { amount: 35, currency: 'GBP' },
        order: 4,
      },
    ],
    notes: 'Arrival day - take it easy, acclimate to the medina',
  },
  {
    id: 'day-2',
    tripId: 'trip-1',
    date: new Date('2026-03-16'),
    dayNumber: 2,
    weather: {
      date: new Date('2026-03-16'),
      condition: 'sunny',
      highTemp: 26,
      lowTemp: 14,
      precipitation: 5,
      humidity: 40,
    },
    activities: [
      {
        id: 'act-5',
        dayId: 'day-2',
        title: 'Hot Air Balloon Ride',
        description: 'Sunrise balloon ride over the Atlas Mountains and Agafay Desert',
        type: 'activity',
        startTime: new Date('2026-03-16T05:30:00'),
        duration: 240,
        location: { name: 'Agafay Desert' },
        bookingUrl: 'https://viator.com',
        bookingReference: 'VIA456',
        bookingStatus: 'booked',
        estimatedCost: { amount: 150, currency: 'GBP' },
        alternatives: [
          {
            id: 'act-5-alt',
            dayId: 'day-2',
            title: 'Quad Biking in Palmeraie',
            description: 'Alternative if balloon is cancelled due to weather',
            type: 'activity',
            duration: 120,
            bookingStatus: 'suggested',
            estimatedCost: { amount: 45, currency: 'GBP' },
            order: 0,
          },
        ],
        order: 1,
      },
      {
        id: 'act-6',
        dayId: 'day-2',
        title: 'Bahia Palace',
        description: '19th century palace with stunning architecture and gardens',
        type: 'activity',
        startTime: new Date('2026-03-16T14:00:00'),
        duration: 90,
        location: {
          name: 'Bahia Palace',
          address: 'Rue Riad Zitoun el Jdid',
        },
        bookingStatus: 'planned',
        estimatedCost: { amount: 7, currency: 'GBP' },
        order: 2,
      },
      {
        id: 'act-7',
        dayId: 'day-2',
        title: 'Moroccan Cooking Class',
        description: 'Learn to make tagine, couscous, and mint tea',
        type: 'activity',
        startTime: new Date('2026-03-16T17:00:00'),
        duration: 180,
        location: { name: 'La Maison Arabe' },
        bookingUrl: 'https://lamaisonarabe.com',
        bookingStatus: 'booked',
        estimatedCost: { amount: 65, currency: 'GBP' },
        notes: 'Includes dinner!',
        order: 3,
      },
    ],
  },
  {
    id: 'day-3',
    tripId: 'trip-1',
    date: new Date('2026-03-17'),
    dayNumber: 3,
    weather: {
      date: new Date('2026-03-17'),
      condition: 'cloudy',
      highTemp: 22,
      lowTemp: 13,
      precipitation: 20,
      humidity: 55,
    },
    activities: [
      {
        id: 'act-8',
        dayId: 'day-3',
        title: 'Day Trip: Atlas Mountains',
        description: 'Visit Berber villages, waterfalls, and enjoy lunch with mountain views',
        type: 'activity',
        startTime: new Date('2026-03-17T08:00:00'),
        duration: 540,
        bookingUrl: 'https://getyourguide.com',
        bookingStatus: 'booked',
        estimatedCost: { amount: 45, currency: 'GBP' },
        notes: 'Includes transport, guide, and lunch',
        order: 1,
      },
      {
        id: 'act-9',
        dayId: 'day-3',
        title: 'Drinks at Barometre',
        description: 'Rooftop bar with great cocktails',
        type: 'restaurant',
        startTime: new Date('2026-03-17T20:00:00'),
        duration: 120,
        location: { name: 'Barometre', address: 'Rue Moulay Ali, Gueliz' },
        bookingStatus: 'suggested',
        estimatedCost: { amount: 25, currency: 'GBP' },
        order: 2,
      },
    ],
  },
];

// Expenses
export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    tripId: 'trip-1',
    paidById: 'traveler-1',
    paidByName: 'Alex Thompson',
    amount: { amount: 720, currency: 'GBP' },
    description: 'Group flights (4 people)',
    category: 'transport',
    splitBetween: [
      { travelerId: 'traveler-1', travelerName: 'Alex', amount: 180, settled: true },
      { travelerId: 'traveler-2', travelerName: 'Sarah', amount: 180, settled: true },
      { travelerId: 'traveler-3', travelerName: 'Mike', amount: 180, settled: false },
      { travelerId: 'traveler-4', travelerName: 'Emma', amount: 180, settled: false },
    ],
    date: new Date('2024-12-01'),
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'exp-2',
    tripId: 'trip-1',
    paidById: 'traveler-2',
    paidByName: 'Sarah Chen',
    amount: { amount: 480, currency: 'GBP' },
    description: 'Riad Yasmine (4 nights)',
    category: 'accommodation',
    splitBetween: [
      { travelerId: 'traveler-1', travelerName: 'Alex', amount: 120, settled: false },
      { travelerId: 'traveler-2', travelerName: 'Sarah', amount: 120, settled: true },
      { travelerId: 'traveler-3', travelerName: 'Mike', amount: 120, settled: false },
      { travelerId: 'traveler-4', travelerName: 'Emma', amount: 120, settled: true },
    ],
    date: new Date('2024-12-05'),
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'exp-3',
    tripId: 'trip-1',
    paidById: 'traveler-1',
    paidByName: 'Alex Thompson',
    amount: { amount: 600, currency: 'GBP' },
    description: 'Hot Air Balloon (4 tickets)',
    category: 'activity',
    splitBetween: [
      { travelerId: 'traveler-1', travelerName: 'Alex', amount: 150, settled: true },
      { travelerId: 'traveler-2', travelerName: 'Sarah', amount: 150, settled: false },
      { travelerId: 'traveler-3', travelerName: 'Mike', amount: 150, settled: false },
      { travelerId: 'traveler-4', travelerName: 'Emma', amount: 150, settled: false },
    ],
    date: new Date('2024-12-10'),
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'exp-4',
    tripId: 'trip-1',
    paidById: 'traveler-3',
    paidByName: 'Mike Johnson',
    amount: { amount: 140, currency: 'GBP' },
    description: 'Dinner at Nomad',
    category: 'food',
    splitBetween: [
      { travelerId: 'traveler-1', travelerName: 'Alex', amount: 35, settled: false },
      { travelerId: 'traveler-2', travelerName: 'Sarah', amount: 35, settled: false },
      { travelerId: 'traveler-3', travelerName: 'Mike', amount: 35, settled: true },
      { travelerId: 'traveler-4', travelerName: 'Emma', amount: 35, settled: false },
    ],
    date: new Date('2026-03-15'),
    createdAt: new Date('2026-03-15'),
  },
];

// Chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    tripId: 'trip-1',
    role: 'user',
    content: 'What are some good backup activities if the hot air balloon gets cancelled?',
    timestamp: new Date('2024-12-18T10:30:00'),
  },
  {
    id: 'msg-2',
    tripId: 'trip-1',
    role: 'assistant',
    content: `Great question! Here are some alternatives if the balloon ride is cancelled due to weather:

**Morning alternatives:**
• Quad biking in the Palmeraie (palm groves) - about £45/person, 2 hours
• Camel ride at sunrise in the Agafay Desert - £30/person
• Early visit to Majorelle Garden before crowds - £12 entry

**If it's rainy:**
• Visit the Marrakech Museum
• Explore the covered souks (they're sheltered!)
• Book a traditional hammam spa experience - £40-60

Would you like me to add any of these as backup activities to your itinerary?`,
    timestamp: new Date('2024-12-18T10:30:30'),
  },
  {
    id: 'msg-3',
    tripId: 'trip-1',
    role: 'user',
    content: 'Add the quad biking as a backup please',
    timestamp: new Date('2024-12-18T10:32:00'),
  },
  {
    id: 'msg-4',
    tripId: 'trip-1',
    role: 'assistant',
    content: `Done! I've added "Quad Biking in Palmeraie" as an alternative activity for Day 2.

If you need to switch, you can find it in the alternatives section of the Hot Air Balloon activity. The quad biking tour includes:
• Hotel pickup at 6:00 AM
• 2-hour desert and palm grove ride
• Berber tea break
• Return by 9:00 AM

This gives you plenty of time to continue with the rest of your Day 2 plans!`,
    timestamp: new Date('2024-12-18T10:32:30'),
  },
];

// Helper functions
export const getTripById = (id: string): Trip | undefined => {
  return mockTrips.find((trip) => trip.id === id);
};

export const getItineraryForTrip = (tripId: string): ItineraryDay[] => {
  return mockItineraryDays.filter((day) => day.tripId === tripId);
};

export const getExpensesForTrip = (tripId: string): Expense[] => {
  return mockExpenses.filter((expense) => expense.tripId === tripId);
};

export const getChatMessagesForTrip = (tripId: string): ChatMessage[] => {
  return mockChatMessages.filter((msg) => msg.tripId === tripId);
};

// Calculate expense balances
export const calculateBalances = (expenses: Expense[]): Record<string, number> => {
  const balances: Record<string, number> = {};

  expenses.forEach((expense) => {
    // Payer gets credit
    if (!balances[expense.paidByName]) balances[expense.paidByName] = 0;
    balances[expense.paidByName] += expense.amount.amount;

    // Everyone owes their split
    expense.splitBetween.forEach((split) => {
      if (!balances[split.travelerName]) balances[split.travelerName] = 0;
      balances[split.travelerName] -= split.amount;
    });
  });

  return balances;
};
