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

- [x] **1.1** Create project with Expo
- [x] **1.2** Install dependencies
- [x] **1.3** Configure NativeWind (tailwind.config.js, babel.config.js, metro.config.js, global.css)
- [x] **1.4** Create nativewind-env.d.ts
- [x] **1.5** Set up directory structure
- [x] **1.6** Create types/index.ts
- [x] **1.7** Create constants/theme.ts
- [x] **1.8** Create lib/mock-data.ts
- [x] **1.9** Test that app runs without errors

**Checkpoint:** App runs with default Expo template ✅

### Phase 2: UI Components (Day 1-2)

- [x] **2.1** Create components/ui/Button.tsx
- [x] **2.2** Create components/ui/Input.tsx
- [x] **2.3** Create components/ui/Card.tsx
- [x] **2.4** Create components/ui/Badge.tsx
- [x] **2.5** Create components/ui/Avatar.tsx
- [x] **2.6** Create components/ui/IconButton.tsx
- [x] **2.7** Create components/ui/EmptyState.tsx
- [x] **2.8** Create components/ui/index.ts (barrel export)
- [x] **2.9** Test components in isolation

**Checkpoint:** All UI components render correctly ✅

### Phase 3: Navigation & Auth (Day 2)

- [x] **3.1** Update app/_layout.tsx (root layout)
- [x] **3.2** Create app/index.tsx (redirect) — implemented via app/(auth)/index.tsx
- [x] **3.3** Create app/(auth)/_layout.tsx
- [ ] **3.4** Create app/(auth)/welcome.tsx — **NOT IMPLEMENTED** (auth flow uses index.tsx redirect instead)
- [x] **3.5** Create app/(auth)/login.tsx
- [x] **3.6** Create app/(auth)/register.tsx
- [x] **3.7** Test auth flow navigation

**Checkpoint:** Can navigate through login ↔ register ✅ (welcome screen not present)

### Phase 4: Main Tabs (Day 2-3)

- [x] **4.1** Create app/(tabs)/_layout.tsx
- [x] **4.2** Create app/(tabs)/index.tsx (Home/Trip List)
- [x] **4.3** Create app/(tabs)/explore.tsx
- [x] **4.4** Create app/(tabs)/profile.tsx
- [x] **4.5** Test tab navigation
- [x] **4.6** Verify mock trips display on home

**Checkpoint:** Home screen shows mock trip cards, tabs work ✅

### Phase 5: Trip Creation Wizard (Day 3)

- [x] **5.1** Create app/trip/new/index.tsx
- [x] **5.2** Create app/trip/new/onboarding.tsx
- [x] **5.3** Install @react-native-community/datetimepicker if not done
- [x] **5.4** Test full wizard flow
- [x] **5.5** Verify navigation to trip detail after creation

**Checkpoint:** Can complete trip creation wizard ✅

### Phase 6: Trip Detail Screens (Day 3-4)

- [x] **6.1** Create app/trip/[id]/_layout.tsx
- [x] **6.2** Create app/trip/[id]/index.tsx (Overview)
- [x] **6.3** Create app/trip/[id]/itinerary.tsx
- [x] **6.4** Create app/trip/[id]/expenses.tsx
- [x] **6.5** Create app/trip/[id]/chat.tsx
- [x] **6.6** Create app/trip/[id]/settings.tsx
- [x] **6.7** Test all trip tabs
- [x] **6.8** Verify mock data displays correctly

**Checkpoint:** Trip detail screens all working with mock data ✅

### Phase 7: Activity Detail (Day 4)

- [x] **7.1** Create app/activity/[activityId].tsx
- [x] **7.2** Test navigation from itinerary to activity
- [x] **7.3** Verify all activity data displays

**Checkpoint:** Activity detail screen complete ✅

### Phase 8: Polish & Utilities (Day 4-5)

- [x] **8.1** Create lib/utils.ts
- [x] **8.2** Create stores/appStore.ts
- [x] **8.3** Create components/ui/Skeleton.tsx
- [ ] **8.4** Create hooks/usePullToRefresh.ts — **NOT IMPLEMENTED**
- [ ] **8.5** Add loading states where needed — partial (needs verification)
- [x] **8.6** Add haptic feedback to all interactions
- [ ] **8.7** Test on iOS simulator — requires manual testing
- [ ] **8.8** Test on Android emulator — requires manual testing

**Checkpoint:** App polish in progress (missing: usePullToRefresh hook, platform testing)

---

## File Checklist

### Config Files
- [x] tailwind.config.js
- [x] babel.config.js
- [x] metro.config.js
- [x] global.css
- [x] nativewind-env.d.ts
- [x] app.json (updated)

### Core Files
- [x] types/index.ts
- [x] constants/theme.ts
- [x] lib/mock-data.ts
- [x] lib/utils.ts
- [x] stores/appStore.ts

### UI Components (components/ui/)
- [x] Button.tsx
- [x] Input.tsx
- [x] Card.tsx
- [x] Badge.tsx
- [x] Avatar.tsx
- [x] IconButton.tsx
- [x] EmptyState.tsx
- [x] Skeleton.tsx
- [x] index.ts

### App Screens
- [x] app/_layout.tsx
- [x] app/index.tsx — via app/(auth)/index.tsx redirect
- [x] app/(auth)/_layout.tsx
- [ ] app/(auth)/welcome.tsx — **NOT IMPLEMENTED**
- [x] app/(auth)/login.tsx
- [x] app/(auth)/register.tsx
- [x] app/(tabs)/_layout.tsx
- [x] app/(tabs)/index.tsx
- [x] app/(tabs)/explore.tsx
- [x] app/(tabs)/profile.tsx
- [x] app/trip/new/index.tsx
- [x] app/trip/new/onboarding.tsx
- [x] app/trip/[id]/_layout.tsx
- [x] app/trip/[id]/index.tsx
- [x] app/trip/[id]/itinerary.tsx
- [x] app/trip/[id]/expenses.tsx
- [x] app/trip/[id]/chat.tsx
- [x] app/trip/[id]/settings.tsx
- [x] app/activity/[activityId].tsx

### Hooks
- [ ] hooks/usePullToRefresh.ts — **NOT IMPLEMENTED**

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
- [ ] Welcome screen renders — N/A (not implemented)
- [ ] Login form works — requires manual testing
- [ ] Register form works — requires manual testing
- [ ] Home shows trip list — requires manual testing
- [ ] Trip cards are tappable — requires manual testing
- [ ] New trip wizard completes — requires manual testing
- [ ] Trip overview displays data — requires manual testing
- [ ] Itinerary days are selectable — requires manual testing
- [ ] Activities are tappable — requires manual testing
- [ ] Activity detail shows all info — requires manual testing
- [ ] Expense list shows transactions — requires manual testing
- [ ] Add expense modal works — requires manual testing
- [ ] Chat sends/receives messages — requires manual testing
- [ ] Settings page functions — requires manual testing
- [ ] Share link copies — requires manual testing
- [ ] Delete trip confirms — requires manual testing

### Interactions to Test
- [ ] All buttons have haptic feedback — requires manual testing
- [ ] Forms validate correctly — requires manual testing
- [ ] Loading states appear — requires manual testing
- [ ] Error states appear — requires manual testing
- [ ] Pull to refresh works — N/A (hook not implemented)
- [ ] Keyboard dismisses properly — requires manual testing
- [ ] Back navigation works — requires manual testing
- [ ] Tab navigation works — requires manual testing

### Platforms to Test
- [ ] iOS Simulator (iPhone 15) — requires manual testing
- [ ] iOS Simulator (iPhone SE - small screen) — requires manual testing
- [ ] Android Emulator (Pixel) — requires manual testing
- [ ] Physical iOS device (if available) — requires manual testing
- [ ] Physical Android device (if available) — requires manual testing
