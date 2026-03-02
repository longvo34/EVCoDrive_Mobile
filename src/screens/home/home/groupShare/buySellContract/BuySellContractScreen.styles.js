import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  primaryButton: {
    backgroundColor: "#FFD600",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  primaryButtonText: {
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  secondaryButtonText: {
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },

  contractCard: {
  backgroundColor: "#fff",
  padding: 16,
  borderRadius: 12,
  marginBottom: 20,
  elevation: 2,
},

contractTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 12,
},

infoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
},

label: {
  fontWeight: "600",
  color: "#666",
},

value: {
  color: "#000",
},

status: {
  fontWeight: "bold",
},

statusDraft: {
  color: "#ff9800",
},

statusDone: {
  color: "#4caf50",
},
});