import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/home/profile/ProfileScreen";
import ChangePasswordScreen from "../screens/home/profile/changePassword/ChangePassword";
import EKYCScreen from "../screens/home/profile/ekyc/EKYCScreen";
import MemberWalletScreen from "../screens/home/profile/memberWallet/MemberWalletScreen";
import ProfileDetailScreen from "../screens/home/profile/profileDetail/ProfileDetailScreen";
import RegisterVehicleStackNavigator from "./RegisterVehicleStackNavigator";

const Stack = createNativeStackNavigator();

export default function ProfileStack({ setIsLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain">
        {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="EKYC" component={EKYCScreen} />
      <Stack.Screen
        name="RegisterVehicle"
        component={RegisterVehicleStackNavigator}
      />
      <Stack.Screen name="ChangePassword">
        {(props) => (
          <ChangePasswordScreen {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
      </Stack.Screen>
      <Stack.Screen name="MemberWallet" component={MemberWalletScreen} />
    </Stack.Navigator>
  );
}
