import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
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
  updateUserAvatar,
  updateUserProfile,
} from "../../../../services/user/user.service";
import styles from "./ProfileDetailScreen.styles";

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

export default function ProfileDetailScreen({ navigation, route }) {
  const ekycData = route.params?.ekycData;
  const onProfileUpdated = route.params?.onProfileUpdated;
const [avatar, setAvatar] = useState(null);
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
      
      if (typeof onProfileUpdated === "function") {
        onProfileUpdated();
      }
    
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

 const pickAvatar = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
  });

  if (!result.canceled) {
    const file = result.assets[0];

    // normalize uri for iOS (strip file://) and Android keeps as is
    const uri =
      Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri;

    const formData = new FormData();

    formData.append("file", {
      uri,
      name: file.fileName || "avatar.jpg",
      // expo returns `type` rather than `mimeType` in some versions
      type: file.mimeType || file.type || "image/jpeg",
    });

    try {
      await updateUserAvatar(formData);
      setAvatar(file);

      Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      if (error.response) {
        console.log("SERVER ERROR:", error.response.data);
        console.log("STATUS:", error.response.status);
      } else if (error.request) {
        console.log("NO RESPONSE FROM SERVER");
      } else {
        console.log("AXIOS ERROR:", error.message);
      }

      Alert.alert("Lỗi", "Upload avatar thất bại");
    }
  }
};

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

        <Label text="Ảnh đại diện" />

<View style={{ alignItems: "center", marginTop: 10 }}>
  {avatar ? (
    <Image
      source={{ uri: avatar.uri }}
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
      }}
    />
  ) : (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Ionicons name="person" size={40} color="#777" />
    </View>
  )}

  <TouchableOpacity
    style={{
      backgroundColor: COLORS.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 6,
    }}
    onPress={pickAvatar}
  >
    <Text style={{ color: "#fff" }}>Chọn ảnh</Text>
  </TouchableOpacity>
</View>

        <View style={{ height: 80 }} />
      </ScrollView>

     <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.smallBtn} 
          onPress={() => navigation.navigate("EKYC", { fromProfile: true })}
        >
          <Text style={styles.smallBtnText}>Chụp lại CCCD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={handleSubmit}
        >
          <Text style={styles.smallBtnText}>Lưu</Text>
        </TouchableOpacity>
      </View>
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