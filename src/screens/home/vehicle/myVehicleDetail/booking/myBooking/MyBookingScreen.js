import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import EVLoading from "../../../../../../components/animation/EVLoading";
import COLORS from "../../../../../../constants/colors";
import { getBookingsByMember } from "../../../../../../services/booking/booking.service";
import { getProfileMember } from "../../../../../../services/profile/profile.service";
import { getVehicleById } from "../../../../../../services/vehicle/vehicle.service";
import styles from "./MyBookingScreen.styles";

export default function MyBookingScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { vehicleId } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileRes = await getProfileMember();
      const memberId = profileRes.data.memberId;
      const bookingRes = await getBookingsByMember(memberId);
      setBookings(bookingRes.data.data.items || []);

      if (vehicleId) {
        const vehicleRes = await getVehicleById(vehicleId);
        setVehicle(vehicleRes.data.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleString("vi-VN");
  };

  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.8}
    onPress={() =>
      navigation.navigate("MyBookingDetail", {
        bookingId: item.bookingId,
      })
    }
  >
    <Text style={styles.label}>
      📝 Mục đích: {item.purpose}
    </Text>

    <Text style={styles.label}>
      📅 Nhận xe: {formatDate(item.checkInDate)}
    </Text>

    <Text style={styles.label}>
      📅 Trả xe: {formatDate(item.checkOutDate)}
    </Text>

    <Text style={styles.status}>
      Trạng thái: {item.bookingStatus}
    </Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />

      <EVLoading visible={loading} />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={COLORS.black}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Lịch đặt xe của tôi
        </Text>
      </View>

      {/* ===== VEHICLE INFO ===== */}
      {vehicle && (
        <View style={styles.vehicleCard}>
  <Image
    source={{
      uri: vehicle.images?.[0]?.secureUrl,
    }}
    style={styles.vehicleImage}
  />
  <View style={styles.vehicleInfoWrapper}>
    <Text
      style={styles.vehicleName}
      numberOfLines={1}
    >
      {vehicle.vehicleModel?.name}
    </Text>

    <Text style={styles.vehiclePlate}>
      🚗 Biển số: {vehicle.licensePlate}
    </Text>

    <Text style={styles.vehicleInfo}>
      Màu: {vehicle.color} • Năm: {vehicle.year}
    </Text>
  </View>
</View>
      )}

      {/* ===== BOOKING LIST ===== */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.bookingId}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.empty}>
              Bạn chưa có lịch đặt xe
            </Text>
          )
        }
      />
    </View>
  );
}