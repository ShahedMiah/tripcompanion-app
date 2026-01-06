import React, { createContext, useContext, useState, ReactNode, useRef, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

/**
 * FAB Context - Portal Pattern for Floating Action Button
 *
 * This solves the z-index/stacking context issue with Stack navigators.
 * The FAB renders at the app root level (above all navigators) and its
 * visibility/action is controlled via context from any nested screen.
 */

// Bento Editorial colours
const COLORS = {
  terracotta: {
    500: '#C4704A',
    600: '#A85A38',
  },
  amber: {
    500: '#D4A574',
  },
};

interface FABContextType {
  showFAB: (onPress: () => void) => void;
  hideFAB: () => void;
}

const FABContext = createContext<FABContextType | null>(null);

export function useFAB() {
  const context = useContext(FABContext);
  if (!context) {
    throw new Error('useFAB must be used within a FABProvider');
  }
  return context;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FABProviderProps {
  children: ReactNode;
}

export function FABProvider({ children }: FABProviderProps) {
  const [visible, setVisible] = useState(false);
  const onPressRef = useRef<() => void>(() => {});
  const insets = useSafeAreaInsets();

  // Animation values - store in refs so callbacks don't depend on them
  const scaleRef = useRef(useSharedValue(0));
  const opacityRef = useRef(useSharedValue(0));
  const scale = scaleRef.current;
  const opacity = opacityRef.current;

  // Stable callbacks - no dependencies that change
  const showFAB = useCallback((onPress: () => void) => {
    onPressRef.current = onPress;
    setVisible(true);
    // Subtle fade in - no bounce
    scaleRef.current.value = withTiming(1, { duration: 200 });
    opacityRef.current.value = withTiming(1, { duration: 200 });
  }, []);

  const hideFAB = useCallback(() => {
    scaleRef.current.value = withTiming(0, { duration: 150 });
    opacityRef.current.value = withTiming(0, { duration: 150 });
    // Delay hiding to allow animation to complete
    setTimeout(() => {
      setVisible(false);
    }, 150);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPressRef.current();
  };

  return (
    <FABContext.Provider value={{ showFAB, hideFAB }}>
      {children}

      {/* FAB renders at root level - above all navigators */}
      {visible && (
        <View style={styles.overlay} pointerEvents="box-none">
          <AnimatedPressable
            onPress={handlePress}
            style={[
              styles.fab,
              { bottom: Math.max(insets.bottom, 8) },
              animatedStyle,
            ]}
          >
            {({ pressed }) => (
              <Animated.View
                style={[
                  styles.fabInner,
                  { transform: [{ scale: pressed ? 0.94 : 1 }] },
                ]}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="chatbubble" size={26} color="#FFFFFF" />
                  {/* AI Sparkle badge */}
                  <View style={styles.badge}>
                    <Ionicons name="sparkles" size={9} color="#FFFFFF" />
                  </View>
                </View>
              </Animated.View>
            )}
          </AnimatedPressable>
        </View>
      )}
    </FABContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  fab: {
    position: 'absolute',
    right: 20,
  },
  fabInner: {
    width: 58,
    height: 58,
    borderRadius: 18, // Squircle shape
    backgroundColor: COLORS.terracotta[500],
    alignItems: 'center',
    justifyContent: 'center',
    // Warm shadow
    shadowColor: COLORS.terracotta[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 16,
    height: 16,
    backgroundColor: COLORS.amber[500],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.terracotta[500],
  },
});
