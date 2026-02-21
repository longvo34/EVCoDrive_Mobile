import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextInput } from "react-native";
import EVLoading from "../../../../../components/animation/EVLoading";
import COLORS from "../../../../../constants/colors";
import { getIncomingBuyRequests } from "../../../../../services/buyRequest/buyRequest.service";
import {
  getProfileMember
} from "../../../../../services/profile/profile.service";
import {
  getVehiclesByMemberId
} from "../../../../../services/vehicle/vehicle.service";
import {
  getVehicleBrands
} from "../../../../../services/vehicleBrand/vehicleBrand.service";
import {
  getVehicleModels
} from "../../../../../services/vehicleModel/vehicleModel.service";
import styles from "./RequestListScreen.styles";

export default function RequestListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState([]);                
  const [incomingRequests, setIncomingRequests] = useState([]); 
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [activeTab, setActiveTab] = useState("register");    
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchInitialData();
    });
    return unsubscribe;
  }, [navigation]);

  const filteredVehicles = vehicles.filter(vehicle => {
  if (!searchQuery.trim()) return true;
  const query = searchQuery.toLowerCase().trim();
  const plate = (vehicle.licensePlate || "").toLowerCase().trim();
  return plate.includes(query);
});

const filteredIncomingRequests = incomingRequests.filter(req => {
  if (!searchQuery.trim()) return true;
  const query = searchQuery.toLowerCase().trim();
  const plate = (req.vehicleLicensePlate || "").toLowerCase().trim();
  return plate.includes(query);
});

const clearSearch = () => {
  setSearchQuery("");
};

const renderEmptySearchOrDefault = () => {
  const isSearching = searchQuery.trim().length > 0;
  const currentData = activeTab === "buy" ? filteredIncomingRequests : filteredVehicles;

  if (currentData.length === 0 && isSearching) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color={COLORS.gray} />
        <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
        <Text style={styles.emptyDesc}>
          Không có biển số nào chứa "{searchQuery.trim()}"
        </Text>
      </View>
    );
  }
  return renderEmpty(activeTab);
};

  const fetchInitialData = async (tab = activeTab) => {
    try {
      setLoading(true);

      const [brandRes, modelRes, memberRes] = await Promise.all([
        getVehicleBrands(),
        getVehicleModels(),
        getProfileMember(),
      ]);

      const brandsData = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data?.data || [];
      const modelsData = Array.isArray(modelRes.data) ? modelRes.data : modelRes.data?.data || [];

      setBrands(brandsData);
      setModels(modelsData);

      const memberId = memberRes.data.memberId;

      const vehicleRes = await getVehiclesByMemberId(memberId);
      setVehicles(vehicleRes.data.data || vehicleRes.data || []);

      const incomingRes = await getIncomingBuyRequests({
        pageNumber: 1,
        pageSize: 20,          
      });
      setIncomingRequests(incomingRes.data?.data?.items || incomingRes.data || []);

    } catch (error) {
      console.log("❌ FETCH ERROR:", error);
      setVehicles([]);
      setIncomingRequests([]);
      setBrands([]);
      setModels([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInitialData(activeTab);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    fetchInitialData(tab);
  };

  const getVehicleName = (modelId) => {
    const model = models.find((m) => m.vehicleModelId === modelId);
    if (!model) return "Xe không xác định";

    const brand = brands.find((b) => b.vehicleBrandId === model.vehicleBrand?.vehicleBrandId);
    const brandName = brand ? brand.name : "";

    return `${brandName} ${model.name}`.trim() || "Xe không xác định";
  };


  const renderVehicleStatus = (status) => {
    let text = "";
    let color = COLORS.gray;

    switch (status) {
      case "Pending":
        text = "Chờ duyệt";
        color = "#d97706";
        break;
      case "ReadyForInspection":
        text = "Sẵn sàng kiểm tra tại station";
        color = "#f59e0b";
        break;
      case "Inspecting":
        text = "Đang kiểm tra tại station";
        color = "#8b5cf6";
        break;
      case "SigningContract":
        text = "Sẵn sàng ký hợp đồng";
        color = "#2563eb";
        break;
      case "SaleEligible":
        text = "Đã duyệt";
        color = COLORS.signingGreen; 
        break;
      case "Rejected":
        text = "Từ chối";
        color = "#ef4444";
        break;
      default:
        text = `Không xác định (${status})`;
        color = COLORS.gray;
    }

    return (
      <Text
        style={{
          color,
          fontWeight: "600",
          fontSize: 13,
          textAlign: "right",
          flexShrink: 1,
          maxWidth: "60%",
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
    );
  };

  const renderBuyRequestStatus = (status) => {
    let text = status;
    let color = COLORS.gray;

    switch (status) {
      case "Processing":
      case "Proccessing":
        text = "Chờ duyệt";
        color = "#d97706";
        break;
      case "Completed":
      case "Complete":
        text = "Hoàn thành";
        color = "#10b981";
        break;
      case "Cancelled":
      case "Cancel":
        text = "Đã hủy";
        color = "#ef4444";
        break;
      default:
        text = status || "Không xác định";
    }

    return (
      <Text
        style={{
          color,
          fontWeight: "600",
          fontSize: 13,
          textAlign: "right",
          flexShrink: 1,
          maxWidth: "60%",
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
    );
  };

  const renderVehicleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate("RegisterVehicle", {
          screen: "VehicleDetail",
          params: { vehicleId: item.vehicleId },
        });
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.carName}>
          {getVehicleName(item.vehicleModelId)}
        </Text>
        {renderVehicleStatus(item.vehicleStatus)}
      </View>

      <Text style={styles.date}>
        📅 {new Date(item.createdDate).toLocaleDateString("vi-VN")}
      </Text>

      {item.licensePlate && (
        <Text style={styles.note}>🚘 {item.licensePlate}</Text>
      )}

      {item.vehicleStatus === "SaleEligible" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.sellNowButton}
            onPress={() => {
              navigation.navigate("RegisterVehicle", {
                screen: "SellRequest",
                params: { vehicleId: item.vehicleId },
              });
            }}
          >
            <Text style={styles.sellNowText}>Đăng bán ngay</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

const renderBuyRequestItem = ({ item }) => (
  <TouchableOpacity
    style={styles.buyCard}
    onPress={() => navigation.navigate("BuyRequest", { buyRequestId: item.buyRequestId })}
  >
    {/* Header: Tên group + Status badge */}
    <View style={styles.buyCardHeader}>
      <Text style={styles.groupName}>
        {item.groupName || "Yêu cầu mua xe"}
      </Text>

      <View style={styles.buyStatusBadge}>
        <Text style={styles.buyStatusText}>
          {item.status === "Proccessing" || item.status === "Processing"
            ? "Chờ duyệt"
            : item.status === "Completed" || item.status === "Complete"
            ? "Hoàn thành"
            : item.status === "Cancelled" || item.status === "Cancel"
            ? "Đã hủy"
            : item.status || "Không xác định"}
        </Text>
      </View>
    </View>

    {/* Thông tin chi tiết */}
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>📅</Text>
      <Text style={styles.infoLabel}>Ngày tạo:</Text>
      <Text style={styles.infoValue}>
        {new Date(item.createdDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </Text>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>🚗</Text>
      <Text style={styles.infoLabel}>Biển số:</Text>
      <Text style={styles.infoValue}>
        {item.vehicleLicensePlate || "Chưa có biển số"}
      </Text>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>👤</Text>
      <Text style={styles.infoLabel}>Người mua:</Text>
      <Text style={styles.infoValue}>
        {item.buyerName || "Ẩn danh"}
      </Text>
    </View>

    {/* Phần giá tiền nổi bật */}
    <View style={styles.priceSection}>
      <Text style={styles.priceLabel}>Tổng giá:</Text>
      <Text style={styles.priceValue}>
        {item.totalPrice?.toLocaleString("vi-VN")} {item.currency || "VND"}
      </Text>
    </View>

    {/* Số lượng cổ phần */}
    <Text style={styles.quantityText}>
      Số lượng cổ phần yêu cầu: {item.quantity || 1}
    </Text>

    {/* Cổ phần chi tiết  */}
    {item.requestedShares?.length > 0 && (
      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: COLORS.text }}>
          Cổ phần yêu cầu:
        </Text>
        {item.requestedShares.map((share, index) => (
          <Text key={index} style={{ fontSize: 13, color: COLORS.gray, marginTop: 4 }}>
            • Phần {share.shareUnitDisplayNumber} - {share.price?.toLocaleString("vi-VN")} VND
            {" "}

          </Text>
        ))}
      </View>
    )}
  </TouchableOpacity>
);

  const renderEmpty = (tab) => (
    <View style={styles.emptyContainer}>
      <Ionicons name={tab === "buy" ? "cart-outline" : "car-outline"} size={64} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>
        {tab === "buy" ? "Chưa có yêu cầu mua nào" : "Chưa đăng ký xe nào"}
      </Text>
      <Text style={styles.emptyDesc}>
        {tab === "buy" 
          ? "Yêu cầu mua từ người khác sẽ hiển thị ở đây" 
          : "Nhấn dấu + để bắt đầu đăng ký xe của bạn"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && <EVLoading />}

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Quản lý yêu cầu</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* TAB */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "buy" && styles.activeTab]}
          onPress={() => switchTab("buy")}
        >
          <Text style={[styles.tabText, activeTab === "buy" && styles.activeTabText]}>
            Yêu cầu mua
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "register" && styles.activeTab]}
          onPress={() => switchTab("register")}
        >
          <Text style={[styles.tabText, activeTab === "register" && styles.activeTabText]}>
            Đăng ký xe
          </Text>
        </TouchableOpacity>
      </View>

     {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo biển số xe..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          returnKeyType="search"
          placeholderTextColor={COLORS.gray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* LIST  */}
      <FlatList
        data={activeTab === "buy" ? filteredIncomingRequests : filteredVehicles}
        keyExtractor={(item) => 
          activeTab === "buy" ? item.buyRequestId : item.vehicleId
        }
        renderItem={activeTab === "buy" ? renderBuyRequestItem : renderVehicleItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
        ListEmptyComponent={!loading && renderEmptySearchOrDefault()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* FLOAT BUTTON*/}
      {activeTab === "register" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("VehicleStep1")}
        >
          <Ionicons name="add" size={26} color={COLORS.black} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}