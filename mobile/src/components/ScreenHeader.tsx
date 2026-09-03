import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, SPACING } from "../constants/theme";

type Props = {
  title: string;
  showBack?: boolean;
};

export default function ScreenHeader({
  title,
  showBack = true,
}: Props) {
  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
  },

  back: {
    fontSize: 32,
    color: COLORS.text,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  placeholder: {
    width: 30,
  },
});