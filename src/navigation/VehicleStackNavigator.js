import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyVehicleScreen from "../screens/home/vehicle/MyVehicleScreen";
import MyVehicleDetailScreen from "../screens/home/vehicle/myVehicleDetail/MyVehicleDetailScreen";
import BookingScreen from "../screens/home/vehicle/myVehicleDetail/booking/BookingScreen";
import MyBookingScreen from "../screens/home/vehicle/myVehicleDetail/booking/myBooking/MyBookingScreen";
import MyBookingDetailScreen from "../screens/home/vehicle/myVehicleDetail/booking/myBookingDetail/MyBookingDetailScreen";
import ExtendedFeaturesScreen from "../screens/home/vehicle/myVehicleDetail/extendFeatures/ExtendedFeaturesScreen";

const Stack = createNativeStackNavigator();

export default function VehicleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyVehicle" component={MyVehicleScreen} />
      <Stack.Screen name="MyVehicleDetail" component={MyVehicleDetailScreen}  />
      <Stack.Screen name="ExtendedFeatures" component={ExtendedFeaturesScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="MyBooking" component={MyBookingScreen} />
      <Stack.Screen name="MyBookingDetail" component={MyBookingDetailScreen} />
    </Stack.Navigator>
  );
}
