import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ContractScreen from "../screens/home/profile/registerVehicle/contract/ContractScreen";
import RequestListScreen from "../screens/home/profile/registerVehicle/requestList/RequestListScreen";
import SellRequestScreen from "../screens/home/profile/registerVehicle/sellRequest/SellRequestScreen";
import Step1BasicInfoScreen from "../screens/home/profile/registerVehicle/step1BasicInfo/Step1BasicInfoScreen";
import Step2TechnicalInfoScreen from "../screens/home/profile/registerVehicle/step2TechnicalInfo/Step2TechnicalInfoScreen";
import Step3OwnerInfoScreen from "../screens/home/profile/registerVehicle/step3OwnerInfo/Step3OwnerInfoScreen";
import Step4UploadDocsScreen from "../screens/home/profile/registerVehicle/step4UploadDocs/Step4UploadDocsScreen";
import VehicleDetailScreen from "../screens/home/profile/registerVehicle/vehicleDetail/VehicleDetailScreen";

const Stack = createNativeStackNavigator();

export default function RegisterVehicleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehicleRequestList" component={RequestListScreen} />
      <Stack.Screen name="VehicleStep1" component={Step1BasicInfoScreen} />
      <Stack.Screen name="VehicleStep2" component={Step2TechnicalInfoScreen} />
      <Stack.Screen name="VehicleStep3" component={Step3OwnerInfoScreen} />
      <Stack.Screen name="VehicleStep4" component={Step4UploadDocsScreen} />
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
      />
      <Stack.Screen name="ContractScreen" component={ContractScreen} />
      <Stack.Screen name="SellRequest" component={SellRequestScreen} />
    </Stack.Navigator>
  );
}
