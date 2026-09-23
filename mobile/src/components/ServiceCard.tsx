import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { COLORS } from "../constants/theme";
import type { NearbyHelpService } from "../types/nearbyHelp";

type Props = {
  service: NearbyHelpService;
  onPress: () => void;
};

export default function ServiceCard({
  service,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.86 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
      className="mb-3 rounded-2xl border border-app-border bg-white p-4"
    >
      <View className="flex-row items-start">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-light-purple">
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
          <Text
            className="mt-1 text-xs leading-4 text-app-muted"
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
  );
}