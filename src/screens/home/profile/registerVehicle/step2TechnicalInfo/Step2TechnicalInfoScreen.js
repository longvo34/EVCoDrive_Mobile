import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../../../../constants/colors";
import styles from "./Step2TechnicalInfoScreen.styles";

export default function Step2TechnicalInfoScreen({ navigation, route }) {
  
  const { step1Data } = route.params;

   console.log("✅ Step2 nhận step1Data:", step1Data);


  const [form, setForm] = useState({
    power: "",
    torque: "",
    batteryCapacity: "",
    range: "",
    odometer: "",
    avgKmPerYear: "",
    dimension: "",
    weight: "",
    exteriorStatus: "",
    interiorStatus: "",
    motorStatus: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = () => {
  return Object.values(form).every(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  );
};

 const handleNext = () => {
  if (!isFormValid()) {
    alert("Vui lòng nhập đầy đủ tất cả thông tin");
    return;
  }

  console.log("➡️ Step2 gửi dữ liệu:");
  console.log("step1Data:", step1Data);
  console.log("step2Data:", form);

  navigation.navigate("VehicleStep3", {
    step1Data,
    step2Data: form,
  });
};

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký xe</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* STEP */}
      <View style={styles.stepRow}>
        <View style={styles.stepDot} />
        <View style={[styles.stepDot, styles.active]} />
        <View style={styles.stepDot} />
        <View style={styles.stepDot} />
      </View>

      <Text style={styles.stepText}>Bước 2/4</Text>
      <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subTitle}>⚡ Hiệu suất & Pin</Text>

        <View style={styles.row2}>
          <Input
            placeholder="Công suất (kW)"
            onChangeText={(v) => handleChange("power", v)}
          />
          <Input
            placeholder="Mô-men xoắn (Nm)"
            onChangeText={(v) => handleChange("torque", v)}
          />
        </View>

        <View style={styles.row2}>
          <Input
            placeholder="Pin (kWh)"
            onChangeText={(v) => handleChange("batteryCapacity", v)}
          />
          <Input
            placeholder="Quãng đường (km)"
            onChangeText={(v) => handleChange("range", v)}
          />
        </View>

        <Text style={styles.subTitle}>🕘 Lịch sử vận hành</Text>
        <Input
          placeholder="ODO - số km đã đi"
          onChangeText={(v) => handleChange("odometer", v)}
        />
        <Input
          placeholder="Số km trung bình / năm"
          onChangeText={(v) => handleChange("avgKmPerYear", v)}
        />

        <Text style={styles.subTitle}>📦 Vật lý & Tình trạng</Text>

        <View style={styles.row2}>
          <Input
            placeholder="Kích thước (DxRxC)"
            onChangeText={(v) => handleChange("dimension", v)}
          />
          <Input
            placeholder="Trọng lượng (kg)"
            onChangeText={(v) => handleChange("weight", v)}
          />
        </View>

        <Input
          placeholder="Tình trạng ngoại thất"
          onChangeText={(v) => handleChange("exteriorStatus", v)}
        />
        <Input
          placeholder="Tình trạng nội thất"
          onChangeText={(v) => handleChange("interiorStatus", v)}
        />
        <Input
          placeholder="Hệ thống động cơ"
          onChangeText={(v) => handleChange("motorStatus", v)}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Tiếp tục →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
