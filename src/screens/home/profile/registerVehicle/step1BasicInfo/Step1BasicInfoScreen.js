import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateTimePicker from "@react-native-community/datetimepicker";
import COLORS from "../../../../../constants/colors";
import { getRecommendedStations } from "../../../../../services/station/station.service";
import { getUserProfile } from "../../../../../services/user/user.service";
import { getVehicleBrands } from "../../../../../services/vehicleBrand/vehicleBrand.service";
import { getVehicleModels } from "../../../../../services/vehicleModel/vehicleModel.service";
import styles from "./Step1BasicInfoScreen.styles";

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

export default function Step1BasicInfoScreen({ navigation }) {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [stations, setStations] = useState([]);

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showRegisterYearPicker, setShowRegisterYearPicker] = useState(false);
  const [showMaintenancePicker, setShowMaintenancePicker] = useState(false);
  const [maintenanceDate, setMaintenanceDate] = useState(new Date());

  const [form, setForm] = useState({
    vehicleBrand: null,
    vehicleModel: null,
    station: null,
    yearManufacture: "",
    licensePlate: "",
    exteriorColor: "",
    odometer: "",
    batteryHealth: "",
    lastMaintenanceDate: "",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1970 + 1 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchInitData = async () => {
  try {
    const profileRes = await getUserProfile();
    
    // Log toàn bộ response để xem chính xác
    console.log("=== FULL PROFILE RESPONSE ===");
    console.log("Status:", profileRes.status);
    console.log("Data:", JSON.stringify(profileRes.data, null, 2));
    console.log("Data keys:", Object.keys(profileRes.data || {}));
    if (profileRes.data?.data) {
      console.log("Nested data keys:", Object.keys(profileRes.data.data));
    }

    // Thử lấy id từ nhiều vị trí có thể
    const possibleIds = [
      profileRes.data?.id,
      profileRes.data?.data?.id,           // nếu response là { data: { id: ... } }
      profileRes.data?.userId,
      profileRes.data?.data?.userId,
      profileRes.data?.memberId,
      profileRes.data?.data?.memberId,
    ];

    const userId = possibleIds.find(id => id && typeof id === 'string' && id.trim() !== '');

    console.log("Extracted userId (tìm thấy):", userId || "KHÔNG TÌM THẤY");

    if (!userId) {
      Alert.alert("Lỗi profile", "Không tìm thấy ID người dùng. Vui lòng kiểm tra đăng nhập.");
      return; // dừng lại, không gọi API khác
    }

    const [brandRes, modelRes, stationRes] = await Promise.all([
      getVehicleBrands(),
      getVehicleModels(),
      getRecommendedStations(userId),
    ]);

    setBrands(brandRes.data.data || []);
    setModels(modelRes.data.data || []);
    setStations(stationRes.data.data || []);

  } catch (e) {
    console.error("FETCH ERROR:", e.message);
    if (e.response) {
      console.error("API Error Response:", e.response.data);
    }
    Alert.alert("Lỗi", "Không tải được dữ liệu. Vui lòng thử lại sau.");
  }
};

  const filteredModels = form.vehicleBrand
    ? models.filter(
        (m) =>
          m.vehicleBrand?.vehicleBrandId === form.vehicleBrand?.vehicleBrandId
      )
    : [];

  const hasModels = filteredModels.length > 0;

  const registerYears = form.yearManufacture
    ? years.filter((y) => y >= Number(form.yearManufacture))
    : [];

  const onNext = () => {
    if (!form.vehicleBrand) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn hãng xe");
      return;
    }

    if (!form.station) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn trạm sạc");
      return;
    }

    if (!form.vehicleModel) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn dòng xe");
      return;
    }

    if (!form.yearManufacture) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn năm sản xuất");
      return;
    }

    if (!form.licensePlate) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập biển số xe");
      return;
    }

    if (!form.exteriorColor) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập màu xe");
      return;
    }

    if (form.licensePlate.length < 5 || form.licensePlate.length > 20) {
      Alert.alert(
        "Thông tin không hợp lệ",
        "Biển số xe phải từ 5 đến 20 ký tự"
      );
      return;
    }

    if (form.batteryHealth !== "") {
      const batteryNum = Number(form.batteryHealth);

      if (batteryNum < 0) {
        Alert.alert("Thông tin không hợp lệ", "Tình trạng pin không được âm");
        return;
      }

      if (batteryNum > 100) {
        Alert.alert(
          "Thông tin không hợp lệ",
          "Tình trạng pin không được vượt quá 100%"
        );
        return;
      }
    }

    navigation.navigate("VehicleStep4", {
      step1Data: {
        vehicleModelId: form.vehicleModel.vehicleModelId,
        stationId: form.station.stationId,
        licensePlate: form.licensePlate,
        color: form.exteriorColor,
        year: Number(form.yearManufacture),
        odometer: toNumberOrNull(form.odometer),
        batteryHealth: toNumberOrNull(form.batteryHealth),
        lastMaintenanceDate: form.lastMaintenanceDate || null,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký xe</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.stepRow}>
        <View style={[styles.stepDot, styles.active]} />
        <View style={styles.stepDot} />
      </View>

      <Text style={styles.stepText}>Bước 1/2</Text>

      <Text style={styles.sectionTitle}>Thông tin cơ bản của xe</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Label text="Hãng xe" />
        <DropdownInput
          value={form.vehicleBrand?.name || "Chọn hãng xe"}
          onPress={() => setShowBrandModal(true)}
        />

        <Label text="Dòng xe" />
        <DropdownInput
          disabled={!form.vehicleBrand || !hasModels}
          value={
            !form.vehicleBrand
              ? "Chọn hãng xe trước"
              : !hasModels
              ? "Hãng này chưa có dòng xe"
              : form.vehicleModel?.name || "Chọn dòng xe"
          }
          onPress={() => {
            if (!hasModels) return;
            setShowModelModal(true);
          }}
        />

        <Label text="Trạm sạc đăng ký xe" />
        <DropdownInput
          value={
            form.station
              ? `${form.station.name} • ${form.station.distanceKm || "?"} km`
              : "Chọn trạm sạc"
          }
          onPress={() => setShowStationModal(true)}
        />

        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <Label text="Năm sản xuất" />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowYearPicker(true)}
            >
              <Text
                style={{
                  color: form.yearManufacture ? COLORS.black : COLORS.gray,
                }}
              >
                {form.yearManufacture || "Chọn năm"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Label text="Biển số xe" />
        <Input
          placeholder="30A-123.45"
          value={form.licensePlate}
          onChangeText={(v) => setForm({ ...form, licensePlate: v })}
        />

        <Label text="Màu ngoại thất" />
        <Input
          placeholder="Nhập màu sơn xe"
          value={form.exteriorColor}
          onChangeText={(v) => setForm({ ...form, exteriorColor: v })}
        />

        <Label text="ODO (km đã đi)" />
        <Input
          placeholder="Ví dụ: 25000"
          keyboardType="number-pad"
          value={form.odometer}
          onChangeText={(v) => {
            const cleaned = v.replace(/[^0-9]/g, "");
            setForm({ ...form, odometer: cleaned });
          }}
        />

        <Label text="Tình trạng pin (%)" />
        <Input
          placeholder="Ví dụ: 90"
          keyboardType="number-pad"
          value={form.batteryHealth}
          onChangeText={(v) => {
            let cleaned = v.replace(/[^0-9]/g, "");
            if (cleaned !== "") {
              const num = Number(cleaned);
              if (num > 100) cleaned = "100";
            }
            setForm({ ...form, batteryHealth: cleaned });
          }}
        />

        <Label text="Ngày bảo dưỡng gần nhất" />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowMaintenancePicker(true)}
        >
          <Text
            style={{
              color: form.lastMaintenanceDate ? COLORS.black : COLORS.gray,
            }}
          >
            {form.lastMaintenanceDate
              ? new Date(form.lastMaintenanceDate).toLocaleDateString("vi-VN")
              : "Chọn ngày"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
        <Text style={styles.nextText}>Tiếp tục →</Text>
      </TouchableOpacity>

      {/* Modal chọn hãng xe */}
      <SelectModal
        visible={showBrandModal}
        data={brands}
        labelKey="name"
        onClose={() => setShowBrandModal(false)}
        onSelect={(item) => {
          setForm({
            ...form,
            vehicleBrand: item,
            vehicleModel: null,
          });
          setShowBrandModal(false);
        }}
      />

      {/* Modal chọn dòng xe */}
      <SelectModal
        visible={showModelModal}
        data={filteredModels}
        labelKey="name"
        onClose={() => setShowModelModal(false)}
        onSelect={(item) => {
          setForm({ ...form, vehicleModel: item });
          setShowModelModal(false);
        }}
      />

      {/* Modal chọn trạm sạc */}
      <SelectModal
        visible={showStationModal}
        data={stations}
        labelKey="name"
        onClose={() => setShowStationModal(false)}
        onSelect={(item) => {
          setForm({ ...form, station: item });
          setShowStationModal(false);
        }}
      />

      {showYearPicker && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              maxHeight: 300,
            }}
          >
            <ScrollView>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => {
                    setForm({ ...form, yearManufacture: String(year) });
                    setShowYearPicker(false);
                  }}
                  style={{
                    padding: 14,
                    borderBottomWidth: 0.5,
                    borderColor: COLORS.gray,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}

      {showMaintenancePicker && (
        <DateTimePicker
          value={
            form.lastMaintenanceDate
              ? new Date(form.lastMaintenanceDate)
              : new Date()
          }
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowMaintenancePicker(false);
            if (selectedDate) {
              setForm({
                ...form,
                lastMaintenanceDate: selectedDate.toISOString(),
              });
            }
          }}
        />
      )}

      {showRegisterYearPicker && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowRegisterYearPicker(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              maxHeight: 300,
            }}
          >
            <ScrollView>
              {registerYears.map((year) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => {
                    setForm({ ...form, yearRegister: String(year) });
                    setShowRegisterYearPicker(false);
                  }}
                  style={{
                    padding: 14,
                    borderBottomWidth: 0.5,
                    borderColor: COLORS.gray,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

function Label({ text }) {
  return <Text style={styles.label}>{text}</Text>;
}

function Input(props) {
  return (
    <TextInput
      {...props}
      style={styles.input}
      placeholderTextColor={COLORS.gray}
    />
  );
}

function DropdownInput({ value, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.input,
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: disabled ? "#F2F2F2" : COLORS.white,
        },
      ]}
    >
      <Text style={{ color: disabled ? COLORS.gray : COLORS.text }}>
        {value}
      </Text>
      <Ionicons name="chevron-down" size={18} />
    </TouchableOpacity>
  );
}

function SelectModal({ visible, data, labelKey, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          padding: 24,
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 16,
            maxHeight: "70%",
          }}
          onPress={() => {}}
        >
          <ScrollView>
            {data.map((item) => (
              <TouchableOpacity
                key={item[labelKey] + Math.random()}
                onPress={() => onSelect(item)}
                style={{
                  padding: 14,
                  borderBottomWidth: 0.5,
                  borderColor: "#eee",
                }}
              >
                <Text>{item[labelKey]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}