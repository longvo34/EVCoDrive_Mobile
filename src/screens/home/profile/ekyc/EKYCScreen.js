import { Ionicons } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { uploadCCCD } from "../../../../services/ekyc/ekyc.service";
import { clearTokens } from "../../../../utils/authStorage";
import styles from "./EKYCScreen.styles";

export default function EKYCScreen({ navigation, setIsLoggedIn }) {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ImagePicker.requestCameraPermissionsAsync();
  }, []);

  const pickImage = async (setImage) => {
    try {
      const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });

      if (!res.canceled) {
        const compressed = await manipulateAsync(
          res.assets[0].uri,
          [{ resize: { width: 600 } }],
          {
            compress: 0.4,
            format: SaveFormat.JPEG,
          }
        );
        setImage(compressed);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể truy cập camera");
    }
  };

  const submit = async () => {
    if (!front || !back) {
      Alert.alert("Thiếu ảnh", "Vui lòng chụp đủ 2 mặt CCCD");
      return;
    }

    try {
      setLoading(true);

      console.log("Starting eKYC upload");

      const ekycData = await uploadCCCD(front, back);

      console.log("EKYC data received:", ekycData);

      if (!ekycData) {
        Alert.alert("Lỗi", "Không đọc được thông tin CCCD");
        return;
      }

      navigation.navigate("ProfileDetail", { ekycData });
    } catch (err) {
      console.log("EKYC ERROR:", err.response?.data || err);
      Alert.alert(
        "Thất bại",
        err.response?.data?.detail || "Xác minh không thành công"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={async () => {
            if (navigation.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
              return;
            }

            // No back screen — clear tokens and go to Login
            try {
              await clearTokens();
            } catch (err) {
              console.log("CLEAR TOKENS ERROR:", err);
            }

            if (typeof setIsLoggedIn === "function") {
              setIsLoggedIn(false);
            } else {
              navigation.navigate("Login");
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Xác minh CCCD</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <TouchableOpacity style={styles.card} onPress={() => pickImage(setFront)}>
          {front ? (
            <Image source={{ uri: front.uri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text>📷</Text>
              <Text>Chụp mặt trước CCCD</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => pickImage(setBack)}>
          {back ? (
            <Image source={{ uri: back.uri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text>📷</Text>
              <Text>Chụp mặt sau CCCD</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.submitBtn, (!front || !back) && styles.disabledBtn]}
        onPress={submit}
        disabled={!front || !back || loading}
      >
        <Text style={styles.submitText}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
