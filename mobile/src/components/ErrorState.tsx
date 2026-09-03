import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export default function ErrorState({
  message = "Something went wrong.",
}: {
  message?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },

  text: {
    color: COLORS.error,
    textAlign: "center",
  },
});