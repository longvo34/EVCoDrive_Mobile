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
    backgroundColor: COLORS.white,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  messageContainer: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.softGreen,
    borderTopRightRadius: 4,
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    borderTopLeftRadius: 4,
  },

  messageText: {
    color: COLORS.black,
    fontSize: 15,
    lineHeight: 20,
  },

  editedText: {
    fontSize: 11,
    color: "#8E8E93",
    marginLeft: 6,
    fontStyle: "italic",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: COLORS.white,
  },

  input: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 16,
    maxHeight: 120,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  actionMenu: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 8,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  menuText: {
    fontSize: 17,
    marginLeft: 16,
    color: COLORS.text,
  },

  participantModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  participantModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: "85%",
  },

  participantModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  participantModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },

  participantInfo: {
    marginLeft: 16,
    flex: 1,
  },

  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  participantRole: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
  },

  joinedDate: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
});