import { useEffect, useState } from "react";
import {
    Alert,
    BackHandler,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../../constants/colors";
import { resetPassword } from "../../../services/auth/auth.service";

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, code } = route.params;
  const [password, setPassword] = useState("");

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Huỷ thao tác", "Bạn có chắc muốn huỷ đổi mật khẩu?", [
        { text: "Không", style: "cancel" },
        { text: "Có", onPress: () => navigation.navigate("Login") },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleReset = async () => {
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await resetPassword({ email, code, newPassword: password });
      Alert.alert("Thành công", "Đổi mật khẩu thành công", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch {
      Alert.alert("Lỗi", "Không đổi được mật khẩu");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Huỷ thao tác", "Bạn có chắc muốn huỷ đổi mật khẩu?", [
              { text: "Không", style: "cancel" },
              { text: "Có", onPress: () => navigation.navigate("Login") },
            ])
          }
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Mật khẩu mới</Text>

        <TextInput
          placeholder="Nhập mật khẩu mới"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Hoàn tất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  backText: {
    color: COLORS.text,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.black,
    fontWeight: "600",
  },
});
