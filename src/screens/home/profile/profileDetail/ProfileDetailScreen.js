import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EVLoading from "../../../../components/animation/EVLoading";
import COLORS from "../../../../constants/colors";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../../services/user/user.service";
import styles from "./ProfileDetailScreen.styles";

/* ================= NORMALIZE ================= */

const normalizeDOB = (dob) => {
  if (!dob) return undefined;
  if (dob.includes("-")) return dob;
  const [d, m, y] = dob.split("/");
  return `${y}-${m}-${d}`;
};

const normalizeGender = (sex) => {
  if (!sex) return undefined;
  const s = sex.toLowerCase();
  if (s === "male" || s.includes("nam")) return "Male";
  if (s === "female" || s.includes("nữ")) return "Female";
  return undefined;
};

/* ============================================= */

export default function ProfileDetailScreen({ navigation, route }) {
  const ekycData = route.params?.ekycData;
  const onProfileUpdated = route.params?.onProfileUpdated;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    homeTown: "",
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        if (ekycData) {
          setForm({
            fullName: ekycData.name || "",
            dateOfBirth: normalizeDOB(ekycData.dob) || "",
            gender: normalizeGender(ekycData.sex) || "",
            phone: "",
            address: ekycData.address || "",
            homeTown: ekycData.home || "",
          });
          return;
        }

        const res = await getUserProfile();
        const data = res.data.data;

        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          phone: data.phone || "",
          address: data.address || "",
          homeTown: data.homeTown || "",
        });
      } catch (err) {
        console.log("INIT ERROR:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        fullName: form.fullName,
        nationality: "VIỆT NAM",
      };

      if (form.phone) payload.phone = form.phone;
      if (form.dateOfBirth)
        payload.dateOfBirth = normalizeDOB(form.dateOfBirth);
      if (form.gender)
        payload.gender = normalizeGender(form.gender);
      if (form.homeTown) payload.homeTown = form.homeTown;
      if (form.address) payload.address = form.address;

      console.log("FINAL PAYLOAD:", payload);

      await updateUserProfile(payload);

      Alert.alert("Thành công", "Cập nhật profile thành công");
      
      // Notify RootNavigator to refetch profile
      if (typeof onProfileUpdated === "function") {
        onProfileUpdated();
      }
      
      // Pop back to ProfileMain; MainNavigator will re-render when forceProfileUpdate becomes false
      // and show all tabs. Use navigation.reset or goBack to return to profile stack root
      navigation.popToTop();
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err);
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Cập nhật thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <EVLoading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <Label text="Họ và tên" />
        <Input
          value={form.fullName}
          onChangeText={(v) => setForm({ ...form, fullName: v })}
        />

        <Label text="Email" />
<Input value={form.email} editable={false} />

        <Label text="Ngày sinh (YYYY-MM-DD)" />
        <Input
          value={form.dateOfBirth}
          onChangeText={(v) => setForm({ ...form, dateOfBirth: v })}
        />

        <Label text="Giới tính (Male / Female)" />
        <Input
          value={form.gender}
          onChangeText={(v) => setForm({ ...form, gender: v })}
        />

        <Label text="Số điện thoại" />
        <Input
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
        />

        <Label text="Quê quán" />
        <Input
          value={form.homeTown}
          onChangeText={(v) => setForm({ ...form, homeTown: v })}
        />

        <Label text="Địa chỉ" />
        <Input
          value={form.address}
          onChangeText={(v) => setForm({ ...form, address: v })}
        />
      </ScrollView>

      <TouchableOpacity style={styles.bottomBtn} onPress={handleSubmit}>
        <Text style={styles.bottomText}>Lưu</Text>
      </TouchableOpacity>
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
