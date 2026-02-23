import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyVehicleScreen from "../screens/home/vehicle/MyVehicleScreen";
import MyVehicleDetailScreen from "../screens/home/vehicle/myVehicleDetail/MyVehicleDetailScreen";
import ExtendedFeaturesScreen from "../screens/home/vehicle/myVehicleDetail/extendFeatures/ExtendedFeaturesScreen";

const Stack = createNativeStackNavigator();

export default function VehicleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyVehicle" component={MyVehicleScreen} />
      <Stack.Screen name="MyVehicleDetail" component={MyVehicleDetailScreen}  />
      <Stack.Screen name="ExtendedFeatures" component={ExtendedFeaturesScreen} />
    </Stack.Navigator>
  );
}
