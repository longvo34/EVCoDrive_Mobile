import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

export default StyleSheet.create({
  // === Style chung ===
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 999,
  },

  activeTab: {
    backgroundColor: COLORS.primary, // vàng #FFD600
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.gray,
  },

  activeTabText: {
    color: COLORS.black,
  },

  // === Style giữ nguyên cho tab "Đăng ký xe" (bạn yêu cầu giữ nguyên) ===
  card: {  // card cho xe đăng ký
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  carName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.gray,
  },

  note: {
    marginTop: 8,
    fontSize: 12,
    color: "#3A7AFE",
  },

  status: {  // badge status xe cũ
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  pending: {
    backgroundColor: "#FFE58F",
    color: "#AD6800",
  },

  review: {
    backgroundColor: "#E6F0FF",
    color: "#1D4ED8",
  },

  approved: {
    backgroundColor: "#E6FFFA",
    color: "#047857",
  },

  rejected: {
    backgroundColor: "#FFE4E6",
    color: "#BE123C",
  },

  sellNowButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  sellNowText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  // === Style mới cho tab "Yêu cầu mua" (giống hình) ===
  buyCard: {  // card riêng cho yêu cầu mua
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  buyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  groupName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },

  buyStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fffbeb", // vàng nhạt giống hình
    alignSelf: "flex-start",
  },

  buyStatusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#d97706", // cam vàng đậm
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  infoIcon: {
    fontSize: 18,
    marginRight: 10,
    color: COLORS.gray,
  },

  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 6,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  priceSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  priceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },

  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 4,
  },

  quantityText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 6,
  },

  // Empty state chung (có thể dùng cho cả hai tab)
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 64,
    color: "#d1d5db",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  emptyDesc: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
  },

  // FAB (chỉ dùng cho tab Đăng ký xe)
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});