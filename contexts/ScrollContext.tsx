import React, { createContext, useContext } from 'react';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

/**
 * ScrollContext - Shared scroll position for collapsing headers
 *
 * Allows child tab screens to communicate scroll position
 * to the parent layout for header animations.
 */

// Header height constants - exported for child screens
export const HEADER_MAX_HEIGHT = 220;
export const HEADER_MIN_HEIGHT = 56;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface ScrollContextType {
  scrollY: SharedValue<number>;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useSharedValue(0);

  return (
    <ScrollContext.Provider value={{ scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollProvider');
  }
  return context;
}
