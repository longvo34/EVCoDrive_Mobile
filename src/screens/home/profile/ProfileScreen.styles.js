import { StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },

  menu: {
    paddingHorizontal: 20,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  itemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
