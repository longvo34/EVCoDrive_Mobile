import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function LoadingOverlay({ visible, text = "EVCoDrive" }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>{text}</Text>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFD600",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
});
