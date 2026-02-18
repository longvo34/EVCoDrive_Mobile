import { StyleSheet } from "react-native";
import COLORS from "../../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

 header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},


  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: COLORS.softGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  roomName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },

  lastMessage: {
    fontSize: 13,
    color: COLORS.gray,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  badge: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.gray,
  },
});
