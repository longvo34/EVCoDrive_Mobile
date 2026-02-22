import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EVLoading from "../../../../components/animation/EVLoading";
import COLORS from "../../../../constants/colors";
import { getMySellRequests } from "../../../../services/sellRequest/sellRequest.service";

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

export default function ProfileMyVehicleScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMySellRequests();

      const rawData = (res?.data?.data?.items || []).filter(
        (item) => item.status !== "Cancelled"
      );

      const STATUS_ORDER = [
        "Published",
        "PartialSold",
        "Ended",
        "Completed",
        "Expired",
        "Cancelled",
      ];

      const sorted = Array.isArray(rawData)
        ? [...rawData].sort((a, b) => {
            const priA = STATUS_ORDER?.indexOf?.(a.status) ?? 999;
            const priB = STATUS_ORDER?.indexOf?.(b.status) ?? 999;

            if (priA !== priB) return priA - priB;

            return (
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
            );
          })
        : [];

      setData(sorted);
      setFilteredData(sorted);
    } catch (error) {
      console.log("Error fetching sell requests:", error);
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

  const STATUS_MAP = {
    Published: {
      text: "Đang bán",
      badge: { backgroundColor: "#ecfdf5" },
      textStyle: { color: "#10b981" },
    },
    PartialSold: {
      text: "Bán một phần",
      badge: { backgroundColor: "#fffbeb" },
      textStyle: { color: "#f59e0b" },
    },
    Ended: {
      text: "Đã kết thúc",
      badge: { backgroundColor: "#fef2f2" },
      textStyle: { color: "#ef4444" },
    },
    Completed: {
      text: "Hoàn tất",
      badge: { backgroundColor: "#ecfdf5" },
      textStyle: { color: "#10b981" },
    },
    Expired: {
      text: "Hết hạn",
      badge: { backgroundColor: "#fef2f2" },
      textStyle: { color: "#ef4444" },
    },
    Cancelled: {
      text: "Đã huỷ",
      badge: { backgroundColor: "#f3f4f6" },
      textStyle: { color: "#6b7280" },
    },
  };

  const renderItem = ({ item }) => {
    const statusConfig = STATUS_MAP[item.status] || {
      text: item.status,
      badge: { backgroundColor: "#f3f4f6" },
      textStyle: { color: "#6b7280" },
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
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 16,
          marginBottom: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.04)",
        }}
        activeOpacity={0.88}
        onPress={() =>
          navigation.navigate("SellRequestDetail", {
            sellRequest: item,
          })
        }
      >
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 6 }}>
            {item.vehicleBrand} {item.vehicleModel}
          </Text>

          <Text style={{ fontSize: 13, color: "#6b7280", marginBottom: 10, fontWeight: "500" }}>
            Biển số: {item.licensePlate}
          </Text>

          <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.primary, marginBottom: 6 }}>
            Bán: {item.totalShares} phần
          </Text>

          <Text style={{ fontSize: 15, fontWeight: "700", color: "#1f2937", marginBottom: 12 }}>
            {Number(item.pricePerShare).toLocaleString("vi-VN")} ₫ / phần
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: isExpired ? "#ef4444" : "#6b7280",
              marginBottom: 12,
            }}
          >
            {formatExpiredDate(item.expiredDate)}
          </Text>

          <View style={[{ alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }, statusConfig.badge]}>
            <Text style={[{ fontSize: 12, fontWeight: "600" }, statusConfig.textStyle]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#f8fafc", paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={{ fontSize: 28, fontWeight: "700", color: COLORS.text, marginBottom: 8, letterSpacing: -0.5 }}>
          Xe của tôi đang bán
        </Text>

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
    </SafeAreaView>
  );
}
