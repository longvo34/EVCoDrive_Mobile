import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resendOtp, verifyEmail } from "../../../services/auth/auth.service";

export default function VerifyEmailScreen({ route, navigation }) {
  const { email } = route.params;

  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(120);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // ✅ Verify OTP
  const handleVerify = async () => {
    if (!code) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }

    try {
      setLoading(true);
      await verifyEmail({ email, code });

navigation.reset({
  index: 0,
  routes: [{ name: "Login" }],
});
    } catch (err) {
      Alert.alert("Lỗi", err.response?.data?.message || "OTP không đúng");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    try {
      setLoading(true);
      await resendOtp({ email, type: "Register" });
      Alert.alert("Thành công", "Đã gửi lại mã OTP");
      setSeconds(120); // reset countdown
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Không thể gửi lại OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegister = () => {
    Alert.alert(
      "Huỷ đăng ký",
      "Bạn có chắc chắn muốn huỷ quá trình đăng ký không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
         onPress: () => {
  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
}
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={handleCancelRegister}
          style={{ marginBottom: 16 }}
        >
          <Text style={{ color: "#111" }}>← Quay lại đăng nhập</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Nhập mã OTP
        </Text>

        <TextInput
          placeholder="Mã OTP"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 14,
            marginBottom: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          style={{
            backgroundColor: "#FFD600",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </Text>
        </TouchableOpacity>

        {/* ⏳ Countdown / Resend */}
        {seconds > 0 ? (
          <Text style={{ marginTop: 16, textAlign: "center", color: "#666" }}>
            Gửi lại mã sau {seconds}s
          </Text>
        ) : (
          <TouchableOpacity
            onPress={handleResend}
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#007AFF",
                fontWeight: "bold",
              }}
            >
              Gửi lại mã
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
