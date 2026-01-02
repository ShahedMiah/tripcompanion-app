# TripCompanion - Project Overview

## What We're Building

A React Native travel companion app that helps users plan trips, organize itineraries, share with friends, and track expenses. Think of it as "your travel itinerary in your pocket."

## Tech Stack

- **Framework:** React Native with Expo (SDK 52+)
- **Navigation:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind CSS for RN)
- **State:** Zustand + React Query
- **Backend:** Firebase (Auth, Firestore, Storage) - MOCK DATA FIRST
- **AI:** Claude API - MOCK RESPONSES FIRST

## Development Phases

### Phase 0: Current Focus - Visual MVP with Mock Data
Build all screens and interactions using hardcoded mock data. No backend integration yet.

### Phase 1: Firebase Integration
Replace mock data with real Firestore operations.

### Phase 2: AI Integration
Add Claude API for itinerary generation and chat.

## Core User Flows

### Flow 1: Create a Trip
1. Tap "New Trip" on home screen
2. Enter trip name and destination
3. Answer onboarding questions (dates, budget, purpose, etc.)
4. AI generates initial itinerary (mock for now)
5. Review and customize itinerary
6. Trip created and visible on home

### Flow 2: View/Edit Itinerary
1. Tap trip card on home screen
2. See trip overview with key info
3. Navigate to day-by-day itinerary
4. Tap activity to view details
5. Edit, reorder, or delete activities
6. Add new activities manually or via AI

### Flow 3: Share Trip
1. Open trip settings
2. Tap "Share Trip"
3. Copy shareable link
4. Recipients can view without account

### Flow 4: Track Expenses
1. Navigate to Expenses tab within trip
2. Add expense (manual or scan receipt)
3. Select who paid and split method
4. View running totals and balances
5. Mark expenses as settled

### Flow 5: AI Chat Assistant
1. Open chat within a trip
2. Ask questions about the trip/destination
3. Request itinerary modifications
4. Get recommendations

## File Structure Goal

```
/trip-companion
├── app/
│   ├── _layout.tsx                 # Root layout
│   ├── index.tsx                   # Redirect to tabs
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx             # Welcome/landing
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Home - trip list
│   │   ├── explore.tsx             # Discover (future)
│   │   └── profile.tsx             # Settings/profile
│   ├── trip/
│   │   ├── new/
│   │   │   ├── index.tsx           # Start wizard
│   │   │   └── onboarding.tsx      # Questions flow
│   │   └── [id]/
│   │       ├── _layout.tsx         # Trip tabs layout
│   │       ├── index.tsx           # Trip overview
│   │       ├── itinerary.tsx       # Day-by-day
│   │       ├── expenses.tsx        # Expense tracker
│   │       ├── chat.tsx            # AI assistant
│   │       └── settings.tsx        # Trip settings
│   └── activity/
│       └── [activityId].tsx        # Activity detail
├── components/
│   ├── ui/                         # Base components
│   ├── trips/                      # Trip-related
│   ├── itinerary/                  # Itinerary components
│   ├── expenses/                   # Expense components
│   └── chat/                       # Chat components
├── lib/
│   ├── mock-data.ts                # All mock data
│   └── utils.ts                    # Helpers
├── stores/
│   └── appStore.ts                 # Zustand store
├── types/
│   └── index.ts                    # TypeScript types
└── constants/
    └── theme.ts                    # Design tokens
```

## Design Principles

1. **Mobile-first:** Thumb-friendly tap targets, bottom navigation
2. **Progressive disclosure:** Don't overwhelm, reveal complexity gradually  
3. **Delightful interactions:** Smooth animations, haptic feedback
4. **Clear hierarchy:** Important info visible at a glance
5. **Consistent patterns:** Same gestures/interactions throughout

## Key Screens to Build

1. ✅ Welcome/Auth screens
2. ✅ Home (trip list)
3. ✅ New trip wizard
4. ✅ Trip overview
5. ✅ Itinerary (day view)
6. ✅ Activity detail sheet
7. ✅ Expenses list + add expense
8. ✅ AI Chat
9. ✅ Profile/settings

## Success Criteria for Visual MVP

- [ ] All screens render without errors
- [ ] Navigation works between all screens
- [ ] Mock data displays correctly
- [ ] Interactions feel smooth (animations)
- [ ] App looks polished and professional
- [ ] Works on both iOS and Android
