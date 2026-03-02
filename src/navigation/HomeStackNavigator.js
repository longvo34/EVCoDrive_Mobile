import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/home/HomeScreen";
import GroupShareScreen from "../screens/home/home/groupShare/GroupShareScreen";
import BuySellContractScreen from "../screens/home/home/groupShare/buySellContract/BuySellContractScreen";

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="GroupShare" component={GroupShareScreen} />
       <Stack.Screen
        name="BuySellContract"
        component={BuySellContractScreen}
      />
    </Stack.Navigator>
  );
}
