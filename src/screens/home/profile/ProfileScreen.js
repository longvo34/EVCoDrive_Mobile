import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../../constants/colors";
import { logoutApi } from "../../../services/auth/auth.service";
import { getUserProfile } from "../../../services/user/user.service";
import { clearTokens } from "../../../utils/authStorage";
import styles from "./ProfileScreen.styles";

export default function ProfileScreen({ setIsLoggedIn }) {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [redirectedToEKYC, setRedirectedToEKYC] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      const data = res.data.data;
      setProfile(data);

      // If profile missing critical fields, force eKYC once
      if (( !data?.dateOfBirth || !data?.address ) && !redirectedToEKYC) {
        setRedirectedToEKYC(true);
        navigation.navigate("EKYC");
      }
    } catch (err) {
      console.log("GET PROFILE ERROR:", err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutApi();
          } catch (err) {
            console.log("LOGOUT API ERROR:", err.response?.data || err.message);
          } finally {
            await clearTokens();
            setIsLoggedIn(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
  if (!profile?.dateOfBirth || !profile?.address) {
    navigation.navigate("EKYC");
  } else {
    navigation.navigate("ProfileDetail");
  }
}}
        >
          <Image
  source={{
    uri: "https://www.gravatar.com/avatar/?d=mp&s=150",
  }}
  style={styles.avatar}
/>

          <Text style={styles.name}>
            {profile?.fullName || profile?.email || ""}
          </Text>
        </TouchableOpacity>

        {/* Menu */}
        <ScrollView
          style={styles.menu}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.menu}>
             <MenuItem
              icon={
                <Ionicons name="wallet-outline" size={22} color={COLORS.text} />
              }
              label="Ví của tôi"
              onPress={() => navigation.navigate("MemberWallet")}
            />

            <MenuItem
              icon={
                <Ionicons name="car-outline" size={22} color={COLORS.text} />
              }
              label="Xe của tôi"
              onPress={() => navigation.navigate("Vehicle")}
            />

            <MenuItem
              icon={
                <MaterialIcons
                  name="local-offer"
                  size={22}
                  color={COLORS.text}
                />
              }
              label="Xe đã niêm yết"
            />

            <MenuItem
              icon={
                <Ionicons
                  name="receipt-outline"
                  size={22}
                  color={COLORS.text}
                />
              }
              label="Lịch sử giao dịch"
              onPress={() => navigation.navigate("History")}
            />

           <MenuItem
  icon={<Ionicons name="add-circle-outline" size={22} color={COLORS.text} />}
  label="Đăng ký xe"
  onPress={() => {
    if (!profile?.dateOfBirth || !profile?.address) {
      Alert.alert(
        "Cần xác thực",
        "Bạn cần xác thực eKYC và cập nhật thông tin cá nhân trước khi đăng ký xe",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xác thực ngay",
            onPress: () => navigation.navigate("EKYC"),
          },
        ]
      );
    } else {
      navigation.navigate("RegisterVehicle");
    }
  }}
/>

            <MenuItem
              icon={
                <Ionicons
                  name="settings-outline"
                  size={22}
                  color={COLORS.text}
                />
              }
              label="Cài đặt"
            />

            <MenuItem
              icon={
                <Ionicons name="key-outline" size={22} color={COLORS.text} />
              }
              label="Đổi mật khẩu"
              onPress={() =>
                Alert.alert(
                  "Đổi mật khẩu",
                  "Bạn có chắc chắn muốn đổi mật khẩu không?",
                  [
                    { text: "Hủy", style: "cancel" },
                    {
                      text: "Đồng ý",
                      onPress: () => navigation.navigate("ChangePassword"),
                    },
                  ],
                )
              }
            />

            <MenuItem
              icon={
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={COLORS.primary}
                />
              }
              label="Đăng xuất"
              textStyle={{ color: COLORS.primary }}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, textStyle }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        {icon}
        <Text style={[styles.itemText, textStyle]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
    </TouchableOpacity>
  );
}
