import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EVLoading from "../../../components/animation/EVLoading";
import { getMySellRequests } from "../../../services/sellRequest/sellRequest.service";
import styles from "./MyVehicleScreen.styles";

const searchStyles = {
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    fontSize: 16,
    color: "#9ca3af",
  },
};

export default function MyVehicleScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);               
  const [filteredData, setFilteredData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    fetchData();

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMySellRequests(); 
      const rawData = res.data?.data || [];
      const sorted = [...rawData].sort((a, b) => {
        const priA = STATUS_ORDER.indexOf(a.status);
        const priB = STATUS_ORDER.indexOf(b.status);
        if (priA !== priB) return priA - priB;
        return new Date(b.createdDate) - new Date(a.createdDate);
      });

      setData(sorted);
      setFilteredData(sorted);
    } catch (error) {
      console.error("Lỗi fetch yêu cầu bán:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  useMemo(() => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();

    const filtered = data.filter((item) => {
      const brandModel = `${item.vehicleBrand || ""} ${item.vehicleModel || ""}`.toLowerCase();
      const plate = item.licensePlate?.toLowerCase() || "";
      return brandModel.includes(lowerQuery) || plate.includes(lowerQuery);
    });

    setFilteredData(filtered);
  }, [searchQuery, data]);

  const STATUS_ORDER = [
    "Published",
    "PartialSold",
    "Ended",
    "Completed",
    "Expired",
    "Cancelled",
  ];

  const STATUS_MAP = {
    Published: {
      text: "Đang bán",
      badge: styles.badgePublished,
      textStyle: styles.textPublished,
    },
    PartialSold: {
      text: "Bán một phần",
      badge: styles.badgePending,
      textStyle: styles.textPending,
    },
    Ended: {
      text: "Đã kết thúc",
      badge: styles.badgeRejected,
      textStyle: styles.textRejected,
    },
    Completed: {
      text: "Hoàn tất",
      badge: styles.badgePublished,
      textStyle: styles.textPublished,
    },
    Expired: {
      text: "Hết hạn",
      badge: styles.badgeRejected,
      textStyle: styles.textRejected,
    },
    Cancelled: {
      text: "Đã huỷ",
      badge: styles.badgeRejected,
      textStyle: styles.textRejected,
    },
  };

  const renderItem = ({ item }) => {
  const statusConfig = STATUS_MAP[item.status] || {
    text: item.status,
    badge: styles.badgeRejected,
    textStyle: styles.textRejected,
  };

  const formatExpiredDate = (dateStr) => {
    if (!dateStr) return "Chưa có hạn";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Hết hạn: ${day}/${month}/${year} ${hours}:${minutes}`;
  };


  const isExpired = item.expiredDate && new Date(item.expiredDate) < new Date();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() =>
        navigation.navigate("SellRequestDetail", {
          sellRequestId: item.sellRequestId,
        })
      }
    >
      <View style={styles.info}>
        <Text style={styles.name}>
          {item.vehicleBrand} {item.vehicleModel}
        </Text>

        <Text style={styles.plate}>Biển số: {item.licensePlate}</Text>

        <Text style={styles.share}>
          Bán: {item.totalShares} phần
        </Text>

        <Text style={styles.price}>
          {Number(item.pricePerShare).toLocaleString("vi-VN")} ₫ / phần
        </Text>

   
        <Text
          style={[
            styles.expiredDate, 
            isExpired && { color: "#ef4444" },
          ]}
        >
          {formatExpiredDate(item.expiredDate)}
        </Text>

        <View style={[styles.badge, statusConfig.badge]}>
          <Text style={[styles.badgeText, statusConfig.textStyle]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Yêu cầu bán của tôi</Text>

        {/* Thanh tìm kiếm */}
        <View style={searchStyles.searchContainer}>
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Tìm theo tên xe hoặc biển số..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={searchStyles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Text style={searchStyles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.sellRequestId}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#10b981"]}         
              tintColor="#10b981"
              progressBackgroundColor="#ffffff"
              title="Đang tải lại..."
              titleColor="#666"
            />
          }
          ListEmptyComponent={
            !loading && (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 40,
                  color: "#6b7280",
                  fontSize: 16,
                }}
              >
                {searchQuery
                  ? "Không tìm thấy yêu cầu nào phù hợp"
                  : "Không có yêu cầu bán nào"}
              </Text>
            )
          }
        />
      </View>

      <EVLoading visible={loading} />
    </View>
  );
}