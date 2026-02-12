import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import COLORS from "../../../../../constants/colors";
import { createVehicleWithImages } from "../../../../../services/vehicle/vehicle.service";
import styles from "./Step4UploadDocsScreen.styles";

export default function Step4UploadDocsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { step1Data } = route.params || {};

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAX_IMAGES = 6;
  const MIN_IMAGES = 1; 

  useEffect(() => {
    console.log("=== NHẬN DỮ LIỆU TỪ STEP 1 ===");
    console.log("Full route.params:", JSON.stringify(route.params, null, 2));
    console.log("step1Data nhận được:", JSON.stringify(step1Data, null, 2));
    
    if (!step1Data) {
      console.warn("Cảnh báo: Không nhận được step1Data từ màn trước!");
    } else {
      console.log("Các field cụ thể:");
      console.log("- vehicleModelId:", step1Data.vehicleModelId);
      console.log("- stationId:", step1Data.stationId);
      console.log("- licensePlate:", step1Data.licensePlate);
      console.log("- color:", step1Data.color);
      console.log("- year:", step1Data.year);
      console.log("- odometer:", step1Data.odometer);
      console.log("- batteryHealth:", step1Data.batteryHealth);
      console.log("- lastMaintenanceDate:", step1Data.lastMaintenanceDate);
    }
  }, [route.params]);


  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền truy cập", "Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình.");
      }
    })();
  }, []);

  const pickImage = async (index) => {
    if (images.length >= MAX_IMAGES && !images[index]) {
      Alert.alert("Đã đủ", `Bạn chỉ được tải tối đa ${MAX_IMAGES} ảnh`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0];
      setImages(newImages.filter(Boolean));
    }
  };

  const onSubmit = async () => {
    if (images.length < MIN_IMAGES) {
      Alert.alert("Chưa đủ ảnh", `Vui lòng tải ít nhất ${MIN_IMAGES} ảnh xe`);
      return;
    }

    try {
      setLoading(true);

      await createVehicleWithImages(step1Data, images);

      Alert.alert(
        "Thành công",
        "Xe của bạn sẽ được chờ duyệt",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("VehicleRequestList"), 
          },
        ]
      );
    } catch (error) {
      console.error("Tạo xe thất bại:", error);
      console.error("Message:", error.message);
 
      const errorMessage = error.code === 'ECONNABORTED' 
        ? "Quá thời gian. Vui lòng kiểm tra kết nối mạng và thử lại."
        : error.message || "Không thể đăng ký xe. Vui lòng thử lại sau.";
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng ký xe</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.active]} />
          <View style={[styles.stepDot, styles.active]} />
        </View>
        <Text style={styles.stepText}>Bước 2/2</Text>

        <Text style={styles.sectionTitle}>Hình ảnh xe</Text>
        <Text style={styles.subTitle}>
          Tải ít nhất {MIN_IMAGES} – tối đa {MAX_IMAGES} hình (ngoại thất & nội thất)
        </Text>

        <View style={styles.imageGrid}>
          {Array.from({ length: MAX_IMAGES }).map((_, index) => {
            const img = images[index];
            return (
              <TouchableOpacity
                key={index}
                style={styles.imageBox}
                onPress={() => pickImage(index)}
              >
                {img ? (
                  <Image
                    source={{ uri: img.uri }}
                    style={{ width: "100%", height: "100%", borderRadius: 8 }}
                  />
                ) : (
                  <Ionicons name="camera" size={26} color={COLORS.gray} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.imageCount}>
          {images.length}/{MAX_IMAGES} hình đã chọn
        </Text>

        <View style={styles.footerCenter}>
          <TouchableOpacity
            style={[styles.nextBtn, loading && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.nextText}>Gửi thông tin xe →</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}