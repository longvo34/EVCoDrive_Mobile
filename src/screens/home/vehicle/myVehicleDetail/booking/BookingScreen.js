import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import EVLoading from "../../../../../components/animation/EVLoading";
import COLORS from "../../../../../constants/colors";
import {
  createBooking,
  createUsageQuota,
  getBookingsByVehicle,
  getQuotaByShareUnit,
} from "../../../../../services/booking/booking.service";
import { getProfileMember } from "../../../../../services/profile/profile.service";
import { getMyShares } from "../../../../../services/shareHolder/shareHolder.service";
import styles from "./BookingScreen.styles";

export default function BookingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { vehicle = {} } = route.params || {};
  const vehicleId = vehicle?.vehicleId;

  const [loading, setLoading] = useState(false);
  const [vehicleState, setVehicleState] = useState("AVAILABLE");
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [member, setMember] = useState(null);
  const [shareUnits, setShareUnits] = useState([]);

  // Hàm load profile
  const loadProfile = async () => {
    try {
      const res = await getProfileMember();
      setMember(res.data);
    } catch (err) {
      console.log("❌ LOAD PROFILE ERROR:", err);
    }
  };

  // Hàm load share units
  const loadMyShareUnit = async () => {
    try {
      const res = await getMyShares();
      console.log("🚗 MY SHARES:", res.data);

      const groups = res.data.data || [];
      const vehicleGroup = groups.find(
        (g) => g.vehicleLicensePlate === vehicle.licensePlate
      );

      if (!vehicleGroup) {
        console.log("❌ Không có quyền xe này");
        return;
      }

      const availableShares = vehicleGroup.shareUnits.filter(
        (s) => s.status === "Available"
      );

      if (!availableShares.length) {
        console.log("❌ Không còn share khả dụng");
        return;
      }

      console.log(
        "✅ AVAILABLE SHARE UNITS:",
        availableShares.map((s) => s.shareUnitId)
      );

      setShareUnits(availableShares);
    } catch (err) {
      console.log("❌ LOAD SHARE ERROR:", err);
    }
  };

  // Hàm load bookings (giữ nguyên logic cũ)
  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await getBookingsByVehicle(vehicleId);
      const bookings = res.data.data || [];

      const marks = {};
      const today = new Date().toISOString().split("T")[0];

      let isBookedToday = false;
      let isInUsedToday = false;

      bookings.forEach((booking) => {
        if (
          booking.bookingStatus === "Completed" ||
          booking.bookingStatus === "Cancelled"
        )
          return;

        const start = new Date(booking.checkInDate);
        const end = new Date(booking.checkOutDate);

        let current = new Date(start);
        while (current <= end) {
          const dateStr = current.toISOString().split("T")[0];
          marks[dateStr] = {
            marked: true,
            dotColor:
              booking.bookingStatus === "InUsed" ? "#FF5252" : "#FFC107",
          };

          if (dateStr === today) {
            if (booking.bookingStatus === "InUsed") isInUsedToday = true;
            if (booking.bookingStatus === "Booked") isBookedToday = true;
          }

          current.setDate(current.getDate() + 1);
        }
      });

      let newState = "AVAILABLE";
      if (vehicle.status === "MAINTENANCE") newState = "MAINTENANCE";
      else if (isInUsedToday) newState = "IN_USED";
      else if (isBookedToday) newState = "BOOKED";

      setMarkedDates(marks);
      setVehicleState(newState);
    } catch (err) {
      console.log("❌ LOAD BOOKINGS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng useFocusEffect để load lại mỗi khi màn hình focus
  useFocusEffect(
    useCallback(() => {
      const fetchAllData = async () => {
        try {
          setLoading(true);

          await loadProfile();
          await loadMyShareUnit();

          if (vehicleId) {
            await loadBookings();
          }
        } catch (err) {
          console.log("❌ FETCH ALL DATA ERROR:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAllData();
    }, [vehicleId])  // chỉ chạy lại nếu vehicleId thay đổi
  );

  const ensureQuota = async (shareUnitId) => {
    try {
      console.log("⚡ Checking quota for shareUnit:", shareUnitId);
      const quotaRes = await getQuotaByShareUnit(shareUnitId);
      const quotas = quotaRes?.data?.data || [];

      if (Array.isArray(quotas) && quotas.length > 0) {
        console.log("✅ Quota already exists");
        return;
      }

      console.log("🚀 Creating quota...");
      await createUsageQuota({ shareUnitId });

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      console.log("❌ ENSURE QUOTA ERROR:", err);
    }
  };

  const handleBooking = async () => {
    if (!shareUnits.length) {
      return Alert.alert("Thông báo", "Không tìm thấy quyền sử dụng xe");
    }

    if (selectedDates.length === 0) {
      return Alert.alert("Thông báo", "Vui lòng chọn ít nhất một ngày");
    }

    if (!member?.memberId) {
      return Alert.alert("Thông báo", "Không tìm thấy thông tin người dùng");
    }

    if (!purpose.trim()) {
      return Alert.alert("Thông báo", "Vui lòng nhập mục đích sử dụng");
    }

    try {
      setLoading(true);

      for (const share of shareUnits) {
        await ensureQuota(share.shareUnitId);
      }

      const bookingShareUnitId = shareUnits[0].shareUnitId;

      for (const date of selectedDates) {
        if (markedDates[date]) continue;

        const payload = {
          memberId: member.memberId,
          vehicleId,
          shareUnitId: bookingShareUnitId,
          purpose: purpose.trim(),
          checkInDate: date,
          checkOutDate: date,
          note: note.trim() || "",
        };

        console.log("📤 SENDING BOOKING PAYLOAD:", payload);

        await createBooking(payload);
      }

      Alert.alert("Thành công", "Đặt xe thành công!");

      setSelectedDates([]);
      setPurpose("");
      setNote("");
      await loadBookings();          
      navigation.goBack();
    } catch (err) {
      console.log("❌ BOOKING ERROR FULL:", err);
      console.log("❌ RESPONSE DATA:", err?.response?.data);

      const errorData = err?.response?.data;
      let message = "Đặt xe thất bại. Vui lòng thử lại.";

      if (errorData?.errors?.["$.checkInDate"]) {
        message = "Định dạng ngày không hợp lệ";
      } else if (errorData?.errorCode === "SYS_5005") {
        message = "Ngày check-in phải trước ngày check-out";
      } else if (errorData?.errorCode === "SYS_5004") {
        message = "Bạn chưa có quota sử dụng cho cổ phần này";
      }

      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  const renderVehicleStatus = () => {
    switch (vehicleState) {
      case "MAINTENANCE":
        return (
          <View style={[styles.availableTag, { backgroundColor: COLORS.cancel }]}>
            <Text style={styles.availableText}>Bảo dưỡng</Text>
          </View>
        );
      case "IN_USED":
        return (
          <View style={[styles.availableTag, { backgroundColor: "#FF5252" }]}>
            <Text style={styles.availableText}>Đang sử dụng</Text>
          </View>
        );
      case "BOOKED":
        return (
          <View style={[styles.availableTag, { backgroundColor: "#FFC107" }]}>
            <Text style={styles.availableText}>Đã được đặt</Text>
          </View>
        );
      default:
        return (
          <View style={styles.availableTag}>
            <Text style={styles.availableText}>Sẵn sàng</Text>
          </View>
        );
    }
  };

  const mergedMarks = {
    ...markedDates,
    ...selectedDates.reduce((acc, date) => {
      acc[date] = { selected: true, selectedColor: COLORS.primary };
      return acc;
    }, {}),
  };

  return (
    <View style={styles.container}>
      <EVLoading visible={loading} />

      <ScrollView>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>
          <Text style={styles.title}>Đặt xe</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* THÔNG TIN XE */}
        <View style={styles.carCard}>
          <Image
            source={{ uri: vehicle.imageUrl || "https://via.placeholder.com/400" }}
            style={styles.carImage}
          />
          <View style={styles.carInfo}>
            <Text style={styles.carName}>{vehicle.name}</Text>
            <Text>Biển số: {vehicle.licensePlate}</Text>
            <Text>🔋 {vehicle.batteryHealth || 0}%</Text>

            <TouchableOpacity
              style={styles.viewMyBookingButton}
              onPress={() =>
                navigation.navigate("MyBooking", {
                  vehicleId: vehicle?.vehicleId,
                  licensePlate: vehicle?.licensePlate,
                })
              }
            >
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
              <Text style={styles.viewMyBookingText}>Xem lịch xe của tôi</Text>
            </TouchableOpacity>
          </View>

          {renderVehicleStatus()}
        </View>

        {/* LỊCH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày sử dụng</Text>
          <Calendar
            minDate={new Date().toISOString().split("T")[0]}
            disableAllTouchEventsForDisabledDays={true}
            markedDates={mergedMarks}
            onDayPress={(day) => {
              const date = day.dateString;
              if (date < new Date().toISOString().split("T")[0]) return;

              if (markedDates[date]) return;

              setSelectedDates((prev) =>
                prev.includes(date)
                  ? prev.filter((d) => d !== date)
                  : [...prev, date]
              );
            }}
          />
        </View>

        {/* MỤC ĐÍCH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mục đích sử dụng</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              padding: 14,
              fontSize: 16,
              marginHorizontal: 16,
              backgroundColor: "#fff",
            }}
            placeholder="Nhập mục đích (bắt buộc)"
            value={purpose}
            onChangeText={setPurpose}
            multiline
          />
        </View>

        {/* GHI CHÚ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              padding: 14,
              fontSize: 16,
              marginHorizontal: 16,
              backgroundColor: "#fff",
              minHeight: 80,
            }}
            placeholder="Ghi chú thêm (nếu có)"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* NÚT ĐẶT */}
        <View style={{ padding: 16, paddingBottom: 32 }}>
          <TouchableOpacity
            onPress={handleBooking}
            style={{
              backgroundColor: selectedDates.length > 0 ? COLORS.primary : "#ccc",
              padding: 18,
              borderRadius: 30,
              alignItems: "center",
            }}
            disabled={selectedDates.length === 0}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
              Đặt lịch sử dụng xe →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}