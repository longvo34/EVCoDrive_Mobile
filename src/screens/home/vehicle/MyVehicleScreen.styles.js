import { StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || "#f8fafc", 
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text || "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subTitle: {
    fontSize: 15,
    color: COLORS.gray || "#6b7280",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    transform: [{ scale: 1 }],
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  info: {
    padding: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text || "#111827",
    marginBottom: 6,
    letterSpacing: -0.2,
  },

  plate: {
    fontSize: 14,
    color: COLORS.gray || "#6b7280",
    marginBottom: 10,
    fontWeight: "500",
  },

  share: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary || "#10b981",
    marginBottom: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgePublished: {
    backgroundColor: "#ecfdf5", 
  },

  badgePartial: { 
    backgroundColor: "#fffbeb", 
  },

  badgeRejected: {
    backgroundColor: "#fef2f2", 
  },

  badgeCompleted: {
    backgroundColor: "#ecfdf5",
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  textPublished: {
    color: "#065f46", 
  },

  textReadyToActive: {
    color: "#92400e", 
  },

  textRejected: {
    color: "#991b1b", 
  },

  expiredDate: {
  fontSize: 13,
  color: "#6b7280",          
  marginBottom: 8,
  fontWeight: "500",
},

});