import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";
// ⬆️ chỉnh path nếu khác

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
  },
  suggestText: {
    fontWeight: "700",
    fontSize: 13,
    color: COLORS.black,
  },

  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: "600",
    color: COLORS.text,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.primary,
  },

  sliderTrack: {
    height: 4,
    backgroundColor: COLORS.gray,
    borderRadius: 2,
    position: "relative",
    marginVertical: 12,
  },
  sliderActive: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sliderDot: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 11,
    color: COLORS.gray,
  },
  sliderNote: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 8,
  },

  inputLabel: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "500",
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
  },
  currency: {
    fontSize: 12,
    color: COLORS.gray,
  },

  infoBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.gray,
  },

  submitBtnDisabled: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.gray,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  submitTextDisabled: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
