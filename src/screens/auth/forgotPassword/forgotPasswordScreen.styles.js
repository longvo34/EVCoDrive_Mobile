import { StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },

  backText: {
    marginBottom: 20,
    color: COLORS.black,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.black,
  },

  subtitle: {
    color: COLORS.gray,
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    color: COLORS.black,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    color: COLORS.black,
  },
});
