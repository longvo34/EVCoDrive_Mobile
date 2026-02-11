import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../constants/colors";
import HistoryScreen from "../screens/home/history/HistoryScreen";
import HomeStackNavigator from "./HomeStackNavigator";
import VehicleStackNavigator from "./VehicleStackNavigator";

import ProfileStack from "./ProfileStackNavigator";

const Tab = createBottomTabNavigator();

export default function MainNavigator({ setIsLoggedIn }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Vehicle") {
              iconName = focused ? "car" : "car-outline";
            } else if (route.name === "History") {
              iconName = focused ? "receipt" : "receipt-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#ffffff" },
        })}
      >
        <Tab.Screen
  name="Home"
  component={HomeStackNavigator}
  listeners={({ navigation }) => ({
    tabPress: () => {
      navigation.navigate("Home", {
        screen: "HomeMain",
      });
    },
  })}
/>


        <Tab.Screen name="Vehicle" component={VehicleStackNavigator} />

        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen
          name="Profile"
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();

              navigation.navigate("Profile", {
                screen: "ProfileMain",
              });
            },
          })}
        >
          {(props) => <ProfileStack {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}
