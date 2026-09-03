import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

import { COLORS } from "../constants/theme";

export default function LoadingState({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <View className="items-center justify-center p-6">
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
      />

      <Text className="mt-2 text-app-muted">
        {message}
      </Text>
    </View>
  );
}