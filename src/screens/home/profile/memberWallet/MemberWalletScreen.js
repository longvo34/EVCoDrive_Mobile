import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
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
import { createWallet, getWalletByMemberId, getWithdrawalsByMemberId, topUpWallet, withdrawWallet, } from "../../../../services/memberWallet/memberWallet.service";
import { getProfileMember } from "../../../../services/profile/profile.service";
import styles from "./MemberWalletScreen.styles";

export default function MemberWalletScreen() {
  const navigation = useNavigation();

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

const initData = async () => {
  console.log("========== INIT DATA ==========");

  try {
    setLoading(true);
    console.log("🔄 Loading profile...");

    const profileRes = await getProfileMember();
    console.log("✅ PROFILE RESPONSE:", profileRes.data);

    const profile = profileRes.data;

    if (!profile?.memberId) {
      console.log("❌ Không có memberId trong profile");
      Alert.alert("Lỗi", "Không tìm thấy memberId");
      return;
    }

    console.log("✅ memberId:", profile.memberId);

    setMemberId(profile.memberId);

    await loadWallet(profile.memberId);

    console.log("✅ INIT DATA SUCCESS");
  } catch (error) {
    console.log("❌ INIT ERROR:");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);

    Alert.alert("Lỗi", "Không thể tải dữ liệu ví");
  } finally {
    setLoading(false);
    console.log("========== END INIT ==========");
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

  console.log("========== TRANSACTION ==========");
  console.log("Type:", actionType);
  console.log("Amount:", amount);
  console.log("MemberId:", memberId);

  try {
    setLoading(true);
    setModalVisible(false);

    const payload = {
      memberId: memberId,
      amount: Number(amount),
    };

    console.log("📦 Payload:", payload);

    if (actionType === "topup") {
      console.log("🔄 Calling topUpWallet...");
      const res = await topUpWallet(payload);
      console.log("✅ TOPUP SUCCESS:", res.data);
    } else {
      console.log("🔄 Calling withdrawWallet...");
      const res = await withdrawWallet(payload);
      console.log("✅ WITHDRAW SUCCESS:", res.data);
    }

    await loadWallet(memberId);
    setAmount("");

    console.log("✅ TRANSACTION SUCCESS");
  } catch (error) {
    console.log("❌ TRANSACTION ERROR:");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);

    Alert.alert("Lỗi", "Giao dịch thất bại");
  } finally {
    setLoading(false);
    console.log("========== END TRANSACTION ==========");
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
              placeholder="Nhập số tiền"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
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
