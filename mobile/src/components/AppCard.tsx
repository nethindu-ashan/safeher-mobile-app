import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  children: ReactNode;
};

export default function AppCard({
  children,
}: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-app-border bg-white p-4">
      {children}
    </View>
  );
}