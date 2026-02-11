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
});
