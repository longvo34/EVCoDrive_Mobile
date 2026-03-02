import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import COLORS from "../../../../../constants/colors";
import {
  createContract,
  sendContractVerification,
  verifyContractSignature
} from "../../../../../services/contract/contract.service";
import { updateVehicleStatus } from "../../../../../services/vehicle/vehicle.service";
import { getAccessToken } from "../../../../../utils/authStorage";
import styles from "./ContractScreen.styles";

export default function ContractScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { vehicleId } = route.params || {};

  const [contractId, setContractId] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!vehicleId) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red", textAlign: "center", marginTop: 50 }}>
          Không tìm thấy thông tin xe. Vui lòng thử lại từ danh sách.
        </Text>
      </View>
    );
  }

  const createRegisterContract = async () => {
    try {
      setLoading(true);
      console.log("[CREATE CONTRACT] Bắt đầu tạo hợp đồng...");

      const payload = {
        contractType: 1,
        title: "Hợp đồng đăng ký xe",
        description: "Hợp đồng đăng ký xe cho phương tiện",
        vehicleId,
      };

      const res = await createContract(payload);
      const newContractId = res.data?.data?.contractId;

      if (!newContractId) {
        throw new Error("Không tìm thấy contractId trong response");
      }

      setContractId(newContractId);
      Alert.alert("Thành công", "Đã tạo hợp đồng");
    } catch (e) {
      console.error("[CREATE CONTRACT] LỖI:", e);
      Alert.alert("Lỗi", "Không tạo được hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const openContractPdf = async () => {
    if (!contractId) {
      Alert.alert("Thông báo", "Vui lòng tạo hợp đồng trước");
      return;
    }

    try {
      setLoading(true);
      const token = await getAccessToken();
      const fileName = `Hop-dong-dang-ky-xe_${contractId}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const API_URL = Constants.expoConfig.extra.API_URL;
      const downloadUrl = `${API_URL}/contracts/${contractId}/pdf`;

      const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Không hỗ trợ", "Thiết bị không hỗ trợ mở file PDF");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Xem / Tải hợp đồng PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (e) {
      console.error("[OPEN PDF] LỖI:", e);
      Alert.alert("Lỗi", "Không thể tải hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!contractId) return;

    try {
      await sendContractVerification(contractId);
      Alert.alert("OTP", "Mã OTP đã được gửi về email");
    } catch (e) {
      console.error("[SEND OTP] LỖI:", e);
      Alert.alert("Lỗi", "Không gửi được OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      Alert.alert("Thiếu OTP", "Vui lòng nhập mã OTP");
      return;
    }

    if (!contractId) {
      Alert.alert("Lỗi", "Vui lòng tạo hợp đồng trước");
      return;
    }

    try {
      setLoading(true);

      await verifyContractSignature(contractId, otp);
      console.log("✅ VERIFY CONTRACT SUCCESS");

      await updateVehicleStatus(vehicleId, "SaleEligible");

      await AsyncStorage.setItem(`signed_vehicle_${vehicleId}`, 'true');

      Alert.alert(
        "Thành công",
        "Hợp đồng đã được ký thành công!",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "RegisterVehicle",
                    state: {
                      index: 0,
                      routes: [{ name: "VehicleRequestList" }],
                    },
                  },
                ],
              });
            },
          },
        ]
      );
    } catch (e) {
      console.error("❌ VERIFY ERROR:", e);
      Alert.alert("Lỗi", e.response?.data?.message || "Ký hợp đồng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Hợp đồng đăng ký xe</Text>
      </View>

      {loading && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {!loading && !contractId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tạo hợp đồng</Text>
          <Text style={styles.description}>
            Vui lòng tạo hợp đồng để tiến hành ký cho xe
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={createRegisterContract}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Đang tạo..." : "📄 Tạo hợp đồng"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && contractId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hợp đồng đã tạo</Text>

          <TouchableOpacity
            style={[styles.secondaryButton, { marginBottom: 16 }]}
            onPress={openContractPdf}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              {loading ? "Đang tải..." : "📥 Tải / Xem hợp đồng PDF"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={sendOtp}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              📨 Gửi OTP ký hợp đồng
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={verifyOtp}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Đang xử lý..." : "✅ Xác nhận ký hợp đồng"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}