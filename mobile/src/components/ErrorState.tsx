import { Text, View } from "react-native";

export default function ErrorState({
  message = "Something went wrong.",
}: {
  message?: string;
}) {
  return (
    <View className="p-4">
      <Text className="text-center text-danger">
        {message}
      </Text>
    </View>
  );
}