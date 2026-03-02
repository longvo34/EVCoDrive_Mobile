import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EVLoading from "../../../../../components/animation/EVLoading";
import {
  getContractById,
  sendContractVerification,
  verifyContractSignature,
} from "../../../../../services/contract/contract.service";
import { getAccessToken } from "../../../../../utils/authStorage";
import styles from "./BuySellContractScreen.styles";

export default function BuySellContractScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { buyRequestId, contractId } = route.params || {};

  const [contract, setContract] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    console.log("BuySellContractScreen params nhận được:");
    console.log("→ buyRequestId:", buyRequestId || "KHÔNG CÓ");
    console.log("→ contractId:", contractId || "KHÔNG CÓ");
  }, [buyRequestId, contractId]);

  /* ================= LOAD CONTRACT ================= */
  useEffect(() => {
    if (contractId) {
      loadContractById(contractId);
    } else if (buyRequestId) {
      console.warn(
        "Không có contractId "
      );
      Alert.alert(
        "Thông báo",
        "Không tìm thấy thông tin hợp đồng. Vui lòng liên hệ hỗ trợ hoặc thử lại."
      );
      setLoading(false); 
    } else {
      setLoading(false); 
    }
  }, [contractId, buyRequestId]);

  const loadContractById = async (id) => {
    try {
      console.log(`Đang load contract bằng ID: ${id}`);

      const res = await getContractById(id);

      console.log("Response load contract:", res.data);
      setContract(res.data?.data || res.data);
    } catch (err) {
      console.log("LOAD CONTRACT ERROR:", err.response?.data || err);
      Alert.alert("Lỗi", "Không tải được hợp đồng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OPEN PDF  ================= */
  const handleOpenPdf = async () => {
    if (!contract?.contractId) {
      Alert.alert("Thông báo", "Chưa có thông tin hợp đồng để tải PDF");
      return;
    }

    try {
      setLoading(true);

      const token = await getAccessToken();
      const fileName = `Hop-dong_${contract.contractId}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const API_URL = Constants.expoConfig.extra.API_URL;
      const downloadUrl = `${API_URL}/contracts/${contract.contractId}/pdf`;

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
    } catch (err) {
      console.error("OPEN PDF ERROR:", err);
      Alert.alert("Lỗi", "Không thể tải hợp đồng PDF. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!contract?.contractId) {
      Alert.alert("Thông báo", "Chưa có hợp đồng để gửi OTP");
      return;
    }

    try {
      await sendContractVerification(contract.contractId);
      Alert.alert("OTP", "Mã OTP đã được gửi đến email của bạn");
    } catch (err) {
      console.error("SEND OTP ERROR:", err);
      Alert.alert("Lỗi", "Không gửi được OTP. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Thiếu OTP", "Vui lòng nhập mã OTP");
      return;
    }

    if (!contract?.contractId) {
      Alert.alert("Lỗi", "Không có thông tin hợp đồng để xác nhận");
      return;
    }

    try {
      setLoading(true);

      await verifyContractSignature(contract.contractId, otp);

      Alert.alert("Thành công", "Hợp đồng đã ký thành công!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("History");  
          }
        },
      ]);
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Ký hợp đồng thất bại. OTP sai hoặc hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  if (!buyRequestId && !contractId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Không tìm thấy thông tin yêu cầu mua hoặc hợp đồng.
        </Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  return (
    <View style={styles.container}>
      
      {/* Loading overlay full màn hình - hiển thị khi loading = true */}
      <EVLoading visible={loading} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Hợp đồng mua bán cổ phần</Text>
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 40 }} />}

      {!loading && contract && (
        <View style={styles.section}>
          <View style={styles.contractCard}>
            <Text style={styles.contractTitle}>
              {contract.contractTypeName}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Số hợp đồng:</Text>
              <Text style={styles.value}>{contract.contractNumber}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Trạng thái:</Text>
              <Text
                style={[
                  styles.status,
                  contract.contractStatuses === "Draft" && styles.statusDraft,
                  contract.contractStatuses === "Completed" && styles.statusDone,
                ]}
              >
                {contract.contractStatuses === "Draft"
                  ? "Chờ ký"
                  : contract.contractStatuses === "Completed"
                  ? "Đã hoàn tất"
                  : contract.contractStatuses}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngày ký:</Text>
              <Text style={styles.value}>
                {formatDate(contract.signedDate)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleOpenPdf}
          >
            <Text style={styles.secondaryButtonText}>
              📥 Tải / Xem hợp đồng PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSendOtp}
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
            onPress={handleVerifyOtp}
          >
            <Text style={styles.primaryButtonText}>
              ✅ Xác nhận ký hợp đồng
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !contract && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Đang tải thông tin hợp đồng...</Text>
        </View>
      )}
    </View>
  );
}