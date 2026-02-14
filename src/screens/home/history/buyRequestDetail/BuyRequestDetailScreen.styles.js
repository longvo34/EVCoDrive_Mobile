import { StyleSheet } from "react-native";
import COLORS from "../../../../constants/colors";

export default StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: COLORS.background,
},

content: {
  padding: 20,
  paddingBottom: 40,
},

headerCard: {
  backgroundColor: "#fff",
  padding: 18,
  borderRadius: 18,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
},
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },

  plate: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 14,
  },

  price: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.softGreen,
    marginBottom: 10,
  },

 metaRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
  gap: 8,
},

metaLabel: {
  fontSize: 14,
  color: COLORS.gray,
},

metaValue: {
  fontSize: 16,
  fontWeight: "700",
  color: COLORS.text,
},

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ea580c",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    color: COLORS.text,
  },

  shareCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  shareNumber: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: COLORS.text,
  },

  sharePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.softGreen,
    marginBottom: 4,
  },

  shareStatus: {
    fontSize: 13,
    color: COLORS.gray,
  },
});
