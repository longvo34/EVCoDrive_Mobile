import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },

  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 15,
},

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: COLORS.text,
  },

  carCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  carImage: {
    width: 70,
    height: 45,
    resizeMode: "contain",
  },

  carInfo: {
    flex: 1,
    marginLeft: 10,
  },

  carName: {
    fontWeight: "700",
    fontSize: 16,
  },

  plate: {
    color: COLORS.gray,
    marginTop: 2,
  },

  statusRow: {
    flexDirection: "row",
    marginTop: 5,
  },

  battery: {
    marginRight: 10,
  },

  location: {
    color: COLORS.gray,
  },

  availableTag: {
    backgroundColor: COLORS.softGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  availableText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },

  calendarBox: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeBox: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
  },

  timeLabel: {
    fontSize: 10,
    color: COLORS.gray,
  },

  time: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 5,
  },

  arrow: {
    fontSize: 18,
  },

  totalTime: {
    marginTop: 12,
    color: COLORS.gray,
  },

  bookingButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  bookingText: {
    fontWeight: "700",
    fontSize: 16,
  },

  viewMyBookingButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "15",  
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + "40",
  },

  viewMyBookingText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
    marginLeft: 8,
  },
});