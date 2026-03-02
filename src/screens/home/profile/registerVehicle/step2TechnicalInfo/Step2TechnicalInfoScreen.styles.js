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
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 10,
  },

  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    marginRight: 8,
  },

  row2: {
    flexDirection: "row",
  },

  footer: {
    paddingVertical: 12,
  },

  backText: {
    fontSize: 14,
    color: COLORS.gray,
  },

  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },

  nextText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.black,
  },
});
