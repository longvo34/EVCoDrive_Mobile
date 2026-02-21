import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  hello: {
    fontSize: 14,
    color: '#666',
  },

  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerIcons: {
    flexDirection: 'row',
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },

  subtitle: {
    color: '#777',
    marginBottom: 20,
  },

  carCard: {
  width: 260,
  borderRadius: 20,
  backgroundColor: '#fff',
  marginRight: 16,
  overflow: 'hidden',
},

carImage: {
  width: '100%',
  height: 180,   
},

carFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 12,
},

  carName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD600',
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  borderRadius: 12,
  marginHorizontal: 16,
  marginVertical: 12,
  paddingHorizontal: 12,
  height: 48,
  borderWidth: 1,
  borderColor: "#e0e0e0",
},

searchIcon: {
  marginRight: 8,
},

searchInput: {
  flex: 1,
  fontSize: 16,
  color: "#333",
},

clearButton: {
  padding: 4,
},

emptySearch: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 60,
},

emptySearchText: {
  fontSize: 18,
  fontWeight: "600",
  color: "#555",
  marginTop: 16,
},

emptySearchSubText: {
  fontSize: 14,
  color: "#888",
  marginTop: 8,
  textAlign: "center",
},

});
