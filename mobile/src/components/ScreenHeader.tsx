import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  Text,
  View,
} from "react-native";

export default function ScreenHeader({
  title,
  showBack = true,
}: {
  title: string;
  showBack?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-4">
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons
            name="chevron-back-outline"
            size={20}
            color="#251B2D"
          />
        </Pressable>
      ) : (
        <View className="h-10 w-10" />
      )}

      <Text className="text-base font-semibold text-app-text">
        {title}
      </Text>

      <View className="h-10 w-10" />
    </View>
  );
}