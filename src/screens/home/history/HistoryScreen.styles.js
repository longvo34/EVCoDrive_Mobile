import { StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.gray,
  },

  /* ===== BUY CARD ===== */

  buyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  buyGroupName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  buyPlate: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.gray,
  },

  buyPrice: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.softGreen, // dùng softGreen
  },

  buyMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  buyMetaText: {
    fontSize: 12,
    color: COLORS.gray,
  },

  buyStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  buyStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  /* ===== STATUS COLORS ===== */

  buyProcessing: {
    backgroundColor: "#FFF4E5",
  },

  buyProcessingText: {
    color: "#d97706",
  },

  buyCompleted: {
    backgroundColor: "#E6FFFA",
  },

  buyCompletedText: {
    color: COLORS.softGreen,
  },

  buyCancelled: {
    backgroundColor: "#FFE4E6",
  },

  buyCancelledText: {
    color: "#BE123C",
  },
  buyVehicleName: {
  fontSize: 16,
  fontWeight: "700",
  color: "#111827",
  marginBottom: 4,
},
});
