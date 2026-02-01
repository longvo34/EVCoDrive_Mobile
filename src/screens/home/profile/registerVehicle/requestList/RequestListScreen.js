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

  useEffect(() => {
    fetchInitialData();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchInitialData(); 
    });

    return unsubscribe; 
  }, [navigation]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [brandRes, modelRes, memberRes] = await Promise.all([
        getVehicleBrands(),
        getVehicleModels(),
        getProfileMember(),
      ]);

      const brandsData = Array.isArray(brandRes.data) 
        ? brandRes.data 
        : brandRes.data?.data || brandRes || [];
      const modelsData = Array.isArray(modelRes.data) 
        ? modelRes.data 
        : modelRes.data?.data || modelRes || [];

      setBrands(brandsData);
      setModels(modelsData);

      const memberId = memberRes.data.memberId;
      const vehicleRes = await getVehiclesByMemberId(memberId);

      setVehicles(vehicleRes.data.data || vehicleRes.data || []);
    } catch (error) {
      console.log("❌ FETCH ERROR:", error);
      setVehicles([]);
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

    const brand = brands.find((b) => b.vehicleBrandId === model.vehicleBrand.vehicleBrandId);
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
      text = "Đã duyệt / Có thể bán";
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
        flexShrink: 1,              
        textAlign: "right",        
        flexWrap: 'wrap',          
        maxWidth: '55%',            
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
          params: {
            vehicleId: item.vehicleId,
          },
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
        <View style={styles.tab}>
          <Text style={styles.tabText}>Yêu cầu mua</Text>
        </View>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>
            Đăng ký xe
          </Text>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.vehicleId}
        renderItem={renderItem}
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