import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EVLoading from "../../../../components/animation/EVLoading";
import { getBuyRequestById } from "../../../../services/buyRequest/buyRequest.service";
import styles from "./BuyRequestDetailScreen.styles";


export default function BuyRequestDetailScreen({ route }) {
  const { buyRequestId } = route.params;
const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getBuyRequestById(buyRequestId);
      setData(res.data?.data);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message ||
          "Không thể tải chi tiết yêu cầu mua"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Proccessing":
      case "Processing":
        return "Chờ duyệt";
      case "Completed":
      case "Complete":
        return "Hoàn thành";
      case "Cancelled":
      case "Cancel":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (!data) return <EVLoading visible={true} />;

  return (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 15 }}
      >
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>

      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.title}>{data.groupName}</Text>

        <Text style={styles.plate}>
          Biển số: {data.vehicleLicensePlate}
        </Text>

        <Text style={styles.price}>
          {data.totalPrice?.toLocaleString()} {data.currency}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Số lượng</Text>
          <Text style={styles.metaValue}>{data.quantity}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {getStatusLabel(data.status)}
          </Text>
        </View>
      </View>

      {/* Share list */}
      <Text style={styles.sectionTitle}>
        Danh sách cổ phần
      </Text>

      {data.requestedShares?.map((share) => (
        <View
          key={share.buyRequestDetailId}
          style={styles.shareCard}
        >
          <Text style={styles.shareNumber}>
            Phần số {share.shareUnitDisplayNumber}
          </Text>

          <Text style={styles.sharePrice}>
            {share.price?.toLocaleString()} VND
          </Text>

          <Text style={styles.shareStatus}>
            {share.status}
          </Text>
        </View>
      ))}

    </ScrollView>

    <EVLoading visible={loading} />
  </View>
);

}
