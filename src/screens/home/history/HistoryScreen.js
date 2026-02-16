import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EVLoading from "../../../components/animation/EVLoading";
import { getMyBuyRequests } from "../../../services/buyRequest/buyRequest.service";
import { getAvailableSharesByGroupId } from "../../../services/coOwnerGroup/coOwnerGroup.service";
import { getVehicleById } from "../../../services/vehicle/vehicle.service";
import styles from "./HistoryScreen.styles";

export default function HistoryScreen() {
  const [loading, setLoading] = useState(false);
  const [buyRequests, setBuyRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();

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


  const fetchData = async () => {
  try {
    setLoading(true);

    const res = await getMyBuyRequests();
    let data = res.data?.data?.items || [];

    data = data.filter(item => 
      !["Cancelled", "Cancel"].includes(item.status)
    );

    console.log("Danh sách sau khi lọc Cancelled:", data.map(item => item.status));

      const enrichedData = await Promise.all(
        data.map(async (item) => {
          try {
            const groupRes = await getAvailableSharesByGroupId(
              item.coOwnerGroupId
            );

            const vehicleId = groupRes.data?.data?.vehicleId;

            if (!vehicleId) return item;
            const vehicleRes = await getVehicleById(vehicleId);

            const vehicleData = vehicleRes.data?.data;

            return {
              ...item,
              vehicleBrand: vehicleData?.vehicleModel?.brandName,
              vehicleModel: vehicleData?.vehicleModel?.name,
            };
          } catch (err) {
            return item;
          }
        })
      );

      setBuyRequests(enrichedData);
      setFilteredData(enrichedData);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải lịch sử giao dịch");
    } finally {
      setLoading(false);
    }
  };



 useEffect(() => {
  fetchData(); 

  const unsubscribe = navigation.addListener('focus', () => {
    fetchData(); 
  });

  return unsubscribe; 
}, [navigation]);

  useMemo(() => {
    if (!searchQuery.trim()) {
      setFilteredData(buyRequests);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();

    const filtered = buyRequests.filter((item) => {
      const vehicleName = `${item.vehicleBrand || ""} ${item.vehicleModel || ""}`
        .toLowerCase()
        .trim();

      return vehicleName.includes(lowerQuery);
    });

    setFilteredData(filtered);
  }, [searchQuery, buyRequests]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "Proccessing":
      case "Processing":
        return {
          label: "Chờ duyệt",
          badgeStyle: styles.buyProcessing,
          textStyle: styles.buyProcessingText,
        };

      case "Completed":
      case "Complete":
        return {
          label: "Hoàn thành",
          badgeStyle: styles.buyCompleted,
          textStyle: styles.buyCompletedText,
        };

      case "Cancelled":
      case "Cancel":
        return {
          label: "Đã hủy",
          badgeStyle: styles.buyCancelled,
          textStyle: styles.buyCancelledText,
        };

      default:
        return {
          label: status,
          badgeStyle: {},
          textStyle: {},
        };
    }
  };


  return (
    <View style={styles.container}>

      <View style={searchStyles.searchContainer}>
        <TextInput
          style={searchStyles.searchInput}
          placeholder="Tìm theo tên xe..."
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

      {/* Loading overlay */}
      <EVLoading visible={loading} />

      {buyRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Bạn chưa có giao dịch mua nào
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.buyRequestId}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const statusInfo = getStatusInfo(item.status);

            return (
              <TouchableOpacity
                style={styles.buyCard}
                onPress={() =>
                  navigation.navigate("BuyRequestDetail", {
                    buyRequestId: item.buyRequestId,
                  })
                }
              >
                <Text style={styles.buyVehicleName}>
                  {item.vehicleBrand} {item.vehicleModel}
                </Text>
                <Text style={styles.buyGroupName}>
                  {item.groupName}
                </Text>

                <Text style={styles.buyPlate}>
                  Biển số: {item.vehicleLicensePlate}
                </Text>

                <Text style={styles.buyPrice}>
                  {item.totalPrice?.toLocaleString()} {item.currency}
                </Text>

                <View style={styles.buyMetaRow}>
                  <Text style={styles.buyMetaText}>
                    SL: {item.quantity}
                  </Text>

                  <View
                    style={[
                      styles.buyStatusBadge,
                      statusInfo.badgeStyle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.buyStatusText,
                        statusInfo.textStyle,
                      ]}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}

        />
      )}
    </View>
  );
}
