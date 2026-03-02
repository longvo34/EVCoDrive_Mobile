import { StyleSheet } from "react-native";
import COLORS from "../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: COLORS.text,
  },
  row: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.gray,
    fontSize: 13,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 4,
  },
  updateBtn: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  updateText: {
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: COLORS.text,
  },
  label: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  inputDisabled: {
    backgroundColor: "#EFEFEF",
  },
  row2: {
    flexDirection: "row",
  },
  bottomBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  bottomText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
