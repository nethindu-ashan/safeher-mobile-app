import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Alert Details</Text>
      <Text>ID: {String(id ?? "")}</Text>
    </View>
  );
}