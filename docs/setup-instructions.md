# Step 1: Project Setup

## Create New Expo Project

```bash
# Create project with Expo Router template
npx create-expo-app@latest trip-companion --template tabs

cd trip-companion
```

## Install Dependencies

```bash
# NativeWind (Tailwind for React Native)
npx expo install nativewind tailwindcss

# State management
npm install zustand

# Date handling
npm install date-fns

# Icons
npx expo install @expo/vector-icons

# Bottom sheet for modals
npm install @gorhom/bottom-sheet
npx expo install react-native-reanimated react-native-gesture-handler

# Safe area
npx expo install react-native-safe-area-context

# Haptics
npx expo install expo-haptics

# Image picker (for receipts later)
npx expo install expo-image-picker

# Linear gradient
npx expo install expo-linear-gradient

# Blur
npx expo install expo-blur
```

## Configure NativeWind

### Create `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Main primary
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Accent color - warm coral
        accent: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#ED6A5A', // Main accent
          600: '#C53030',
          700: '#9B2C2C',
          800: '#822727',
          900: '#63171B',
        },
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        // Neutral grays
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        display: ['Inter', 'System'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
```

### Create `global.css` in root

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Update `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

### Create `nativewind-env.d.ts`

```typescript
/// <reference types="nativewind/types" />
```

### Update `metro.config.js`

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

## Update `app/_layout.tsx`

```tsx
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="trip/new" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom' 
          }} 
        />
        <Stack.Screen name="trip/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}
```

## Create Directory Structure

```bash
# Create all directories
mkdir -p app/\(auth\)
mkdir -p app/\(tabs\)
mkdir -p app/trip/new
mkdir -p app/trip/\[id\]
mkdir -p app/activity
mkdir -p components/ui
mkdir -p components/trips
mkdir -p components/itinerary
mkdir -p components/expenses
mkdir -p components/chat
mkdir -p lib
mkdir -p stores
mkdir -p types
mkdir -p constants
mkdir -p assets/images
```

## Verify Setup

```bash
# Start the development server
npx expo start

# Press 'i' for iOS simulator or 'a' for Android
```

## Troubleshooting

If you get NativeWind errors:
1. Delete `node_modules` and reinstall
2. Clear Metro cache: `npx expo start --clear`
3. Ensure all config files are correct

If reanimated errors:
1. Restart the bundler
2. Rebuild the app on device/simulator
