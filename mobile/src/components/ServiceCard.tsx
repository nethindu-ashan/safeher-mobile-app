import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import { COLORS } from "../constants/theme";
import type { NearbyHelpService } from "../types/nearbyHelp";

type Props = {
  service: NearbyHelpService;
  onPress: () => void;
  index?: number;
};

export default function ServiceCard({
  service,
  onPress,
  index = 0,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 55).duration(380)}
      className="mb-3"
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.86 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
        className="rounded-3xl border border-app-border bg-white p-4 shadow-sm"
      >
        <View className="flex-row items-start">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-light-purple">
            <Ionicons
              name="location-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>

          <View className="ml-3 flex-1">
            <Text
              className="text-base font-bold text-app-text"
              numberOfLines={2}
            >
              {service.name}
            </Text>
            <Text className="mt-1 text-[11px] font-bold uppercase tracking-wide text-primary">
              {service.category.replace("_", " ")}
            </Text>
            <Text
              className="mt-2 text-xs leading-4 text-app-muted"
              numberOfLines={2}
            >
              {service.address}
            </Text>

            <View className="mt-3 flex-row flex-wrap items-center">
              {service.distance !== null && (
                <View className="mr-4 flex-row items-center">
                  <Ionicons
                    name="navigate-outline"
                    size={14}
                    color={COLORS.primary}
                  />
                  <Text className="ml-1 text-xs font-medium text-app-muted">
                    {service.distance} km
                  </Text>
                </View>
              )}

              {service.rating !== null && (
                <View className="flex-row items-center">
                  <Ionicons
                    name="star"
                    size={14}
                    color="#F59E0B"
                  />
                  <Text className="ml-1 text-xs text-app-muted">
                    {service.rating}
                  </Text>
                </View>
              )}
            </View>

            {service.phone && (
              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name="call-outline"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Text className="ml-1 text-xs text-app-muted">
                  {service.phone}
                </Text>
              </View>
            )}
          </View>

          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={COLORS.textSecondary}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}