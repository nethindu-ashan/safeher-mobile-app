import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export default function LoadingState({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },

  text: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});