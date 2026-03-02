import { StyleSheet } from "react-native";
import COLORS from "../../../../constants/colors";

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  shareTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  text: {
    color: "#666",
    marginTop: 4,
  },

  price: {
    marginTop: 6,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  buyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  buyText: {
    fontWeight: "bold",
  },
});
