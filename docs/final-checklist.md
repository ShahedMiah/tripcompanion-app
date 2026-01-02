# Step 10: Implementation Checklist & Order

## Quick Start Commands

```bash
# 1. Create project
npx create-expo-app@latest trip-companion --template tabs
cd trip-companion

# 2. Install all dependencies
npx expo install nativewind tailwindcss react-native-reanimated react-native-gesture-handler react-native-safe-area-context expo-haptics expo-image-picker expo-linear-gradient expo-blur @react-native-community/datetimepicker

npm install zustand date-fns @gorhom/bottom-sheet expo-clipboard

# 3. Start development
npx expo start --clear
```

## Implementation Order

Follow this order to build the app incrementally with testable milestones:

### Phase 1: Foundation (Day 1)

- [ ] **1.1** Create project with Expo
- [ ] **1.2** Install dependencies
- [ ] **1.3** Configure NativeWind (tailwind.config.js, babel.config.js, metro.config.js, global.css)
- [ ] **1.4** Create nativewind-env.d.ts
- [ ] **1.5** Set up directory structure
- [ ] **1.6** Create types/index.ts
- [ ] **1.7** Create constants/theme.ts
- [ ] **1.8** Create lib/mock-data.ts
- [ ] **1.9** Test that app runs without errors

**Checkpoint:** App runs with default Expo template

### Phase 2: UI Components (Day 1-2)

- [ ] **2.1** Create components/ui/Button.tsx
- [ ] **2.2** Create components/ui/Input.tsx
- [ ] **2.3** Create components/ui/Card.tsx
- [ ] **2.4** Create components/ui/Badge.tsx
- [ ] **2.5** Create components/ui/Avatar.tsx
- [ ] **2.6** Create components/ui/IconButton.tsx
- [ ] **2.7** Create components/ui/EmptyState.tsx
- [ ] **2.8** Create components/ui/index.ts (barrel export)
- [ ] **2.9** Test components in isolation

**Checkpoint:** All UI components render correctly

### Phase 3: Navigation & Auth (Day 2)

- [ ] **3.1** Update app/_layout.tsx (root layout)
- [ ] **3.2** Create app/index.tsx (redirect)
- [ ] **3.3** Create app/(auth)/_layout.tsx
- [ ] **3.4** Create app/(auth)/welcome.tsx
- [ ] **3.5** Create app/(auth)/login.tsx
- [ ] **3.6** Create app/(auth)/register.tsx
- [ ] **3.7** Test auth flow navigation

**Checkpoint:** Can navigate through welcome → login → register

### Phase 4: Main Tabs (Day 2-3)

- [ ] **4.1** Create app/(tabs)/_layout.tsx
- [ ] **4.2** Create app/(tabs)/index.tsx (Home/Trip List)
- [ ] **4.3** Create app/(tabs)/explore.tsx
- [ ] **4.4** Create app/(tabs)/profile.tsx
- [ ] **4.5** Test tab navigation
- [ ] **4.6** Verify mock trips display on home

**Checkpoint:** Home screen shows mock trip cards, tabs work

### Phase 5: Trip Creation Wizard (Day 3)

- [ ] **5.1** Create app/trip/new/index.tsx
- [ ] **5.2** Create app/trip/new/onboarding.tsx
- [ ] **5.3** Install @react-native-community/datetimepicker if not done
- [ ] **5.4** Test full wizard flow
- [ ] **5.5** Verify navigation to trip detail after creation

**Checkpoint:** Can complete trip creation wizard

### Phase 6: Trip Detail Screens (Day 3-4)

- [ ] **6.1** Create app/trip/[id]/_layout.tsx
- [ ] **6.2** Create app/trip/[id]/index.tsx (Overview)
- [ ] **6.3** Create app/trip/[id]/itinerary.tsx
- [ ] **6.4** Create app/trip/[id]/expenses.tsx
- [ ] **6.5** Create app/trip/[id]/chat.tsx
- [ ] **6.6** Create app/trip/[id]/settings.tsx
- [ ] **6.7** Test all trip tabs
- [ ] **6.8** Verify mock data displays correctly

**Checkpoint:** Trip detail screens all working with mock data

### Phase 7: Activity Detail (Day 4)

- [ ] **7.1** Create app/activity/[activityId].tsx
- [ ] **7.2** Test navigation from itinerary to activity
- [ ] **7.3** Verify all activity data displays

**Checkpoint:** Activity detail screen complete

### Phase 8: Polish & Utilities (Day 4-5)

- [ ] **8.1** Create lib/utils.ts
- [ ] **8.2** Create stores/appStore.ts
- [ ] **8.3** Create components/ui/Skeleton.tsx
- [ ] **8.4** Create hooks/usePullToRefresh.ts
- [ ] **8.5** Add loading states where needed
- [ ] **8.6** Add haptic feedback to all interactions
- [ ] **8.7** Test on iOS simulator
- [ ] **8.8** Test on Android emulator

**Checkpoint:** App is polished and works on both platforms

---

## File Checklist

### Config Files
- [ ] tailwind.config.js
- [ ] babel.config.js
- [ ] metro.config.js
- [ ] global.css
- [ ] nativewind-env.d.ts
- [ ] app.json (updated)

### Core Files
- [ ] types/index.ts
- [ ] constants/theme.ts
- [ ] lib/mock-data.ts
- [ ] lib/utils.ts
- [ ] stores/appStore.ts

### UI Components (components/ui/)
- [ ] Button.tsx
- [ ] Input.tsx
- [ ] Card.tsx
- [ ] Badge.tsx
- [ ] Avatar.tsx
- [ ] IconButton.tsx
- [ ] EmptyState.tsx
- [ ] Skeleton.tsx
- [ ] index.ts

### App Screens
- [ ] app/_layout.tsx
- [ ] app/index.tsx
- [ ] app/(auth)/_layout.tsx
- [ ] app/(auth)/welcome.tsx
- [ ] app/(auth)/login.tsx
- [ ] app/(auth)/register.tsx
- [ ] app/(tabs)/_layout.tsx
- [ ] app/(tabs)/index.tsx
- [ ] app/(tabs)/explore.tsx
- [ ] app/(tabs)/profile.tsx
- [ ] app/trip/new/index.tsx
- [ ] app/trip/new/onboarding.tsx
- [ ] app/trip/[id]/_layout.tsx
- [ ] app/trip/[id]/index.tsx
- [ ] app/trip/[id]/itinerary.tsx
- [ ] app/trip/[id]/expenses.tsx
- [ ] app/trip/[id]/chat.tsx
- [ ] app/trip/[id]/settings.tsx
- [ ] app/activity/[activityId].tsx

### Hooks
- [ ] hooks/usePullToRefresh.ts

---

## Common Issues & Solutions

### NativeWind Not Working
```bash
# Clear caches
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

### Reanimated Errors
1. Make sure `react-native-reanimated/plugin` is LAST in babel plugins
2. Restart bundler after config changes

### TypeScript Errors
```bash
# Regenerate types
npx expo customize tsconfig.json
```

### Navigation Issues
- Check file naming matches expected routes
- Ensure all _layout.tsx files are present
- Check for typos in router.push() paths

### Styles Not Applying
- Check className syntax (no typos)
- Verify NativeWind is configured correctly
- Make sure global.css is imported in root layout

---

## Next Steps After Visual MVP

### Phase 2: Firebase Integration
1. Create Firebase project
2. Set up Authentication
3. Configure Firestore
4. Replace mock data with real queries
5. Add real-time sync

### Phase 3: AI Integration  
1. Set up Claude API
2. Create itinerary generation prompts
3. Implement chat functionality
4. Add smart suggestions

### Phase 4: Enhanced Features
1. Weather API integration
2. Receipt OCR (Google Vision)
3. Email parsing for bookings
4. Push notifications
5. Offline support

---

## Testing Checklist

### Screens to Test
- [ ] Welcome screen renders
- [ ] Login form works
- [ ] Register form works
- [ ] Home shows trip list
- [ ] Trip cards are tappable
- [ ] New trip wizard completes
- [ ] Trip overview displays data
- [ ] Itinerary days are selectable
- [ ] Activities are tappable
- [ ] Activity detail shows all info
- [ ] Expense list shows transactions
- [ ] Add expense modal works
- [ ] Chat sends/receives messages
- [ ] Settings page functions
- [ ] Share link copies
- [ ] Delete trip confirms

### Interactions to Test
- [ ] All buttons have haptic feedback
- [ ] Forms validate correctly
- [ ] Loading states appear
- [ ] Error states appear
- [ ] Pull to refresh works
- [ ] Keyboard dismisses properly
- [ ] Back navigation works
- [ ] Tab navigation works

### Platforms to Test
- [ ] iOS Simulator (iPhone 15)
- [ ] iOS Simulator (iPhone SE - small screen)
- [ ] Android Emulator (Pixel)
- [ ] Physical iOS device (if available)
- [ ] Physical Android device (if available)
