import Animated, {
  FadeIn,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
import { View } from "react-native";

function SkeletonBlock({ className }: { className: string }) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, { duration: 850 }),
      -1,
      true
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      style={style}
      className={`rounded-lg bg-app-border ${className}`}
    />
  );
}

export default function LoadingCard() {
  return (
    <View className="mb-3 rounded-3xl border border-app-border bg-white p-4">
      <View className="flex-row items-start">
        <SkeletonBlock className="h-12 w-12 rounded-2xl" />
        <View className="ml-3 flex-1">
          <SkeletonBlock className="h-4 w-4/5" />
          <SkeletonBlock className="mt-3 h-3 w-full" />
          <SkeletonBlock className="mt-2 h-3 w-3/5" />
          <View className="mt-4 flex-row">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="ml-4 h-3 w-12" />
          </View>
        </View>
      </View>
    </View>
  );
}