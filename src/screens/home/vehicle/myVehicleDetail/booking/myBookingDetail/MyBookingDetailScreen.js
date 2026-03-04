import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

import EVLoading from "../../../../../../components/animation/EVLoading";
import COLORS from "../../../../../../constants/colors";

import { Calendar } from "react-native-calendars";
import {
  deleteBooking,
  getBookingById,
  updateBooking
} from "../../../../../../services/booking/booking.service";
import styles from "./MyBookingDetailScreen.styles";

export default function MyBookingDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params;
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editPurpose, setEditPurpose] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editCheckInDate, setEditCheckInDate] = useState(new Date());
  const [editCheckOutDate, setEditCheckOutDate] = useState(new Date());
  const [isCheckInPickerVisible, setCheckInPickerVisible] = useState(false);
  const [isCheckOutPickerVisible, setCheckOutPickerVisible] = useState(false);
  
const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    fetchBookingDetail();
  }, []);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const res = await getBookingById(bookingId);
      const data = res.data.data;
      setBooking(data);

      // Khởi tạo giá trị chỉnh sửa từ booking hiện tại
      setEditPurpose(data.purpose || "");
      setEditNote(data.note || "");
      setEditCheckInDate(new Date(data.checkInDate));
      setEditCheckOutDate(new Date(data.checkOutDate));
    } catch (error) {
      console.log("DETAIL ERROR:", error);
      Alert.alert("Lỗi", "Không thể tải chi tiết booking");
    } finally {
      setLoading(false);
    }
  };

 const handleOpenEditModal = async () => {
  

  // set selected từ booking hiện tại
  const dates = [];
  let current = new Date(booking.checkInDate);
  const end = new Date(booking.checkOutDate);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  setSelectedDates(dates);
  setModalVisible(true);
};

  const handleSaveEdit = async () => {
  if (!editPurpose.trim()) {
    return Alert.alert("Lỗi", "Mục đích sử dụng không được để trống");
  }

  if (selectedDates.length === 0) {
    return Alert.alert("Lỗi", "Vui lòng chọn ít nhất một ngày");
  }

  try {
    setLoading(true);
    setModalVisible(false);

    const sortedDates = [...selectedDates].sort();

    const payload = {
      purpose: editPurpose.trim(),
      checkInDate: sortedDates[0],
      checkOutDate: sortedDates[sortedDates.length - 1],
      note: editNote.trim() || "",
    };

    await updateBooking(bookingId, payload);

    Alert.alert("Thành công", "Cập nhật booking thành công");
    fetchBookingDetail();
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    Alert.alert("Lỗi", "Cập nhật thất bại. Vui lòng thử lại.");
  } finally {
    setLoading(false);
  }
};

  const handleDeleteBooking = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn huỷ booking này?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Huỷ booking",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteBooking(bookingId);

              Alert.alert("Thành công", "Đã huỷ booking");
              navigation.goBack();
            } catch (error) {
              console.log("DELETE ERROR:", error);
              Alert.alert("Lỗi", "Huỷ booking thất bại");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Booked":
        return "Đã đặt";
      case "Cancelled":
        return "Đã huỷ";
      default:
        return status;
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <EVLoading visible={loading} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={COLORS.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết đặt xe</Text>
      </View>

      {booking && (
        <ScrollView contentContainerStyle={styles.content}>
          {/* STATUS CARD */}
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Trạng thái booking</Text>
            <Text style={styles.statusBadge}>{getStatusText(booking.bookingStatus)}</Text>
          </View>

          {/* TIME INFO */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📅 Thời gian sử dụng</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nhận xe</Text>
              <Text style={styles.value}>{formatDate(booking.checkInDate)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Trả xe</Text>
              <Text style={styles.value}>{formatDate(booking.checkOutDate)}</Text>
            </View>
          </View>

          {/* BOOKING INFO */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📝 Thông tin đặt xe</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Mục đích</Text>
              <Text style={styles.value}>{booking.purpose}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Ghi chú</Text>
              <Text style={styles.value}>{booking.note || "Không có"}</Text>
            </View>
          </View>

          {/* SYSTEM INFO */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>⚙️ Thông tin hệ thống</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Ngày tạo</Text>
              <Text style={styles.value}>{formatDate(booking.createdDate)}</Text>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              onPress={handleOpenEditModal}
              style={{
                backgroundColor: COLORS.softGreen,
                padding: 14,
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.white,
                  fontWeight: "bold",
                }}
              >
                Cập nhật booking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteBooking}
              style={{
                backgroundColor: COLORS.cancel,
                padding: 14,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.white,
                  fontWeight: "bold",
                }}
              >
                Huỷ booking
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ================= MODAL CHỈNH SỬA ================= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 30 }}
  >
    <Text style={styles.modalTitle}>Chỉnh sửa booking</Text>

    {/* MỤC ĐÍCH */}
    <Text style={styles.modalLabel}>Mục đích sử dụng *</Text>
    <TextInput
      style={styles.modalInput}
      value={editPurpose}
      onChangeText={setEditPurpose}
      multiline
    />

    {/* GHI CHÚ */}
    <Text style={styles.modalLabel}>Ghi chú</Text>
    <TextInput
      style={[styles.modalInput, { minHeight: 80 }]}
      value={editNote}
      onChangeText={setEditNote}
      multiline
    />

    {/* CALENDAR */}
    <Text style={styles.modalLabel}>Chọn ngày sử dụng</Text>

    <View style={styles.calendarContainer}>
     <Calendar
  minDate={new Date().toISOString().split("T")[0]}
  markedDates={selectedDates.reduce((acc, date) => {
    acc[date] = {
      selected: true,
      selectedColor: COLORS.primary,
    };
    return acc;
  }, {})}
  onDayPress={(day) => {
    const date = day.dateString;

    setSelectedDates((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date]
    );
  }}
/>
    </View>

    {/* BUTTONS */}
    <View style={styles.modalButtons}>
      <TouchableOpacity
        style={[styles.modalButton, { backgroundColor: "#ccc" }]}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.modalButtonText}>Huỷ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
        onPress={handleSaveEdit}
      >
        <Text style={[styles.modalButtonText, { color: "#fff" }]}>
          Lưu thay đổi
        </Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
</View>
        </View>
      </Modal>

     
    </View>
  );
}