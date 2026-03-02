import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
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
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: COLORS.text,
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    color: COLORS.text,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
  },

  row2: {
    flexDirection: "row",
  },

  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginVertical: 12,
  },

  nextText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.black,
  },
});
