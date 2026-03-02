import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoryScreen from "../screens/home/history/HistoryScreen";
import BuyRequestDetailScreen from "../screens/home/history/buyRequestDetail/BuyRequestDetailScreen";

const Stack = createNativeStackNavigator();

export default function HistoryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryMain" component={HistoryScreen} />
      <Stack.Screen name="BuyRequestDetail" component={BuyRequestDetailScreen} />
    </Stack.Navigator>
  );
}
