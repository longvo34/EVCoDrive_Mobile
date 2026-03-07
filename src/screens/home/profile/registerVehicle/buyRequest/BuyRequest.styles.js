import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#fffbeb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 8,
    minWidth: 80,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  priceSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 4,
  },
  quantitySection: {
    marginTop: 16,
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 15,
    color: COLORS.gray,
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  contractSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  contractInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  contractLabel: {
    fontSize: 14,
    color: COLORS.gray,
    minWidth: 100,
  },
  contractValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  contractStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  signed: {
    color: "#10b981",
  },
  notSigned: {
    color: "#d97706",
  },
  sharesSection: {
    marginTop: 24,
  },
  shareItem: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  shareNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  sharePrice: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  shareStatus: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
  },
});