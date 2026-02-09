import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect } from "react";
import { Alert, Image } from "react-native";
import EVLoading from "../../../../../components/animation/EVLoading";
import { createSellRequest } from "../../../../../services/sellRequest/sellRequest.service";
import { getVehicleById } from "../../../../../services/vehicle/vehicle.service";
import styles from "./SellRequestScreen.styles";


export default function SellRequestScreen({ navigation, route }) {
  const [percent, setPercent] = useState(20);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiredDate, setExpiredDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { vehicleId } = route.params;
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    fetchVehicleDetail();
  }, []);

  const fetchVehicleDetail = async () => {
    try {
      setLoading(true);

      const res = await getVehicleById(vehicleId);

      const vehicleData = res.data?.data || res.data;
      setVehicle(vehicleData);

    } catch (error) {
      console.log("Lỗi lấy chi tiết xe:", error);
    } finally {
      setLoading(false);
    }
  };

  const showLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  const totalShares = percent / 10;
  const rawPrice = Number(price.replace(/\./g, ""));
const isValid = rawPrice > 0 && percent >= 10;

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const payload = {
      vehicleId,
      totalShares: percent / 10,
      pricePerShare: Number(price.replace(/\./g, "")),
      expiredDate: expiredDate.toISOString(),
    };

    console.log("Payload gửi lên:", payload);

    await createSellRequest(payload);

    Alert.alert("Thành công", "Đăng bán thành công!");
    navigation.goBack();

  } catch (error) {
    const apiError = error.response?.data;

    console.log("API ERROR:", apiError);

    if (apiError?.errorCode === "VAL_3003") {
      const match = apiError.message?.match(/\d+/);
      const available = match ? Number(match[0]) : 0;

      if (available > 0) {
        setPercent(available * 10);
      }

      Alert.alert(
        "Không đủ cổ phần",
        `Bạn chỉ còn ${available} cổ phần để bán.`
      );
      return;
    }
    Alert.alert(
      "Lỗi",
      apiError?.message || "Không thể tạo yêu cầu bán"
    );

  } finally {
    setLoading(false);
  }
};


  const formatCurrency = (value) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "") 
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

  return (
    <SafeAreaView style={styles.container}>
      {loading && <EVLoading />}

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết lập bán</Text>
        <View style={{ width: 22 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* VEHICLE INFO */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleRow}>
            {vehicle?.images?.length > 0 ? (
              <Image
                source={{ uri: vehicle.images[0].secureUrl }}
                style={styles.vehicleImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.vehicleImage} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleName}>
                {vehicle?.vehicleModel?.name || "Đang tải..."}
              </Text>

              <Text style={styles.vehicleSub}>
                Biển số: {vehicle?.licensePlate || "-"}
              </Text>

              <Text style={styles.vehicleSub}>
                Màu: {vehicle?.color || "-"}
              </Text>
            </View>
          </View>
        </View>


        {/* SUGGEST PRICE */}
        <TouchableOpacity
          style={styles.suggestBtn}
          onPress={showLoading}
        >
          <Ionicons name="sparkles-outline" size={16} />
          <Text style={styles.suggestText}>GỢI Ý GIÁ BÁN TỐI ƯU</Text>
        </TouchableOpacity>

        {/* SHARE SLIDER */}
        <View style={styles.card}>
          <Slider
            minimumValue={10}
            maximumValue={100}
            step={10}
            value={percent}
            onValueChange={(value) => setPercent(value)}
          />

          <Text style={styles.cardTitle}>
            Bán {percent}% ({percent / 10} phần)
          </Text>

          <Text style={styles.cardSub}>
            {percent / 10}/10 phần
          </Text>

          {percent < 10 && (
    <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
      Phải bán ít nhất 1 phần (10%)
    </Text>
  )}

        </View>

        {/* PRICE INPUT */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Giá bán cho 1 phần (10%)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Nhập giá tiền"
              keyboardType="numeric"
              value={price}
              onChangeText={(text) => {
  const rawNumber = text.replace(/\D/g, "");
  const formatted = formatCurrency(rawNumber);
  setPrice(formatted);
}}
            />
            <Text style={styles.currency}>VND</Text>
          </View>
        </View>


        {/* EXPIRED DATE */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Thời gian hết hạn</Text>

          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} />
            <Text style={styles.dateText}>
              {expiredDate.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={expiredDate}
              mode="date"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const newDate = new Date(expiredDate);
                  newDate.setFullYear(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                  );
                  setExpiredDate(newDate);

                  setTimeout(() => {
                    setShowTimePicker(true);
                  }, 200);
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={expiredDate}
              mode="time"
              is24Hour={true}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const newDate = new Date(expiredDate);
                  newDate.setHours(
                    selectedTime.getHours(),
                    selectedTime.getMinutes(),
                    0,
                    0
                  );
                  setExpiredDate(newDate);
                }
              }}
            />
          )}


        </View>

      </ScrollView>

      {/* SUBMIT */}
      <TouchableOpacity
        style={isValid ? styles.submitBtn : styles.submitBtnDisabled}
        disabled={!isValid}
        onPress={handleSubmit}
      >
        <Text
          style={isValid ? styles.submitText : styles.submitTextDisabled}
        >
          Đăng bán
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}
