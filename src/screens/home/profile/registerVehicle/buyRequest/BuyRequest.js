import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { Modal, TextInput } from "react-native";
import EVLoading from "../../../../../components/animation/EVLoading";
import COLORS from "../../../../../constants/colors";
import { getIncomingBuyRequests, updateBuyRequestStatus } from "../../../../../services/buyRequest/buyRequest.service";
import styles from "./BuyRequest.styles";

export default function BuyRequestDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { buyRequestId } = route.params;
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchBuyRequestDetail();
  }, []);

  const fetchBuyRequestDetail = async () => {
    try {
      setLoading(true);

      const res = await getIncomingBuyRequests({ pageNumber: 1, pageSize: 20 });
      const items = res.data?.data?.items || [];
      const found = items.find((item) => item.buyRequestId === buyRequestId);

      if (found) {
        setRequest(found);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy yêu cầu mua này");
      }
    } catch (error) {
      console.log("Lỗi fetch detail:", error);
      Alert.alert("Lỗi", "Không thể tải chi tiết yêu cầu mua");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EVLoading visible={true} />;
  }

  if (!request) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy thông tin yêu cầu</Text>
      </View>
    );
  }

  const handleUpdateStatus = async () => {
    if (!reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do");
      return;
    }

    try {
      setLoading(true);

      await updateBuyRequestStatus(buyRequestId, {
        newStatus: selectedStatus,
        reason: reason
      });

      Alert.alert("Thành công", "Đã cập nhật trạng thái");

      setShowReasonModal(false);
      setReason("");
      setSelectedStatus(null);

      await fetchBuyRequestDetail();
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      const errorCode = error.response?.data?.errorCode;
      const message = error.response?.data?.message;

      setShowReasonModal(false);
      setReason("");
      setSelectedStatus(null);

      if (errorCode === "VAL_3003") {
        Alert.alert(
          "Không thể duyệt",
          "Hợp đồng chưa được ký đầy đủ bởi cả hai bên. Vui lòng hoàn tất ký hợp đồng trước khi duyệt yêu cầu."
        );
      } else {
        Alert.alert(
          "Lỗi",
          message || "Không thể cập nhật trạng thái"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header với nút back */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết yêu cầu mua</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Card chính */}
        <View style={styles.card}>
          {/* Group Name & Status */}
          <View style={styles.cardHeader}>
            <Text style={styles.groupName}>{request.groupName || "Yêu cầu mua xe"}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {request.status === "Proccessing" || request.status === "Processing"
                  ? "Chờ duyệt"
                  : request.status}
              </Text>
            </View>
          </View>

          {/* Ngày tạo */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.gray} style={styles.icon} />
            <Text style={styles.label}>Ngày tạo:</Text>
            <Text style={styles.value}>
              {new Date(request.createdDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Biển số */}
          <View style={styles.infoRow}>
            <Ionicons name="car-outline" size={20} color={COLORS.gray} style={styles.icon} />
            <Text style={styles.label}>Biển số:</Text>
            <Text style={styles.value}>
              {request.vehicleLicensePlate || "Chưa có biển số"}
            </Text>
          </View>

          {/* Tổng giá */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Tổng giá</Text>
            <Text style={styles.priceValue}>
              {request.totalPrice?.toLocaleString("vi-VN")} {request.currency || "VND"}
            </Text>
          </View>

          {/* Số lượng cổ phần */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Số lượng cổ phần yêu cầu</Text>
            <Text style={styles.quantityValue}>{request.quantity || 1}</Text>
          </View>

          {/* Thông tin hợp đồng */}
          {request.contract && (
            <View style={styles.contractSection}>
              <Text style={styles.sectionTitle}>Thông tin hợp đồng</Text>
              <View style={styles.contractInfo}>
                <Text style={styles.contractLabel}>Số hợp đồng:</Text>
                <Text style={styles.contractValue}>
                  {request.contract.contractNumber || "Chưa tạo"}
                </Text>
              </View>
              <View style={styles.contractInfo}>
                <Text style={styles.contractLabel}>Trạng thái:</Text>
                <Text
                  style={[
                    styles.contractStatus,
                    request.isContractFullySigned ? styles.signed : styles.notSigned,
                  ]}
                >
                  {request.isContractFullySigned ? "Đã ký đầy đủ" : "Chưa ký đầy đủ"}
                </Text>
              </View>
              <View style={styles.contractInfo}>
                <Text style={styles.contractLabel}>Ngày ký:</Text>
                <Text style={styles.contractValue}>
                  {request.contract.signedDate
                    ? new Date(request.contract.signedDate).toLocaleDateString("vi-VN")
                    : "Chưa ký"}
                </Text>
              </View>
            </View>
          )}

          {/* Cổ phần chi tiết */}
          {request.requestedShares?.length > 0 && (
            <View style={styles.sharesSection}>
              <Text style={styles.sectionTitle}>Cổ phần yêu cầu</Text>
              {request.requestedShares.map((share, index) => (
                <View key={index} style={styles.shareItem}>
                  <Text style={styles.shareNumber}>
                    Phần {share.shareUnitDisplayNumber}
                  </Text>
                  <Text style={styles.sharePrice}>
                    {share.price?.toLocaleString("vi-VN")} VND
                  </Text>
                  <Text style={styles.shareStatus}>
                    Trạng thái: {share.status || "Pending"}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        {/* Nút duyệt / huỷ */}
        {(request.status === "Processing" ||
          request.status === "Proccessing") && (
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 30 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: COLORS.softGreen,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedStatus("Completed");
                  setShowReasonModal(true);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Duyệt yêu cầu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: COLORS.cancel,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedStatus("Cancelled");
                  setShowReasonModal(true);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Huỷ yêu cầu
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>

      <Modal visible={showReasonModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 12
              }}
            >
              Nhập lý do{" "}
              {selectedStatus === "Completed" ? "duyệt" : "huỷ"}
            </Text>

            <TextInput
              placeholder="Nhập lý do..."
              value={reason}
              onChangeText={setReason}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 12,
                padding: 12,
                minHeight: 100,
                textAlignVertical: "top",
                marginBottom: 16
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#e5e7eb",
                  padding: 12,
                  borderRadius: 12,
                  alignItems: "center"
                }}
                onPress={() => {
                  setShowReasonModal(false);
                  setReason("");
                  setSelectedStatus(null);
                }}
              >
                <Text>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    selectedStatus === "Completed"
                      ? COLORS.softGreen
                      : COLORS.cancel,
                  padding: 12,
                  borderRadius: 12,
                  alignItems: "center"
                }}
                onPress={handleUpdateStatus}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );

}

