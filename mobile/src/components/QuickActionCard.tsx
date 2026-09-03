import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import {
  Pressable,
  Text,
  View,
} from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  title: string;
  subtitle?: string;
  icon: IconName;
  onPress: () => void;
};

export default function QuickActionCard({
  title,
  subtitle,
  icon,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 w-[48%] rounded-2xl border border-app-border bg-white p-4 active:opacity-80"
    >
      <View className="mb-4 h-11 w-11 items-center justify-center rounded-full bg-light-purple">
        <Ionicons
          name={icon}
          size={22}
          color="#8B3DFF"
        />
      </View>

      <Text className="font-semibold text-app-text">
        {title}
      </Text>

      {subtitle && (
        <Text className="mt-1 text-xs leading-4 text-app-muted">
          {subtitle}
        </Text>
      )}
    </Pressable>
  );
}