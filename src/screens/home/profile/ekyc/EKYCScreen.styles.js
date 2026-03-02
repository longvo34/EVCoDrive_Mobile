import { StyleSheet } from "react-native";
import COLORS from "../../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    resizeMode: "cover",
  },

  placeholder: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.gray,
    backgroundColor: "#fafafa",
  },

  placeholderText: {
    color: COLORS.gray,
    marginTop: 8,
  },

  submitBtn: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  submitText: {
    color: COLORS.black,
    fontWeight: "600",
    fontSize: 16,
  },

  disabledBtn: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
});

export default styles;
