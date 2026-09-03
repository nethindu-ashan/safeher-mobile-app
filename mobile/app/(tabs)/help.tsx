import { StyleSheet, Text, View } from "react-native";

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Help</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});