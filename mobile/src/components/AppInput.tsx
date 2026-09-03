import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { COLORS, RADIUS, SPACING } from "../constants/theme";

type Props = TextInputProps & {
  label?: string;
};

export default function AppInput({ label, ...props }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },

  label: {
    color: COLORS.text,
    fontWeight: "500",
    marginBottom: SPACING.sm,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
});