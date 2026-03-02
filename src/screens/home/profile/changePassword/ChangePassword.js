import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { changePassword } from "../../../../services/auth/auth.service";
import { clearTokens } from "../../../../utils/authStorage";
import styles from "./ChangePassword.styles";

export default function ChangePasswordScreen({ navigation, setIsLoggedIn }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ");
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      await clearTokens();

      Alert.alert(
        "Thành công",
        "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
        [
          {
            text: "OK",
            onPress: () => {
              setIsLoggedIn(false);
            },
          },
        ],
      );
    } catch (err) {
      Alert.alert("Lỗi", "Mật khẩu hiện tại không đúng");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Đổi mật khẩu</Text>

      <TextInput
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        placeholder="Mật khẩu mới"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
