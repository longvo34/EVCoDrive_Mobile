import { StyleSheet } from "react-native";
import COLORS from "../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: COLORS.text,
  },

  carImage: {
    width: "90%",
    height: 200,
    alignSelf: "center",
    borderRadius: 16,
    marginBottom: 16,
  },

  infoBox: {
    paddingHorizontal: 20,
  },

  carName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  plate: {
    color: COLORS.gray,
    marginVertical: 4,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  batteryBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  readyTag: {
    backgroundColor: COLORS.signingGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  readyText: {
    fontSize: 12,
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  actionItem: {
    alignItems: "center",
  },

  circleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  actionText: {
    fontSize: 12,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },

  amount: {
    fontSize: 22,
    fontWeight: "700",
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
  },

  statBox: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
  },

  statLabel: {
    color: COLORS.gray,
    fontSize: 12,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },

  scheduleItemActive: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  scheduleStatus: {
    fontSize: 12,
    fontWeight: "700",
  },

  scheduleItem: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
  },

  actionContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  backgroundColor: "#f1f1f1",
  marginHorizontal: 16,
  paddingVertical: 16,
  borderRadius: 20,
  marginBottom: 20,
},

actionCircle: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: COLORS.primary,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 6,
},

walletCard: {
  backgroundColor: "#f1f1f1",
  marginHorizontal: 16,
  borderRadius: 20,
  padding: 20,
  marginBottom: 20,
},

walletHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

walletIcon: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#fff7cc",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},

walletTitle: {
  fontSize: 16,
  fontWeight: "700",
},

walletSub: {
  color: COLORS.gray,
  marginTop: 6,
},

walletAmount: {
  fontSize: 26,
  fontWeight: "700",
  marginVertical: 6,
},

divider: {
  height: 1,
  backgroundColor: "#ddd",
  marginVertical: 14,
},

transactionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},

transactionLeft: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

transactionTitle: {
  fontWeight: "600",
},

transactionDate: {
  fontSize: 12,
  color: COLORS.gray,
},

plusMoney: {
  color: COLORS.softGreen,
  fontWeight: "700",
},

minusMoney: {
  color: COLORS.cancel,
  fontWeight: "700",
},

grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginHorizontal: 16,
},

gridItem: {
  width: "48%",
  backgroundColor: "#f1f1f1",
  borderRadius: 20,
  padding: 18,
  marginBottom: 14,
},

gridLabel: {
  color: COLORS.gray,
  marginTop: 6,
},

gridValue: {
  fontSize: 16,
  fontWeight: "700",
  marginTop: 4,
},

topUpButton: {
  marginTop: 15,
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: "center",
},

topUpText: {
  color: COLORS.white,
  fontSize: 15,
  fontWeight: "600",
},

modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
},

modalContent: {
  width: "85%",
  backgroundColor: COLORS.white,
  borderRadius: 18,
  padding: 22,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 8,
},

modalHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "600",
  marginLeft: 8,
  color: "#111827",
},

label: {
  fontSize: 14,
  color: "#6b7280",
  marginTop: 8,
},

input: {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 10,
  padding: 12,
  marginTop: 6,
  fontSize: 15,
},

modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 25,
},

cancelButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#e5e7eb",
  alignItems: "center",
  marginRight: 10,
},

cancelText: {
  color: "#6b7280",
  fontWeight: "500",
},

confirmButton: {
  flex: 1,
  backgroundColor: COLORS.primary,
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
},

confirmText: {
  color: "#fff",
  fontWeight: "600",
},
});