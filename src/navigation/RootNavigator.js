import { useEffect, useState } from "react";
import LoadingScreen from "../screens/Loading/LoadingScreen";
import { getUserProfile } from "../services/user/user.service";
import { getAccessToken } from "../utils/authStorage";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [forceProfileUpdate, setForceProfileUpdate] = useState(false);
  const [refreshProfileTrigger, setRefreshProfileTrigger] = useState(0);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await getAccessToken();
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    // when login state becomes true, fetch profile and decide whether to force eKYC
    if (!isLoggedIn) return;

    let mounted = true;
    const checkProfile = async () => {
      try {
        const res = await getUserProfile();
        const data = res.data?.data;

        const hasValue = (v) => v !== undefined && v !== null && `${v}`.trim() !== "";

        const dobPresent = hasValue(data?.dateOfBirth);
        const addressPresent = hasValue(data?.address);

        // consider profile complete only when both dob and address have meaningful values
        const incomplete = !(dobPresent && addressPresent);

        if (mounted) setForceProfileUpdate(!!incomplete);
      } catch (err) {
        console.log("GET PROFILE (post-login) ERROR:", err?.response?.data || err?.message || err);
      }
    };

    checkProfile();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, refreshProfileTrigger]);

  if (loading) return <LoadingScreen />;

  return isLoggedIn ? (
    <MainNavigator 
      setIsLoggedIn={setIsLoggedIn} 
      forceProfileUpdate={forceProfileUpdate}
      onProfileUpdated={() => setRefreshProfileTrigger(t => t + 1)}
    />
  ) : (
    <AuthNavigator setIsLoggedIn={setIsLoggedIn} />
  );
}
