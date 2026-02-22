import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyVehicleScreen from "../screens/home/vehicle/MyVehicleScreen";
import MyVehicleDetailScreen from "../screens/home/vehicle/myVehicleDetail/MyVehicleDetailScreen";

const Stack = createNativeStackNavigator();

export default function VehicleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyVehicle" component={MyVehicleScreen} />
      <Stack.Screen name="MyVehicleDetail" component={MyVehicleDetailScreen}  />
    </Stack.Navigator>
  );
}
