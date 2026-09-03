import { StyleSheet, Text, View } from "react-native";

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Alerts</Text>
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