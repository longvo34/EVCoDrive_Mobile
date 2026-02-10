import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyVehicleScreen from "../screens/home/vehicle/MyVehicleScreen";
import SellRequestDetailScreen from "../screens/home/vehicle/sellRequestDetail/SellRequestDetailScreen";

const Stack = createNativeStackNavigator();

export default function VehicleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyVehicle" component={MyVehicleScreen} />
      <Stack.Screen
        name="SellRequestDetail"
        component={SellRequestDetailScreen}
      />
    </Stack.Navigator>
  );
}
