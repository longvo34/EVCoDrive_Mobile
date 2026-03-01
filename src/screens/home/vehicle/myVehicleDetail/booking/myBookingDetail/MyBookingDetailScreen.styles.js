import { StyleSheet } from "react-native";
import COLORS from "../../../../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: COLORS.text,
  },

  content: {
    padding: 16,
  },

  statusCard: {
  backgroundColor: COLORS.primary,
  borderRadius: 14,
  padding: 18,
  marginBottom: 16,
},

statusTitle: {
  color: COLORS.black,
  fontSize: 14,
},

statusBadge: {
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 6,
},

 card: {
  backgroundColor: COLORS.white,
  borderRadius: 14,
  padding: 16,
  marginBottom: 16,
},

  label: {
  color: COLORS.gray,
},

 value: {
  color: COLORS.text,
  fontWeight: "500",
},

valueSmall: {
  flex: 1,
  textAlign: "right",
  fontSize: 12,
},

sectionTitle: {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 12,
  color: COLORS.text,
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 10,
},


  status: {
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 4,
  },
});