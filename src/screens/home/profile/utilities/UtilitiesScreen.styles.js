import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 20,
  },

  // ── HEADER ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 12 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },

  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDEDF0",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: 0.2,
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 18,
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: 1.4,
  },

  // ── GRID ────────────────────────────────────────────────────────────────
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  // ── ITEM ────────────────────────────────────────────────────────────────
  item: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 4,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EAF6EF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  disabledIcon: {
    backgroundColor: "#F2F2F2",
  },

  dangerIcon: {
    backgroundColor: "#FEE9E9",
  },

  label: {
    fontSize: 12.5,
    fontWeight: "600",
    textAlign: "center",
    color: "#2D2D3A",
    lineHeight: 17,
  },

  labelDisabled: {
    color: "#BABAC8",
  },
});