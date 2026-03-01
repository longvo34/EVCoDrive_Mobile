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

  vehicleCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: COLORS.white,
  marginHorizontal: 16,
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
},

vehicleImage: {
  width: 70,
  height: 50,
  borderRadius: 8,
  marginRight: 10,
},

vehicleInfoWrapper: {
  flex: 1,
  flexShrink: 1, 
},

vehicleName: {
  fontSize: 14,
  fontWeight: "bold",
  color: COLORS.text,
},

vehiclePlate: {
  fontSize: 13,
  color: COLORS.text,
},

vehicleInfo: {
  fontSize: 12,
  color: COLORS.gray,
},

  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },

  status: {
    marginTop: 6,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.gray,
  },
});