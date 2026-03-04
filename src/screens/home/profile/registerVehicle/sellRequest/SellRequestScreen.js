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
import { confirmPriceSuggestion, suggestPrice } from "../../../../../services/priceSuggestion/priceSuggestion.service";
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
  const [explanation, setExplanation] = useState("");


  useEffect(() => {
    fetchVehicleDetail();
  }, []);

  const fetchVehicleDetail = async () => {
  try {
    setLoading(true);

    const res = await getVehicleById(vehicleId);

    console.log("FULL RESPONSE:", res);
    console.log("RESPONSE DATA:", res.data);

    const vehicleData = res.data?.data || res.data;

    console.log("Vehicle detail parsed:", vehicleData);

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

    const rawPrice = Number(price.replace(/\./g, ""));
    if (explanation) {
      await confirmPriceSuggestion(rawPrice, {
        carInfo: {
          model: vehicle.vehicleModel?.name || "",
          brand: vehicle.vehicleModel?.brandName || "",
          year: vehicle.year,
          odometer: vehicle.odometer,
          batteryHealth: vehicle.batteryHealth,
          location: vehicle.currentStation?.address || "",
        },
        fraction: percent / 10,
        daysPerYear: 30,
        kmLimitPerYear: 2000,
      });
    }

    const payload = {
      vehicleId,
      totalShares: percent / 10,
      pricePerShare: rawPrice,
      expiredDate: expiredDate.toISOString(),
    };

    await createSellRequest(payload);

    Alert.alert("Thành công", "Đăng bán thành công!", [
      {
        text: "OK",
        onPress: () => {
          navigation.getParent()?.navigate("ProfileMyVehicle");
        },
      },
    ]);

  } catch (error) {
    console.log("Submit error:", error.response?.data || error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Không thể tạo yêu cầu bán"
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

const handleSuggestPrice = async () => {
  try {
    if (!vehicle) {
      Alert.alert("Lỗi", "Chưa tải xong thông tin xe");
      return;
    }

    setLoading(true);

    const body = {
      carInfo: {
        model: vehicle.vehicleModel?.name || "",
        brand: vehicle.vehicleModel?.brandName || "", 
        year: vehicle.year,
        odometer: vehicle.odometer,
        batteryHealth: vehicle.batteryHealth,
        location: vehicle.currentStation?.address || "", 
      },
      fraction: percent / 10,
      daysPerYear: 30,
      kmLimitPerYear: 2000,
    };

    console.log("Body gửi AI:", body);

   const res = await suggestPrice(body);

console.log("RAW RESPONSE:", res);
console.log("RES.DATA:", res.data);

const responseData = res.data?.data || res.data;

console.log("PARSED DATA:", responseData);

const suggestedPrice = responseData?.suggestedPrice;
const explanationText = responseData?.explanation;

if (suggestedPrice) {
  const formatted = formatCurrency(String(suggestedPrice));
  setPrice(formatted);
}

if (explanationText) {
  setExplanation(explanationText);
}

  } catch (error) {
    console.log("Suggest price error:", error.response?.data);
    Alert.alert("Lỗi", "Không thể gợi ý giá lúc này");
  } finally {
    setLoading(false);
  }
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
          onPress={handleSuggestPrice}
        >
          <Ionicons name="sparkles-outline" size={16} />
          <Text style={styles.suggestText}>GỢI Ý GIÁ BÁN TỐI ƯU</Text>
        </TouchableOpacity>

        {explanation ? (
  <View style={styles.aiBox}>
    <Ionicons name="information-circle-outline" size={16} color="#555" />
    <Text style={styles.aiText}>{explanation}</Text>
  </View>
) : null}

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
