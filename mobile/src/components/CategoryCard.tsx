import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { COLORS } from "../constants/theme";
import type { NearbyCategory } from "../constants/nearbyCategories";

type Props = {
  category: NearbyCategory;
  onPress: () => void;
};

export default function CategoryCard({
  category,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.86 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      className="mb-3 rounded-2xl border border-app-border bg-white p-4"
    >
      <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-light-purple">
        <Ionicons
          name={category.icon}
          size={24}
          color={COLORS.primary}
        />
      </View>

      <Text className="text-base font-bold text-app-text">
        {category.title}
      </Text>
      <Text className="mt-1 text-xs leading-4 text-app-muted">
        {category.description}
      </Text>

      <View className="mt-4 flex-row items-center">
        <Text className="mr-1 text-xs font-semibold text-primary">
          Find nearby
        </Text>
        <Ionicons
          name="arrow-forward-outline"
          size={14}
          color={COLORS.primary}
        />
      </View>
    </Pressable>
  );
}