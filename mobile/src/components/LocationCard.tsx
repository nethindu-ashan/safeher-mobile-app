import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { COLORS } from "../constants/theme";

type Props = {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export default function LocationCard({
  loading = false,
  error,
  onRetry,
}: Props) {
  const hasError = Boolean(error);

  return (
    <View className="rounded-3xl border border-app-border bg-white p-4 shadow-sm">
      <View className="flex-row items-center">
        <View
          className={`h-12 w-12 items-center justify-center rounded-2xl ${
            hasError ? "bg-sos-light" : "bg-light-purple"
          }`}
        >
          <Ionicons
            name={hasError ? "location-outline" : "navigate-outline"}
            size={23}
            color={hasError ? COLORS.error : COLORS.primary}
          />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-sm font-bold text-app-text">
            Current location
          </Text>
          <Text className="mt-1 text-xs leading-4 text-app-muted">
            {loading
              ? "Detecting your position..."
              : hasError
                ? error
                : "Location detected successfully"}
          </Text>
        </View>
        {!loading && !hasError && (
          <View className="h-8 w-8 items-center justify-center rounded-full bg-success/10">
            <Ionicons
              name="checkmark"
              size={18}
              color={COLORS.success}
            />
          </View>
        )}
      </View>

      {hasError && onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-3 self-start rounded-full bg-light-purple px-4 py-2 active:opacity-70"
        >
          <Text className="text-xs font-bold text-primary">
            Try location again
          </Text>
        </Pressable>
      )}
    </View>
  );
}