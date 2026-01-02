import { View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      className={`bg-slate-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        opacity,
      }}
    />
  );
}

export function TripCardSkeleton() {
  return (
    <View className="bg-white rounded-3xl overflow-hidden shadow-soft">
      <Skeleton height={160} borderRadius={0} />
      <View className="p-4">
        <Skeleton width="70%" height={24} className="mb-2" />
        <Skeleton width="50%" height={16} className="mb-4" />
        <View className="flex-row">
          <Skeleton width={32} height={32} borderRadius={16} />
          <View style={{ marginLeft: -8 }}>
            <Skeleton width={32} height={32} borderRadius={16} />
          </View>
          <View style={{ marginLeft: -8 }}>
            <Skeleton width={32} height={32} borderRadius={16} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function ActivityCardSkeleton() {
  return (
    <View className="flex-row mb-4">
      <Skeleton width={40} height={40} borderRadius={20} />
      <View className="flex-1 ml-4">
        <View className="bg-white rounded-2xl p-4">
          <Skeleton width="30%" height={12} className="mb-2" />
          <Skeleton width="80%" height={18} className="mb-2" />
          <Skeleton width="60%" height={14} />
        </View>
      </View>
    </View>
  );
}
