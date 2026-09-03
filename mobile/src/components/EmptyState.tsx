import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export default function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: SPACING.xl,
  },

  text: {
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});