import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/home/profile/ProfileScreen";
import ChangePasswordScreen from "../screens/home/profile/changePassword/ChangePassword";
import EKYCScreen from "../screens/home/profile/ekyc/EKYCScreen";
import MemberWalletScreen from "../screens/home/profile/memberWallet/MemberWalletScreen";
import ProfileDetailScreen from "../screens/home/profile/profileDetail/ProfileDetailScreen";
import RegisterVehicleStackNavigator from "./RegisterVehicleStackNavigator";

const Stack = createNativeStackNavigator();

export default function ProfileStack({ setIsLoggedIn, forceProfileUpdate, onProfileUpdated }) {
  const initial = forceProfileUpdate ? "EKYC" : "ProfileMain";

  return (
    <Stack.Navigator initialRouteName={initial} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain">
        {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} initialParams={{ onProfileUpdated }} />
      <Stack.Screen name="EKYC">
        {(props) => <EKYCScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
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
