import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EVLoading from "../../../../components/animation/EVLoading";
import {
  deleteBuyRequest,
  getBuyRequestById,
} from "../../../../services/buyRequest/buyRequest.service";
import { getAccessToken } from "../../../../utils/authStorage";
import styles from "./BuyRequestDetailScreen.styles";

export default function BuyRequestDetailScreen({ route }) {
  const { buyRequestId } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getBuyRequestById(buyRequestId);
      setData(res.data?.data);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message ||
          "Không thể tải chi tiết yêu cầu mua"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Xác nhận hủy",
      "Bạn có chắc chắn muốn hủy yêu cầu mua này?\nHành động này không thể hoàn tác.",
      [
        { text: "Đóng", style: "cancel" },
        {
          text: "Hủy yêu cầu",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteBuyRequest(buyRequestId);
              Alert.alert("Thành công", "Yêu cầu mua đã được hủy thành công.");
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Lỗi",
                error?.response?.data?.message ||
                  "Không thể hủy yêu cầu mua. Vui lòng thử lại."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleViewPdf = async () => {
    const contractId = data?.contract?.contractId;
    if (!contractId) {
      Alert.alert("Thông báo", "Không tìm thấy hợp đồng để xem PDF");
      return;
    }

    try {
      setLoading(true);

      const token = await getAccessToken();
      const fileName = `Hop-dong_${contractId}.pdf`;
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
    } catch (err) {
      console.error("LỖI TẢI PDF:", err);
      Alert.alert("Lỗi", "Không thể tải hợp đồng PDF. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Proccessing":
      case "Processing":
        return "Chờ duyệt";
      case "Completed":
      case "Complete":
        return "Hoàn thành";
      case "Cancelled":
      case "Cancel":
        return "Đã hủy";
      default:
        return status || "Không xác định";
    }
  };

  const canCancel = data && 
    ["Pending", "Processing", "Proccessing", "ReadyForInspection", "SigningContract", "Rejected"].includes(data.status);

  if (!data) return <EVLoading visible={true} />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 15 }}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>{data.groupName}</Text>

          <Text style={styles.plate}>
            Biển số: {data.vehicleLicensePlate}
          </Text>

          <Text style={styles.price}>
            {data.totalPrice?.toLocaleString()} {data.currency}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Số lượng</Text>
            <Text style={styles.metaValue}>{data.quantity}</Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {getStatusLabel(data.status)}
            </Text>
          </View>
        </View>

        {/* Thông tin hợp đồng */}
        {data.contract && (
          <View style={styles.contractSection || { marginTop: 20, padding: 16, backgroundColor: "#f9f9f9", borderRadius: 12 }}>
            <Text style={styles.sectionTitle || { fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
              Thông tin hợp đồng
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontWeight: "600", color: "#666" }}>Số hợp đồng:</Text>
              <Text>{data.contract.contractNumber || "Chưa tạo"}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontWeight: "600", color: "#666" }}>Trạng thái:</Text>
              <Text style={{ color: data.contract.isFullySigned ? "#4CAF50" : "#FF9800" }}>
                {data.contract.isFullySigned || data.contract.signedDate 
                  ? "Đã ký đầy đủ" 
                  : "Chưa ký đầy đủ"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontWeight: "600", color: "#666" }}>Ngày ký:</Text>
              <Text>
                {data.contract.signedDate
                  ? new Date(data.contract.signedDate).toLocaleDateString("vi-VN")
                  : "Chưa ký"}
              </Text>
            </View>

            {/* Nút Xem hợp đồng PDF - luôn hiển thị nếu có contractId */}
            {data.contract.contractId && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CAF50",
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 8,
                }}
                onPress={handleViewPdf}
                disabled={loading}
              >
                <Ionicons name="document-text-outline" size={20} color="#fff" />
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                  Xem hợp đồng PDF
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Danh sách cổ phần */}
        <Text style={styles.sectionTitle}>Danh sách cổ phần</Text>

        {data.requestedShares?.map((share) => (
          <View
            key={share.buyRequestDetailId}
            style={styles.shareCard}
          >
            <Text style={styles.shareNumber}>
              Phần số {share.shareUnitDisplayNumber}
            </Text>

            <Text style={styles.sharePrice}>
              {share.price?.toLocaleString()} VND
            </Text>

            <Text style={styles.shareStatus}>
              {share.status}
            </Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {canCancel && (
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: styles.container.backgroundColor || '#fff' }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Hủy yêu cầu mua
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <EVLoading visible={loading} />
    </View>
  );
}