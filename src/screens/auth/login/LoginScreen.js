import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { login } from "../../../services/auth/auth.service";
import { getAccessToken, saveTokens } from "../../../utils/authStorage";
import styles from "./LoginScreen.styles";

export default function LoginScreen({ setIsLoggedIn }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await login({ email, password });

      const { token, refreshToken, user } = res.data.data;

      console.log("USER:", user);

      if (!token || !refreshToken) {
        return;
      }

      await saveTokens({ token, refreshToken });

      const check = await getAccessToken();
      console.log("TOKEN AFTER SAVE:", check);

      await new Promise((r) => setTimeout(r, 100));
      setIsLoggedIn(true);
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      if (!err.response) {
        Alert.alert("Lỗi", "Không thể kết nối đến server");
        return;
      }

      const { status, data } = err.response;

      // 🔴 400 - Validation error (swagger)
      if (status === 400 && data?.errors?.Email) {
        Alert.alert("Lỗi", ERROR_MESSAGES.EMAIL_INVALID);
        return;
      }

      // 🔴 400 - Sai email / mật khẩu
      if (status === 400 && data?.message) {
        Alert.alert("Đăng nhập thất bại", data.message);
        return;
      }

      // 🔴 fallback
      Alert.alert("Lỗi", "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />

      <Text style={styles.title}>EVCoDrive</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
