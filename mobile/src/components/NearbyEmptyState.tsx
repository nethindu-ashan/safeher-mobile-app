import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { COLORS } from "../constants/theme";

type Props = {
  title?: string;
  message?: string;
};

export default function NearbyEmptyState({
  title = "No services found",
  message = "No matching services were found near your current location.",
}: Props) {
  return (
    <View className="items-center rounded-2xl border border-app-border bg-white p-8">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-light-purple">
        <Ionicons
          name="search-outline"
          size={27}
          color={COLORS.primary}
        />
      </View>
      <Text className="mt-4 text-base font-bold text-app-text">
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-app-muted">
        {message}
      </Text>
    </View>
  );
}