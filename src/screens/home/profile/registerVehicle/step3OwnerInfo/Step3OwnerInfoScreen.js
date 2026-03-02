import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../../../constants/colors";
import { getUserProfile } from "../../../../../services/user/user.service";
import styles from "./Step3OwnerInfoScreen.styles";

export default function Step3OwnerInfoScreen({ navigation, route }) {
  const { step1Data, step2Data } = route.params || {};

console.log("📥 Step3 nhận step1Data:", step1Data);
console.log("📥 Step3 nhận step2Data:", step2Data);

const [form, setForm] = useState({
  fullName: "",
  address: "",
  phone: "",
  email: "",

});

const [documents, setDocuments] = useState({
  cavet: true,       
  inspection: false,
  insurance: false,
});

const validate = () => {
  if (
    !form.fullName.trim() ||
    !form.address.trim() ||
    !form.phone.trim() ||
    !form.email.trim() 
   
  ) {
    alert("Vui lòng điền đầy đủ thông tin chủ xe");
    return false;
  }

  if (!documents.cavet) {
    alert("Vui lòng xác nhận đầy đủ giấy tờ xe");
    return false;
  }

  return true;
};

useEffect(() => {
  fetchProfile();
}, []);

const fetchProfile = async () => {
  try {
    const res = await getUserProfile();

    const profile = res.data?.data;

    console.log("👤 PROFILE:", profile);

    setForm({
      fullName: profile.fullName || "",
      address: profile.address || "",
      phone: profile.phone || "",
      email: profile.email || "",
      identityCode: profile.identityCode || "",
    });
  } catch (e) {
    console.log("❌ GET PROFILE ERROR:", e);
  }
};


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đăng ký xe</Text>
      </View>

      {/* Step */}
      <View style={styles.stepRow}>
        <View style={[styles.stepDot, styles.active]} />
        <View style={[styles.stepDot, styles.active]} />
        <View style={[styles.stepDot, styles.active]} />
        <View style={styles.stepDot} />
      </View>
      <Text style={styles.stepText}>Bước 3/4</Text>

      <Text style={styles.sectionTitle}>Thông tin chủ xe</Text>

      <TextInput
  style={styles.input}
  value={form.fullName}
  onChangeText={(v) => setForm({ ...form, fullName: v })}
/>

<TextInput
  style={styles.input}
  value={form.address}
  onChangeText={(v) => setForm({ ...form, address: v })}
/>

<TextInput
  style={styles.input}
  keyboardType="phone-pad"
  value={form.phone}
  onChangeText={(v) => setForm({ ...form, phone: v })}
/>

<TextInput
  style={styles.input}
  keyboardType="email-address"
  value={form.email}
  onChangeText={(v) => setForm({ ...form, email: v })}
/>

      <View style={styles.field}>
        <Text style={styles.label}>CCCD</Text>
        <TextInput style={styles.input} keyboardType="numeric" />
      </View>

     <Text style={styles.sectionTitle}>Trạng thái giấy tờ xe</Text>

<CheckBox
  label="Cà vẹt xe"
  checked={documents.cavet}
  required
  disabled
/>

<CheckBox
  label="Đăng kiểm"
  checked={documents.inspection}
  onPress={() =>
    setDocuments({
      ...documents,
      inspection: !documents.inspection,
    })
  }
/>

<CheckBox
  label="Bảo hiểm xe"
  checked={documents.insurance}
  onPress={() =>
    setDocuments({
      ...documents,
      insurance: !documents.insurance,
    })
  }
/>

      {/* Footer */}
      <View style={styles.footerCenter}>
      <TouchableOpacity
  style={styles.nextBtn}
  onPress={() => {
    if (!validate()) return;

    navigation.navigate("VehicleStep4", {
      step1Data,
      step2Data,
      step3Data: {
        ...form,
        documents,
      },
    });
  }}
>
  <Text style={styles.nextText}>Tiếp tục →</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function CheckBox({ checked, label, required, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.checkItem}
    >
      <Text>
        {checked ? "✔" : "◻"} {label}
      </Text>

      {required && <Text style={styles.required}>Bắt buộc</Text>}
    </TouchableOpacity>
  );
}