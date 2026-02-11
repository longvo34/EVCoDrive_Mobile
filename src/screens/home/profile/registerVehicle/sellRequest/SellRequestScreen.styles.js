import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  vehicleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    marginRight: 12,
  },
  vehicleName: {
    fontWeight: "600",
    fontSize: 14,
    color: COLORS.text,
  },
  vehicleSub: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },

  suggestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 999,
    marginBottom: 16,
    gap: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestText: {
    fontWeight: "700",
    fontSize: 13,
    color: COLORS.black,
  },

  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  inputLabel: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
    color: COLORS.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    height: 44,
    color: COLORS.text,
    fontSize: 14,
  },
  currency: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: "600",
  },

  infoBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFF9E6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  infoText: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
    lineHeight: 18,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },

  // Nút Đăng bán - Active
  submitBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: {
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 16,
  },

  // Nút Đăng bán - Disabled
  submitBtnDisabled: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#E0E0E0",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitTextDisabled: {
    color: "#9E9E9E",
    fontWeight: "600",
    fontSize: 16,
  },

  aiBox: {
  marginTop: 10,
  padding: 12,
  backgroundColor: "#f3f6ff",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#d6e0ff",
},

aiText: {
  marginTop: 6,
  fontSize: 13,
  color: "#444",
  lineHeight: 18,
},

});