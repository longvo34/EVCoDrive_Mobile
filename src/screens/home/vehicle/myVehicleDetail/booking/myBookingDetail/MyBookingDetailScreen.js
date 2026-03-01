import { useEffect, useState } from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

import EVLoading from "../../../../../../components/animation/EVLoading";
import COLORS from "../../../../../../constants/colors";

import { getBookingById } from "../../../../../../services/booking/booking.service";

import styles from "./MyBookingDetailScreen.styles";

export default function MyBookingDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { bookingId } = route.params;

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchBookingDetail();
  }, []);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);

      const res = await getBookingById(bookingId);

      setBooking(res.data.data);
    } catch (error) {
      console.log("DETAIL ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleString("vi-VN");
  };

  const getStatusText = (status) => {
  switch (status) {
    case "Booked":
      return "Đã đặt";
    default:
      return status;
  }
};

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />

      <EVLoading visible={loading} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={COLORS.black}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Chi tiết đặt xe
        </Text>
      </View>

     {booking && (
  <ScrollView contentContainerStyle={styles.content}>

    {/* ===== STATUS CARD ===== */}
    <View style={styles.statusCard}>
      <Text style={styles.statusTitle}>
        Trạng thái booking
      </Text>

      <Text style={styles.statusBadge}>
  {getStatusText(booking.bookingStatus)}
</Text>
    </View>

    {/* ===== TIME INFO ===== */}
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        📅 Thời gian sử dụng
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Nhận xe</Text>
        <Text style={styles.value}>
          {formatDate(booking.checkInDate)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Trả xe</Text>
        <Text style={styles.value}>
          {formatDate(booking.checkOutDate)}
        </Text>
      </View>
    </View>

    {/* ===== BOOKING INFO ===== */}
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        📝 Thông tin đặt xe
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Mục đích</Text>
        <Text style={styles.value}>
          {booking.purpose}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Ghi chú</Text>
        <Text style={styles.value}>
          {booking.note || "Không có"}
        </Text>
      </View>
    </View>

    {/* ===== SYSTEM INFO ===== */}
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        ⚙️ Thông tin hệ thống
      </Text>

      <View style={styles.row}>
    
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Ngày tạo</Text>
        <Text style={styles.value}>
          {formatDate(booking.createdDate)}
        </Text>
      </View>
    </View>

  </ScrollView>
)}
    </View>
  );
}