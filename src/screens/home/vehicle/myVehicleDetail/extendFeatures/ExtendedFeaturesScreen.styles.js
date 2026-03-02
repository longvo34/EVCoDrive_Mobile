import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    color: COLORS.text,
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  item: {
    width: "25%",
    alignItems: "center",
    marginBottom: 24,
  },

  circleYellow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF3C4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  circleGray: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  circleRed: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  itemText: {
    fontSize: 12,
    textAlign: "center",
    color: COLORS.text,
  },

  yellowIcon: {
    color: "#F59E0B",
  },

  grayIcon: {
    color: "#6B7280",
  },

  redIcon: {
    color: COLORS.cancel,
  },

  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cancel,
  },

  iconColor: {
    color: COLORS.text,
  },
});