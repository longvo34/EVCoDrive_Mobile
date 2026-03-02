import { StyleSheet } from "react-native";
import COLORS from "../../../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
  },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 12,
    color: COLORS.text,
  },

  hint: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 8,
  },

  successText: {
    fontSize: 14,
    color: "#2ecc71",
    marginTop: 10,
    fontWeight: "500",
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 16,
},
title: {
  fontSize: 18,
  fontWeight: "600",
  marginLeft: 12,
},

});

export default styles;
