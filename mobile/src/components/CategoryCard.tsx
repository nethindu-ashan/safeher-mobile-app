import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import { COLORS } from "../constants/theme";
import type { NearbyCategory } from "../constants/nearbyCategories";

type Props = {
  category: NearbyCategory;
  onPress: () => void;
  index?: number;
};

export default function CategoryCard({
  category,
  onPress,
  index = 0,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).duration(420)}
      className="mb-3"
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => ({
          opacity: pressed ? 0.86 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
        className="rounded-3xl border border-app-border bg-white p-4 shadow-sm"
      >
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-light-purple">
            <Ionicons
              name={category.icon}
              size={24}
              color={COLORS.primary}
            />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-app-text">
              {category.title}
            </Text>
            <Text className="mt-1 text-xs leading-4 text-app-muted">
              {category.description}
            </Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-light-purple">
            <Ionicons
              name="arrow-forward"
              size={16}
              color={COLORS.primary}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}