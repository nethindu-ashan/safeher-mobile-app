import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { COLORS, RADIUS, SPACING } from "../constants/theme";

type Props = {
  children: ReactNode;
};

export default function AppCard({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
});