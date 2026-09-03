import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  Text,
} from "react-native";

import { GRADIENTS } from "../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`overflow-hidden rounded-full ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <LinearGradient
        colors={GRADIENTS.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 15,
          alignItems: "center",
        }}
      >
        <Text className="font-semibold text-white">
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}