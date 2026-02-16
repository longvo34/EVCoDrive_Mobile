import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BuyRequest from "../screens/home/profile/registerVehicle/buyRequest/BuyRequest";
import RequestListScreen from "../screens/home/profile/registerVehicle/requestList/RequestListScreen";

const Stack = createNativeStackNavigator();

export default function BuyRequestStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuyRequestList" component={RequestListScreen} />
      <Stack.Screen name="BuyRequest" component={BuyRequest} />
    </Stack.Navigator>
  );
}