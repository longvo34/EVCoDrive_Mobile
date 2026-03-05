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

  bottomActions: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  smallBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,         
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  ekycSmallBtn: {
    backgroundColor: COLORS.primary + "22",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  saveSmallBtn: {
    backgroundColor: COLORS.primary,
  },

  smallBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,                    
  },

});