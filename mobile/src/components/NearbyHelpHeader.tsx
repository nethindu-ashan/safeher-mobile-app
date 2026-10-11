import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function NearbyHelpHeader({
  title = "Nearby Help",
  subtitle = "Find trusted emergency and medical services near you.",
}: Props) {
  return (
    <View className="mb-6 pt-2">
      <View className="mb-3 flex-row items-center">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="-ml-5 mr-3 h-10 w-10 items-center justify-center rounded-full bg-white active:opacity-70"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color="#251B2D"
          />
        </Pressable>

        {/* Existing Header Icon */}
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary">
          <Ionicons
            name="shield-checkmark"
            size={21}
            color="#FFFFFF"
          />
        </View>

        {/* Existing Title */}
        <Text className="ml-3 text-2xl font-bold text-app-text">
          {title}
        </Text>
      </View>

      {/* Existing Subtitle */}
      <Text className="max-w-[320px] text-sm leading-5 text-app-muted">
        {subtitle}
      </Text>
    </View>
  );
}