import { Text, View } from "react-native";

export default function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <View className="items-center justify-center p-8">
      <Text className="text-center text-app-muted">
        {message}
      </Text>
    </View>
  );
}