import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EVLoading from "../../../../components/animation/EVLoading";
import { createWallet, getWalletByMemberId, getWithdrawalsByMemberId, withdrawWallet } from "../../../../services/memberWallet/memberWallet.service";
import { createPaymentUrl } from "../../../../services/payment/payment.service";
import { getProfileMember } from "../../../../services/profile/profile.service";
import styles from "./MemberWalletScreen.styles";

export default function MemberWalletScreen() {
  const navigation = useNavigation();

  const MIN_PRICE = 10000;
  const MAX_PRICE = 100000000;

  const formatCurrency = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [memberId, setMemberId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState("topup");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  console.log("🚀 MemberWalletScreen mounted");
  initData();
}, []);

useFocusEffect(
  useCallback(() => {
    if (memberId) {
      console.log("🔄 Screen focus → reload wallet");
      loadWallet(memberId);
    }
  }, [memberId])
);

const initData = async () => {
  try {
    setLoading(true);

    const profileRes = await getProfileMember();
    const profile = profileRes.data;

    if (!profile?.memberId) {
      Alert.alert("Lỗi", "Không tìm thấy memberId");
      return;
    }

    setMemberId(profile.memberId);

  } catch (error) {
    console.log("INIT ERROR:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


const loadWallet = async (id) => {
  console.log("========== LOAD WALLET ==========");
  console.log("🔎 MemberId:", id);

  try {
    let walletData = null;

    try {
      console.log("🔄 Đang gọi getWalletByMemberId...");
      const walletRes = await getWalletByMemberId(id);

      console.log("✅ GET WALLET SUCCESS:", walletRes.data);
      walletData = walletRes.data?.data;
    } catch (error) {
      console.log("⚠️ GET WALLET ERROR:");
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      if (error.response?.status === 404) {
        console.log("🆕 Wallet chưa tồn tại → tạo mới...");

        const createRes = await createWallet(id);
        console.log("✅ CREATE WALLET SUCCESS:", createRes.data);

        const walletRes = await getWalletByMemberId(id);
        console.log("✅ GET WALLET AFTER CREATE:", walletRes.data);

        walletData = walletRes.data;
      } else {
        throw error;
      }
    }

    console.log("💰 Balance:", walletData?.balance);
    setBalance(walletData?.balance || 0);

    console.log("🔄 Đang load withdrawals...");
    const withdrawRes = await getWithdrawalsByMemberId(id);

    console.log("✅ WITHDRAW HISTORY:", withdrawRes.data);

    setTransactions(withdrawRes.data?.data || []);

    console.log("✅ LOAD WALLET SUCCESS");
  } catch (error) {
    console.log("❌ LOAD WALLET FAILED:");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);

    Alert.alert("Lỗi", "Không thể tải ví");
  }

  console.log("========== END LOAD WALLET ==========");
};

const handleConfirm = async () => {
  if (!amount || !memberId) {
    console.log("❌ Missing amount or memberId");
    return;
  }

  const amountNum = Number(amount.replace(/\./g, ""));
  if (isNaN(amountNum) || amountNum <= 0) {
    Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
    return;
  }
  if (amountNum < MIN_PRICE) {
    Alert.alert("Lỗi", `Số tiền tối thiểu là ${MIN_PRICE.toLocaleString("vi-VN")} đ`);
    return;
  }
  if (amountNum > MAX_PRICE) {
    Alert.alert("Lỗi", `Số tiền tối đa là ${MAX_PRICE.toLocaleString("vi-VN")} đ`);
    return;
  }

  try {
    setLoading(true);
    setModalVisible(false);

    if (actionType === "topup") {
      console.log("🔄 Creating VNPay payment...");

      const payload = {
        memberId: memberId,
        amount: amountNum,
      };

      const res = await createPaymentUrl(payload);

      console.log("✅ CREATE PAYMENT RESPONSE:", res.data);

      const paymentUrl = res.data?.data?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Không nhận được paymentUrl");
      }

      console.log("🌐 Opening VNPay sandbox...");
      await Linking.openURL(paymentUrl);
    } else {
      const payload = {
        memberId: memberId,
        amount: amountNum,
      };

      const res = await withdrawWallet(payload);
      console.log("✅ WITHDRAW SUCCESS:", res.data);

      await loadWallet(memberId);
    }

    setAmount("");
  } catch (error) {
    console.log("❌ TRANSACTION ERROR:");
    console.log(error.response?.data || error.message);

    Alert.alert("Lỗi", "Giao dịch thất bại");
  } finally {
    setLoading(false);
  }
};


  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionType}>
          {item.type || "Withdraw"}
        </Text>
        <Text style={styles.transactionDate}>
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : ""}
        </Text>
      </View>

      <Text
        style={[
          styles.transactionAmount,
          { color: item.amount > 0 ? "green" : "red" },
        ]}
      >
        {item.amount > 0 ? "+" : ""}
        {item.amount?.toLocaleString()} đ
      </Text>
    </View>
  );

  const openModal = (type) => {
  setActionType(type);
  setModalVisible(true);
};

  return (
    <SafeAreaView style={styles.container}>
      <EVLoading visible={loading} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Ví của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
        <Text style={styles.balanceAmount}>
          {balance.toLocaleString()} đ
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openModal("topup")}
        >
          <Text style={styles.actionText}>Nạp tiền</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openModal("withdraw")}
        >
          <Text style={styles.actionText}>Rút tiền</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <Text style={styles.sectionTitle}>Lịch sử rút tiền</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {actionType === "topup" ? "Nạp tiền" : "Rút tiền"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="10.000 - 100.000.000 đ"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                const rawNumber = text.replace(/\D/g, "");
                if (rawNumber === "") {
                  setAmount("");
                } else {
                  const numValue = Number(rawNumber);
                  if (numValue <= MAX_PRICE) {
                    const formatted = formatCurrency(rawNumber);
                    setAmount(formatted);
                  }
                }
              }}
              maxLength={15}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#fff" }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={{ color: "#fff" }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
