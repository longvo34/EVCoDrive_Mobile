import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
  const [startTime, setStartTime] = useState("09:00"); 
  const [endTime, setEndTime] = useState("18:30");    
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [member, setMember] = useState(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [shareUnits, setShareUnits] = useState([]);

  // Load profile & share units chỉ một lần khi mount
  useEffect(() => {
    loadProfile();
    loadMyShareUnit();
  }, []);

  // Load bookings khi màn hình được focus (mỗi lần quay lại màn hình này)
  useFocusEffect(
    useCallback(() => {
      if (vehicleId) {
        loadBookings();
      }
    }, [vehicleId])
  );

  const loadMyShareUnit = async () => {
    try {
      const res = await getMyShares();

      console.log("🚗 MY SHARES:", res.data);

      const groups = res.data.data || [];

      // tìm đúng xe
      const vehicleGroup = groups.find(
        g => g.vehicleLicensePlate === vehicle.licensePlate
      );

      if (!vehicleGroup) {
        console.log("❌ Không có quyền xe này");
        return;
      }

      // lấy ALL share AVAILABLE
      const availableShares = vehicleGroup.shareUnits.filter(
        s => s.status === "Available"
      );

      if (!availableShares.length) {
        console.log("❌ Không còn share khả dụng");
        return;
      }

      console.log(
        "✅ AVAILABLE SHARE UNITS:",
        availableShares.map(s => s.shareUnitId)
      );

      setShareUnits(availableShares);

    } catch (err) {
      console.log("❌ LOAD SHARE ERROR:", err);
    }
  };

  const loadProfile = async () => {
    const res = await getProfileMember();
    setMember(res.data);
  };

  /* ================= LOAD BOOKINGS ================= */
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
              booking.bookingStatus === "InUsed"
                ? "#FF5252"
                : "#FFC107",
          };

          if (dateStr === today) {
            if (booking.bookingStatus === "InUsed")
              isInUsedToday = true;
            if (booking.bookingStatus === "Booked")
              isBookedToday = true;
          }

          current.setDate(current.getDate() + 1);
        }
      });

      let newState = "AVAILABLE";

      if (vehicle.status === "MAINTENANCE")
        newState = "MAINTENANCE";
      else if (isInUsedToday)
        newState = "IN_USED";
      else if (isBookedToday)
        newState = "BOOKED";

      setMarkedDates(marks);
      setVehicleState(newState);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ================= TIME FORMAT ================= */
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date, time) =>
    new Date(`${date}T${time}:00`).toISOString();

  const ensureQuota = async (shareUnitId) => {

    console.log("⚡ Checking quota...");
    console.log("👉 shareUnitId:", shareUnitId);

    const quotaRes = await getQuotaByShareUnit(shareUnitId);

    const quotas = quotaRes?.data?.data;

    console.log("📦 quota list:", quotas);

    if (Array.isArray(quotas) && quotas.length > 0) {
      console.log("✅ Quota exists");
      return;
    }

    console.log("🚀 No quota → creating quota");

    const createRes = await createUsageQuota({
      shareUnitId: shareUnitId,
    });

    console.log("✅ CREATE RESULT:", createRes?.data);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const verify = await getQuotaByShareUnit(shareUnitId);

    console.log("✅ VERIFY AFTER CREATE:", verify?.data);
  };

  /* ================= BOOKING ================= */
  const handleBooking = async () => {

    if (!shareUnits.length)
      return Alert.alert("Không tìm thấy quyền sử dụng xe");

    if (selectedDates.length === 0)
      return Alert.alert("Vui lòng chọn ngày");

    if (!member?.memberId)
      return Alert.alert("Không tìm thấy thông tin người dùng");

    if (!purpose.trim())
      return Alert.alert("Vui lòng nhập mục đích sử dụng");

    try {
      setLoading(true);

      /* ✅ ensure quota cho TOÀN BỘ shares */
      console.log("⚡ Ensure quota for all share units");

      for (const share of shareUnits) {
        await ensureQuota(share.shareUnitId);
      }

      /* ✅ dùng 1 share để booking */
      const bookingShareUnitId = shareUnits[0].shareUnitId;

      for (const date of selectedDates) {

        if (markedDates[date]) continue;

        const payload = {
          memberId: member.memberId,
          vehicleId,
          shareUnitId: bookingShareUnitId,
          purpose: purpose.trim(),
          checkInDate: combineDateTime(date, startTime),
          checkOutDate: combineDateTime(date, endTime),
          note: note.trim() || "",
        };

        console.log("📤 BOOKING PAYLOAD:", payload);

        await createBooking(payload);
      }

      Alert.alert("✅ Đặt xe thành công");

      setSelectedDates([]);
      setPurpose("");
      setNote("");

      // Reload lại lịch + trạng thái sau khi đặt thành công
      await loadBookings();

      navigation.goBack();

    } catch (err) {

      console.log("❌ BOOKING ERROR FULL:", err);
      console.log("❌ RESPONSE:", err?.response?.data);

      const errorCode = err?.response?.data?.errorCode;

      let message = "Đặt xe thất bại";

      if (errorCode === "SYS_5005")
        message = "Ngày check-in phải trước ngày check-out";

      if (errorCode === "SYS_5004")
        message = "Member chưa có quota năm cho cổ phần";

      Alert.alert("Đặt xe thất bại", message);

    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS ================= */
  const renderVehicleStatus = () => {
    switch (vehicleState) {
      case "MAINTENANCE":
        return (
          <View
            style={[styles.availableTag, { backgroundColor: COLORS.cancel }]}
          >
            <Text style={styles.availableText}>Bảo dưỡng</Text>
          </View>
        );

      case "IN_USED":
        return (
          <View
            style={[styles.availableTag, { backgroundColor: "#FF5252" }]}
          >
            <Text style={styles.availableText}>Đang sử dụng</Text>
          </View>
        );

      case "BOOKED":
        return (
          <View
            style={[styles.availableTag, { backgroundColor: "#FFC107" }]}
          >
            <Text style={styles.availableText}>Đang được đặt</Text>
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
      acc[date] = {
        selected: true,
        selectedColor: COLORS.primary,
      };
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

        {/* CAR */}
        <View style={styles.carCard}>
          <Image
            source={{
              uri: vehicle.imageUrl || "https://via.placeholder.com/400",
            }}
            style={styles.carImage}
          />

          <View style={styles.carInfo}>
            <Text style={styles.carName}>{vehicle.name}</Text>
            <Text>Biển số: {vehicle.licensePlate}</Text>
            <Text>🔋 {vehicle.batteryHealth || 0}%</Text>

            <TouchableOpacity
              style={styles.viewMyBookingButton}
              onPress={() => {
                navigation.navigate("MyBooking", {
                  vehicleId: vehicle?.vehicleId,
                  licensePlate: vehicle?.licensePlate,
                });
              }}
            >
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
              <Text style={styles.viewMyBookingText}>Xem lịch xe của tôi</Text>
            </TouchableOpacity>
    
          </View>

          {renderVehicleStatus()}
        </View>

        {/* CALENDAR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>

          <Calendar
            markedDates={mergedMarks}
            onDayPress={(day) => {
              const date = day.dateString;
              let newState = "AVAILABLE";

              if (vehicle.status === "MAINTENANCE") {
                newState = "MAINTENANCE";
              } else if (markedDates[date]) {
                if (markedDates[date].dotColor === "#FF5252") {
                  newState = "IN_USED";
                } else {
                  newState = "BOOKED";
                }
              }

              setVehicleState(newState);

              if (markedDates[date]) return;

              setSelectedDates((prev) =>
                prev.includes(date)
                  ? prev.filter((d) => d !== date)
                  : [...prev, date]
              );
            }}
          />
        </View>

        {/* THỜI GIAN SỬ DỤNG - giống hình */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian sử dụng</Text>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 12,
                padding: 16,
                marginRight: 8,
                alignItems: "center",
              }}
              onPress={() => setStartPickerVisible(true)}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>
                {startTime} 
              </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 20, color: "#888" }}>→</Text>

            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 12,
                padding: 16,
                marginLeft: 8,
                alignItems: "center",
              }}
              onPress={() => setEndPickerVisible(true)}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>
                {endTime}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MỤC ĐÍCH & GHI CHÚ */}
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

        {/* NÚT ĐẶT LỊCH */}
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
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "#fff",
              }}
            >
              Đặt lịch sử dụng xe →
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* DateTime Picker cho Start Time */}
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        onConfirm={(date) => {
          setStartTime(formatTime(date));
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
        date={new Date(`2000-01-01T${startTime}:00`)}
      />

      {/* DateTime Picker cho End Time */}
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        onConfirm={(date) => {
          setEndTime(formatTime(date));
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
        date={new Date(`2000-01-01T${endTime}:00`)}
      />
    </View>
  );
}