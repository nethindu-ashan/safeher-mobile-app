import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

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
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary">
          <Ionicons
            name="shield-checkmark"
            size={21}
            color="#FFFFFF"
          />
        </View>
        <Text className="ml-3 text-2xl font-bold text-app-text">
          {title}
        </Text>
      </View>
      <Text className="max-w-[320px] text-sm leading-5 text-app-muted">
        {subtitle}
      </Text>
    </View>
  );
}