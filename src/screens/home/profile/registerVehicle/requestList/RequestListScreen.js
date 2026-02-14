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

import EVLoading from "../../../../../components/animation/EVLoading";
import COLORS from "../../../../../constants/colors";
import { getMyBuyRequests } from "../../../../../services/buyRequest/buyRequest.service";
import { getProfileMember } from "../../../../../services/profile/profile.service";
import { getVehiclesByMemberId } from "../../../../../services/vehicle/vehicle.service";
import { getVehicleBrands } from "../../../../../services/vehicleBrand/vehicleBrand.service";
import { getVehicleModels } from "../../../../../services/vehicleModel/vehicleModel.service";
import styles from "./RequestListScreen.styles";

export default function RequestListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [activeTab, setActiveTab] = useState("buy"); 
const [buyRequests, setBuyRequests] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchInitialData();
    });
    return unsubscribe;
  }, [navigation]);

const fetchInitialData = async () => {
  try {
    setLoading(true);

    const [brandRes, modelRes, memberRes, buyRes] = await Promise.all([
      getVehicleBrands(),
      getVehicleModels(),
      getProfileMember(),
      getMyBuyRequests(),
    ]);

    const brandsData = Array.isArray(brandRes.data)
      ? brandRes.data
      : brandRes.data?.data || brandRes || [];
    const modelsData = Array.isArray(modelRes.data)
      ? modelRes.data
      : modelRes.data?.data || modelRes || [];

    setBrands(brandsData);
    setModels(modelsData);

    setBuyRequests(buyRes.data?.data?.items || []);

    const memberId = memberRes.data.memberId;
    const vehicleRes = await getVehiclesByMemberId(memberId);

    setVehicles(vehicleRes.data.data || vehicleRes.data || []);
  } catch (error) {
    console.log("❌ FETCH ERROR:", error);
    setVehicles([]);
    setBuyRequests([]);
    setBrands([]);
    setModels([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  const onRefresh = () => {
    setRefreshing(true);
    fetchInitialData();
  };

  const getVehicleName = (modelId) => {
    const model = models.find((m) => m.vehicleModelId === modelId);
    if (!model) return "Xe không xác định";

    const brand = brands.find((b) => b.vehicleBrandId === model.vehicleBrand?.vehicleBrandId);
    const brandName = brand ? brand.name : "";

    return `${brandName} ${model.name}`.trim() || "Xe không xác định";
  };

  const renderStatus = (status) => {
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

  const renderItem = ({ item }) => (
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
        {renderStatus(item.vehicleStatus)}
      </View>

      <Text style={styles.date}>
        📅 {new Date(item.createdDate).toLocaleDateString("vi-VN")}
      </Text>

      {item.licensePlate && (
        <Text style={styles.note}>🚘 {item.licensePlate}</Text>
      )}

      {/* Nút "Đăng bán ngay" chỉ hiện khi SaleEligible */}
    
{item.vehicleStatus === "SaleEligible" && (
  <View style={styles.actionRow}>

    {/* Nút Đăng bán ngay */}
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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>Chưa đăng ký xe nào</Text>
      <Text style={styles.emptyDesc}>
        Nhấn dấu + để bắt đầu đăng ký xe của bạn
      </Text>
    </View>
  );

 const renderBuyItem = ({ item }) => {
  const getStatusStyle = () => {
    if (item.status === "Completed") {
      return {
        container: styles.buyCompleted,
        text: styles.buyCompletedText,
        label: "Hoàn tất",
      };
    }
    if (item.status === "Cancelled") {
      return {
        container: styles.buyCancelled,
        text: styles.buyCancelledText,
        label: "Đã hủy",
      };
    }
    return {
      container: styles.buyProcessing,
      text: styles.buyProcessingText,
      label: "Đang xử lý",
    };
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={styles.buyCard}>
      <View style={styles.buyHeaderRow}>
        <Text style={styles.buyGroupName}>
          {item.groupName}
        </Text>

        <View style={[styles.buyStatusBadge, statusStyle.container]}>
          <Text style={[styles.buyStatusText, statusStyle.text]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      <Text style={styles.buyPlate}>
        🚘 {item.vehicleLicensePlate}
      </Text>

      <Text style={styles.buyPrice}>
        {item.totalPrice?.toLocaleString()} {item.currency}
      </Text>

      <View style={styles.buyMetaRow}>
        <Text style={styles.buyMetaText}>
          📦 {item.quantity} cổ phần
        </Text>

        <Text style={styles.buyMetaText}>
          📅 {new Date(item.createdDate).toLocaleDateString("vi-VN")}
        </Text>
      </View>
    </View>
  );
};


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
    onPress={() => setActiveTab("buy")}
  >
    <Text
      style={[
        styles.tabText,
        activeTab === "buy" && styles.activeTabText,
      ]}
    >
      Yêu cầu mua
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.tab, activeTab === "vehicle" && styles.activeTab]}
    onPress={() => setActiveTab("vehicle")}
  >
    <Text
      style={[
        styles.tabText,
        activeTab === "vehicle" && styles.activeTabText,
      ]}
    >
      Đăng ký xe
    </Text>
  </TouchableOpacity>
</View>


      {/* LIST */}
      <FlatList
  data={activeTab === "buy" ? buyRequests : vehicles}
  keyExtractor={(item) =>
    activeTab === "buy"
      ? item.buyRequestId
      : item.vehicleId
  }
  renderItem={
    activeTab === "buy"
      ? renderBuyItem
      : renderItem
  }
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    flexGrow: 1,
    paddingBottom: 100,
  }}
  ListEmptyComponent={!loading && renderEmpty}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
/>


      {/* FLOAT BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("VehicleStep1")}
      >
        <Ionicons name="add" size={26} color={COLORS.black} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}