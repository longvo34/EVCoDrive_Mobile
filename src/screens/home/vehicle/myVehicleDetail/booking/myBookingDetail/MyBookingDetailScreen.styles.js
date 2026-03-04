import { StyleSheet } from "react-native";
import COLORS from "../../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: COLORS.text,
  },

  content: {
    padding: 16,
  },

  statusCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },

  statusTitle: {
    color: COLORS.black,
    fontSize: 14,
  },

  statusBadge: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
    color: COLORS.white, // Đảm bảo chữ trắng trên nền primary
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  label: {
    color: COLORS.gray,
  },

  value: {
    color: COLORS.text,
    fontWeight: "500",
  },

  valueSmall: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },

  status: {
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 4,
  },

  // ================== MODAL STYLES ==================
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền mờ
  },

  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },

  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.grayLight || "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    textAlignVertical: "top",
  },

  dateButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.grayLight || "#ddd",
  },

  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 8,
  },

  modalButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  // ================== CALENDAR STYLES ==================
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 12,
    overflow: "hidden",
  },

  dateDisplayBox: {
    backgroundColor: "#f0f8ff",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },

  dateDisplayText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});