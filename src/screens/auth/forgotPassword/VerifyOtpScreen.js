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
import {
    resendOtp,
    verifyResetCode,
} from "../../../services/auth/auth.service";

export default function VerifyOtpScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Huỷ thao tác",
        "Bạn có chắc muốn huỷ quá trình khôi phục mật khẩu?",
        [
          { text: "Không", style: "cancel" },
          { text: "Có", onPress: () => navigation.navigate("Login") },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = async () => {
    if (!code) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }

    try {
      await verifyResetCode({ email, code });
      navigation.navigate("ResetPassword", { email, code });
    } catch {
      Alert.alert("Lỗi", "Mã OTP không hợp lệ");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({
        email,
        type: "ResetPassword",
      });

      Alert.alert("Thành công", "Mã OTP mới đã được gửi");
      setSecondsLeft(120);
    } catch (err) {
      console.log("RESEND OTP ERROR:", err.response?.data);

      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Không gửi lại được mã OTP",
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Huỷ thao tác",
              "Bạn có chắc muốn huỷ quá trình khôi phục mật khẩu?",
              [
                { text: "Không", style: "cancel" },
                { text: "Có", onPress: () => navigation.navigate("Login") },
              ],
            )
          }
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Nhập mã OTP</Text>

        <TextInput
          placeholder="Mã OTP"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          style={styles.input}
        />

        <View style={{ alignItems: "center", marginBottom: 16 }}>
          {secondsLeft > 0 ? (
            <Text style={{ color: COLORS.gray }}>
              Gửi lại mã sau {secondsLeft}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                Gửi lại mã
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Xác nhận</Text>
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
