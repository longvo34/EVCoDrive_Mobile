import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },

  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  backBtn: {
    position: "absolute",
    left: 0,
    padding: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },

  stepRow: {
    flexDirection: "row",
    marginVertical: 8,
  },

  stepDot: {
    flex: 1,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#E5E5E5",
    marginRight: 6,
  },

  active: {
    backgroundColor: COLORS.primary,
  },

  stepText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },

  checkItem: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  required: {
    color: "#FF9800",
  },

  footerCenter: {
    alignItems: "center",
    marginVertical: 16,
  },

  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
  },

  nextText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.black,
  },
});
