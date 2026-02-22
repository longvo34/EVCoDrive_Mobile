import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import EVLoading from "../../../../components/animation/EVLoading";
import COLORS from "../../../../constants/colors";
import styles from "./MyVehicleDetailScreen.styles";

export default function MyVehicleDetailScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <EVLoading visible={loading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết xe của tôi</Text>
        </View>

        {/* Car Image */}
        <Image
          source={{
            uri: "https://storage.googleapis.com/vinfast-data/vf7.jpg",
          }}
          style={styles.carImage}
        />

        {/* Vehicle Info */}
        <View style={styles.infoBox}>
          <Text style={styles.carName}>Vinfast VF7</Text>
          <Text style={styles.plate}>Biển số: 30A-123.45</Text>

          <View style={styles.statusRow}>
            <View style={styles.batteryBox}>
              <Ionicons name="battery-half" size={16} color={COLORS.gray} />
              <Text style={styles.grayText}>Vinhome Grand Park</Text>
            </View>

            <View style={styles.readyTag}>
              <Text style={styles.readyText}>Sẵn sàng đăng bán</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
<View style={styles.actionContainer}>
  {[
    { label: "Đặt xe", icon: "calendar-outline" },
    { label: "Hóa đơn", icon: "receipt-outline" },
    { label: "Biểu quyết", icon: "create-outline" },
    { label: "Xem thêm", icon: "menu-outline" },
  ].map((item, index) => (
    <View key={index} style={styles.actionItem}>
      <View style={styles.actionCircle}>
        <Ionicons name={item.icon} size={22} color={COLORS.white} />
      </View>
      <Text style={styles.actionText}>{item.label}</Text>
    </View>
  ))}
</View>

        {/* Wallet */}
<View style={styles.walletCard}>
  <View style={styles.walletHeader}>
    <View style={styles.walletIcon}>
      <Ionicons name="wallet-outline" size={20} color={COLORS.primary} />
    </View>
    <Text style={styles.walletTitle}>Ví quỹ chung</Text>
  </View>

  <Text style={styles.walletSub}>Số dư hiện tại</Text>
  <Text style={styles.walletAmount}>1.200.000đ</Text>

  <View style={styles.divider} />

  <View style={styles.transactionRow}>
    <View style={styles.transactionLeft}>
      <Ionicons name="cash-outline" size={18} color={COLORS.softGreen} />
      <View>
        <Text style={styles.transactionTitle}>Trả xe trễ giờ</Text>
        <Text style={styles.transactionDate}>Hôm nay 14:20</Text>
      </View>
    </View>
    <Text style={styles.plusMoney}>+ 200.000đ</Text>
  </View>

  <View style={styles.transactionRow}>
    <View style={styles.transactionLeft}>
      <Ionicons name="document-outline" size={18} color="#3b82f6" />
      <View>
        <Text style={styles.transactionTitle}>Phí quản lý</Text>
        <Text style={styles.transactionDate}>12/7/2025</Text>
      </View>
    </View>
    <Text style={styles.minusMoney}>- 500.000đ</Text>
  </View>
</View>

        {/* Stats */}
        <View style={styles.grid}>
  {[
    { label: "PIN", value: "82%", icon: "battery-half", color: "#16a34a" },
    { label: "ODO/năm", value: "2.500 km", icon: "speedometer-outline", color: "#3b82f6" },
    { label: "Số chuyến/năm", value: "42 lần", icon: "refresh-outline", color: "#f59e0b" },
    { label: "Tình trạng", value: "Tốt", icon: "build-outline", color: "#9333ea", highlight: true },
    { label: "Sở hữu", value: "20%", icon: "pie-chart-outline", color: "#ea580c" },
    { label: "Đồng sở hữu", value: "5 người", icon: "people-outline", color: "#e11d48" },
  ].map((item, index) => (
    <View key={index} style={styles.gridItem}>
      <Ionicons name={item.icon} size={22} color={item.color} />
      <Text style={styles.gridLabel}>{item.label}</Text>
      <Text
        style={[
          styles.gridValue,
          item.highlight && { color: COLORS.softGreen },
        ]}
      >
        {item.value}
      </Text>
    </View>
  ))}
</View>

        {/* Schedule */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lịch đặt xe</Text>

          <View style={styles.scheduleItemActive}>
            <Text style={styles.scheduleName}>Nguyễn Văn A</Text>
            <Text style={styles.scheduleStatus}>ĐANG SỬ DỤNG</Text>
          </View>

          <View style={styles.scheduleItem}>
            <Text>Trần Thị B</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}