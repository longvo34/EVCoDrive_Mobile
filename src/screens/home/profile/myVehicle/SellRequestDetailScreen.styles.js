import { StyleSheet } from "react-native";
import COLORS from "../../../../constants/colors";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    marginRight: 28,
  },

  scrollView: {
    flex: 1,
  },

  contentPadding: {
    padding: 16,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
  },

  vehicleInfo: {
    marginBottom: 20,
  },

  vehicleName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.black,
  },

  plateText: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 4,
  },

  groupText: {
    fontSize: 15,
    color: "#6b7280",
    marginTop: 4,
  },

  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: 8,
  },

  badgeText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  expiredWarning: {
    color: "#ef4444",
    marginTop: 8,
    fontWeight: "500",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  infoBlock: {
    flex: 1,
  },

  label: {
    fontSize: 14,
    color: "#6b7280",
  },

  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.softGreen,
  },

  sharesValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },

  expiredSection: {
    marginBottom: 24,
  },

  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: COLORS.black,
  },

  shareItem: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  shareNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  sharePrice: {
    fontSize: 16,
    color: COLORS.softGreen,
    fontWeight: "700",
  },

  certificateText: {
    marginTop: 4,
    color: "#4b5563",
  },

  cancelButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },

  cancelButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  bottomSpacer: {
    height: 60,
  },
  
inputLabel: {
  fontSize: 14,
  fontWeight: "500",
  color: COLORS.black || "#111827",
  marginBottom: 6,
},

dateRow: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#d1d5db",
  borderRadius: 8,
  padding: 12,
  backgroundColor: "#f9fafb",
  marginTop: 4,
},

dateText: {
  flex: 1,
  marginLeft: 10,
  fontSize: 16,
  color: COLORS.black || "#111827",
},

dateTextPlaceholder: {
  flex: 1,
  marginLeft: 10,
  fontSize: 16,
  color: "#9ca3af", 
},
});
