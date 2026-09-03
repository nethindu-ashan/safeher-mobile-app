import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Service Details</Text>
      <Text>ID: {String(id ?? "")}</Text>
    </View>
  );
}