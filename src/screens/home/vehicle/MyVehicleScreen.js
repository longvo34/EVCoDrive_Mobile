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
import EVLoading from "../../../components/animation/EVLoading";
import { getMyCoOwnerGroups } from "../../../services/coOwnerGroup/coOwnerGroup.service";
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
  

  useFocusEffect(
  useCallback(() => {
    fetchData();
  }, [])
);

  const fetchData = async () => {
    console.log("🔥 fetchData CALLED");
    try {
      setLoading(true);
      console.log("🚀 Calling getMyCoOwnerGroups...");
      const res = await getMyCoOwnerGroups();

      console.log("Full response:", res);
      console.log("res.data:", res?.data);
      console.log("res.data.data:", res?.data?.data);

      const rawData = (res?.data?.data || []).filter(
        (item) => item.coOwnerGroupStatus !== "Inactive"
      );

      console.log("rawData:", rawData);
      console.log("Is rawData array:", Array.isArray(rawData));

      const STATUS_ORDER = ["Active", "Pending", "Inactive"];
      console.log("STATUS_ORDER:", STATUS_ORDER);

      const sorted = Array.isArray(rawData)
        ? [...rawData].sort((a, b) => {
            const priA = STATUS_ORDER?.indexOf?.(a.coOwnerGroupStatus) ?? 999;
            const priB = STATUS_ORDER?.indexOf?.(b.coOwnerGroupStatus) ?? 999;

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
      console.log("=========== AXIOS ERROR START ===========");

      console.log("FULL URL:", error.config?.baseURL + error.config?.url);
      console.log("METHOD:", error.config?.method);
      console.log("REQUEST HEADERS:", error.config?.headers);
      console.log("REQUEST PARAMS:", error.config?.params);
      console.log("REQUEST DATA:", error.config?.data);
      console.log("STATUS:", error.response?.status);
      console.log(
        "RESPONSE DATA:",
        JSON.stringify(error.response?.data, null, 2)
      );
      console.log("ERROR CODE:", error.response?.data?.errorCode);
      console.log("MESSAGE:", error.response?.data?.message);

      console.log("=========== AXIOS ERROR END ===========");

      console.error("Lỗi fetch nhóm sở hữu chung:", error);
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
      const name = item.name?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      return name.includes(lowerQuery) || description.includes(lowerQuery);
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
    Active: {
      text: "Hoạt động",
      badge: styles.badgePublished,
      textStyle: styles.textPublished,
    },
    Pending: {
      text: "Chờ phê duyệt",
      badge: styles.badgePartial,
      textStyle: styles.textPending,
    },
    Inactive: {
      text: "Không hoạt động",
      badge: styles.badgeRejected,
      textStyle: styles.textRejected,
    },
  };

  const translateText = (text) => {
    if (!text) return text;
    

    let translated = text
      .replace(/Co-ownership group for vehicle/gi, "Nhóm sở hữu chung cho phương tiện")
      .replace(/Group for/gi, "Nhóm sở hữu cho")
      .replace(/Co-ownership group/gi, "Nhóm sở hữu chung");
    
    return translated;
  };

  const renderItem = ({ item }) => {
    const statusConfig = STATUS_MAP[item.coOwnerGroupStatus] || {
      text: item.coOwnerGroupStatus,
      badge: styles.badgeRejected,
      textStyle: styles.textRejected,
    };

    const formatCreatedDate = (dateStr) => {
      if (!dateStr) return "Chưa có ngày";
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => navigation.navigate("MyVehicleDetail", { groupId: item.coOwnerGroupId, })}
      >
        <View style={styles.info}>
          <Text style={styles.name}>
            {translateText(item.name)}
          </Text>

          <Text style={styles.plate}>
            {translateText(item.description)}
          </Text>

          <Text style={styles.share}>
            Tổng phần: {item.totalShare} phần
          </Text>

          <Text style={styles.price}>
            {Number(item.sharePrice).toLocaleString("vi-VN")} ₫ / phần
          </Text>

          <Text style={styles.expiredDate}>
            Tạo: {formatCreatedDate(item.createdDate)}
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
        <Text style={styles.title}>Nhóm sở hữu chung của tôi</Text>

        {/* Thanh tìm kiếm */}
        <View style={searchStyles.searchContainer}>
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Tìm theo tên nhóm..."
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
          keyExtractor={(item) => item.coOwnerGroupId}
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
                  ? "Không tìm thấy nhóm nào phù hợp"
                  : "Không có nhóm sở hữu chung nào"}
              </Text>
            )
          }
        />
      </View>

      <EVLoading visible={loading} />
    </View>
  );
}