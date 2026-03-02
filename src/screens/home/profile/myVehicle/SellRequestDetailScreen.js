import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import EVLoading from "../../../../components/animation/EVLoading";
import COLORS from "../../../../constants/colors";
import { cancelSellRequest, updateSellRequest } from "../../../../services/sellRequest/sellRequest.service";
import styles from "./SellRequestDetailScreen.styles";

export default function SellRequestDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sellRequest } = route.params || {};

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatCurrency = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newPrice, setNewPrice] = useState(
    formatCurrency(sellRequest?.pricePerShare ? String(sellRequest.pricePerShare) : "")
  );
  const [newExpiredDate, setNewExpiredDate] = useState(
    sellRequest?.expiredDate
      ? new Date(sellRequest.expiredDate).toISOString().slice(0, 16)
      : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sellRequest || !sellRequest.sellRequestId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin yêu cầu bán");
      navigation.goBack();
      return;
    }
  }, [sellRequest, navigation]);

  if (!sellRequest) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Không có dữ liệu yêu cầu bán
        </Text>
      </View>
    );
  }

  const {
    vehicleBrand = "Không xác định",
    vehicleModel = "",
    licensePlate,
    groupName,
    pricePerShare,
    totalShares,
    status,
    expiredDate,
    sellingShareUnits = [],
  } = sellRequest;

  const isExpired = expiredDate && new Date(expiredDate) < new Date();

  const handleCancel = () => {
    Alert.alert("Xác nhận", "Bạn chắc chắn muốn huỷ yêu cầu bán này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Huỷ yêu cầu",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await cancelSellRequest(sellRequest.sellRequestId);
            Alert.alert("Thành công", "Yêu cầu bán đã được huỷ thành công");
            navigation.goBack();
          } catch (error) {
            Alert.alert(
              "Lỗi",
              "Không thể huỷ yêu cầu bán\n" + (error?.message || "Lỗi không xác định")
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    const priceNum = Number(newPrice.replace(/\./g, ""));
    if (!newPrice || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập giá hợp lệ (số lớn hơn 0)");
      return;
    }

   let isoExpiredDate = undefined;
  if (newExpiredDate) {
    const newDateObj = new Date(newExpiredDate);
    if (!isNaN(newDateObj.getTime())) {
      isoExpiredDate = newDateObj.toISOString();

     
      if (sellRequest.expiredDate) {
        const oldDate = new Date(sellRequest.expiredDate);
        if (newDateObj <= oldDate) {
          Alert.alert(
            "Không thể cập nhật",
            "Bạn chỉ có thể chọn ngày hết hạn **lớn hơn** ngày hiện tại.\nVui lòng chọn lại thời gian hợp lệ."
          );
          return; 
        }
      }
    } else {
      Alert.alert("Lỗi", "Định dạng ngày hết hạn không hợp lệ");
      return;
    }
  }

  const payload = {
    pricePerShare: priceNum,
    ...(isoExpiredDate && { expiredDate: isoExpiredDate }),
  };

    console.log("Payload gửi đi:", JSON.stringify(payload, null, 2));
    console.log("ID:", sellRequest.sellRequestId);

    try {
      setLoading(true);
      const response = await updateSellRequest(sellRequest.sellRequestId, payload);
      console.log("Response thành công:", response);

      Alert.alert("Thành công", "Đã cập nhật thông tin yêu cầu bán");
      setModalVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("LỖI UPDATE:", error);

      if (error.response) {
        const serverMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          JSON.stringify(error.response.data);

        Alert.alert(
          "Lỗi từ server",
          `Cập nhật thất bại (${error.response.status})\n${serverMessage || "Không có thông báo chi tiết"}`
        );
      } else if (error.request) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server. Kiểm tra mạng.");
      } else {
        Alert.alert("Lỗi", error.message || "Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết yêu cầu bán</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentPadding}>
          {/* Thông tin xe */}
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>
              {vehicleBrand} {vehicleModel}
            </Text>
            <Text style={styles.plateText}>Biển số: {licensePlate}</Text>
            {groupName && (
              <Text style={styles.groupText}>Nhóm: {groupName}</Text>
            )}
          </View>

          {/* Trạng thái */}
          <View style={styles.statusCard}>
            <Text style={styles.sectionLabel}>Trạng thái yêu cầu bán</Text>
            <View
              style={[
                styles.statusBadge,
                status === "Published"
                  ? { backgroundColor: COLORS.softGreen }
                  : getStatusBadgeStyle(status),
              ]}
            >
              <Text style={styles.badgeText}>{getStatusText(status)}</Text>
            </View>

            {isExpired && (
              <Text style={styles.expiredWarning}>Yêu cầu đã hết hạn</Text>
            )}
          </View>

          {/* Giá & số lượng */}
          <View style={styles.infoRow}>
            <View style={[styles.infoBlock, { marginRight: 8 }]}>
              <Text style={styles.label}>Giá mỗi phần</Text>
              <Text style={styles.priceValue}>
                {Number(pricePerShare).toLocaleString("vi-VN")} ₫
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Đang rao bán</Text>
              <Text style={styles.sharesValue}>{totalShares} phần</Text>
            </View>
          </View>

          {/* Hạn */}
          <View style={styles.expiredSection}>
            <Text style={styles.label}>Hết hạn</Text>
            <Text
              style={[
                styles.dateValue,
                isExpired && { color: "#ef4444" },
              ]}
            >
              {formatDate(expiredDate) || "Chưa thiết lập"}
            </Text>
          </View>

          {/* Danh sách phần đang bán */}
          {sellingShareUnits.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Các phần đang rao bán</Text>
              {sellingShareUnits.map((unit) => (
                <View key={unit.shareUnitId} style={styles.shareItem}>
                  <View style={styles.shareRow}>
                    <Text style={styles.shareNumber}>
                      Phần #{unit.displayNumber}
                    </Text>
                    <Text style={styles.sharePrice}>
                      {Number(unit.pricePerShare).toLocaleString("vi-VN")} ₫
                    </Text>
                  </View>
                  {unit.certificateCode && (
                    <Text style={styles.certificateText}>
                      Mã chứng nhận: {unit.certificateCode}
                    </Text>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Nút hành động */}
          {status === "Published" && !isExpired && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 20,
                gap: 12,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { flex: 1, backgroundColor: COLORS.primary },
                ]}
                onPress={() => setModalVisible(true)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>
                  {loading ? "Đang xử lý..." : "Chỉnh sửa giá & hạn"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1 }]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>
                  {loading ? "Đang xử lý..." : "Huỷ yêu cầu bán"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

     {/* Modal chỉnh sửa */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    }}
  >
    <View
      style={{
        width: "88%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 24,
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        Cập nhật yêu cầu bán
      </Text>

      {/* Giá mỗi phần */}
      <View>
        <Text style={styles.label}>Giá mỗi phần</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 8,
            marginTop: 6,
            paddingRight: 12,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              padding: 12,
              fontSize: 16,
            }}
            value={newPrice}
            onChangeText={(text) => {
              const rawNumber = text.replace(/\D/g, "");
              const formatted = formatCurrency(rawNumber);
              setNewPrice(formatted);
            }}
            keyboardType="numeric"
            placeholder="Nhập giá tiền"
          />
          <Text style={{ fontSize: 16, fontWeight: "500" }}>VND</Text>
        </View>
      </View>

      
      <View>
        <Text style={styles.inputLabel}>Thời gian hết hạn</Text>

        <TouchableOpacity
          style={styles.dateRow}
          onPress={() => setShowDatePicker(true)}
          disabled={loading}
        >
          <Ionicons name="calendar-outline" size={18} color={COLORS.black} />
          <Text style={styles.dateText}>
            {newExpiredDate
              ? new Date(newExpiredDate).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Chọn ngày giờ hết hạn"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(newExpiredDate || new Date())}
            mode="date"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const newDate = new Date(newExpiredDate || new Date());
                newDate.setFullYear(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate()
                );
                setNewExpiredDate(newDate.toISOString());

             
                setTimeout(() => {
                  setShowTimePicker(true);
                }, 200);
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={new Date(newExpiredDate || new Date())}
            mode="time"
            is24Hour={true}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                const newDate = new Date(newExpiredDate || new Date());
                newDate.setHours(
                  selectedTime.getHours(),
                  selectedTime.getMinutes(),
                  0,
                  0
                );
                setNewExpiredDate(newDate.toISOString());
              }
            }}
          />
        )}
      </View>

      {/* Nút Huỷ / Lưu */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 14,
            backgroundColor: "#e5e7eb",
            borderRadius: 8,
          }}
          onPress={() => setModalVisible(false)}
          disabled={loading}
        >
          <Text style={{ textAlign: "center", fontWeight: "600" }}>
            Huỷ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 14,
            backgroundColor: COLORS.primary,
            borderRadius: 8,
          }}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "600",
            }}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      {/* Loading overlay toàn màn */}
      <EVLoading visible={loading} />
    </View>
  );
}

function getStatusText(status) {
  const map = {
    Published: "Đang bán",
    PartialSold: "Bán một phần",
    Ended: "Đã kết thúc",
    Completed: "Hoàn tất",
    Expired: "Hết hạn",
    Cancelled: "Đã huỷ",
  };
  return map[status] || status;
}

function getStatusBadgeStyle(status) {
  const map = {
    PartialSold: { backgroundColor: "#f59e0b" },
    Ended: { backgroundColor: "#6b7280" },
    Completed: { backgroundColor: "#3b82f6" },
    Expired: { backgroundColor: "#ef4444" },
    Cancelled: { backgroundColor: "#6b7280" },
  };
  return map[status] || { backgroundColor: "#9ca3af" };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
