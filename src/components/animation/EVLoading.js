import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import COLORS from "../../constants/colors";

export default function EVLoading({ visible }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require("../../assets/lottie/car-loading.json")}
        autoPlay
        loop
        style={styles.animation}
      />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    zIndex: 999,
  },
  animation: {
    width: 180,
    height: 180,
  },
});
