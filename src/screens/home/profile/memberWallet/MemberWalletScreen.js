import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    FlatList,
    Modal,

    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EVLoading from "../../../../components/animation/EVLoading";
import styles from "./MemberWalletScreen.styles";


export default function MemberWalletScreen() {
    const [balance, setBalance] = useState(12500000);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState("topup");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();



    const transactions = [
        { id: "1", type: "Top Up", amount: 2000000, date: "12/02/2026" },
        { id: "2", type: "Buy Share", amount: -5000000, date: "10/02/2026" },
        { id: "3", type: "Withdraw", amount: -1000000, date: "05/02/2026" },
    ];

    const openModal = (type) => {
        setActionType(type);
        setModalVisible(true);
    };

    const handleConfirm = () => {
        setModalVisible(false);
        setLoading(true);

        // giả lập xử lý (sau này thay bằng API)
        setTimeout(() => {
            setLoading(false);
            setAmount("");
        }, 1500);
    };

    const renderItem = ({ item }) => (
        <View style={styles.transactionItem}>
            <View>
                <Text style={styles.transactionType}>{item.type}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>

            <Text
                style={[
                    styles.transactionAmount,
                    { color: item.amount > 0 ? "green" : "red" },
                ]}
            >
                {item.amount > 0 ? "+" : ""}
                {item.amount.toLocaleString()} đ
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* ✅ Loading Animation */}
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

            {/* Balance Card */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
                <Text style={styles.balanceAmount}>
                    {balance.toLocaleString()} đ
                </Text>
            </View>

            {/* Action Buttons */}
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

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Lịch sử</Text>
                </TouchableOpacity>
            </View>

            {/* Transaction List */}
            <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
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
