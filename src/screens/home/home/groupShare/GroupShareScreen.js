import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EVLoading from "../../../../components/animation/EVLoading";
import { getAvailableSharesByGroupId } from "../../../../services/coOwnerGroup/coOwnerGroup.service";
import { getVehicleById } from "../../../../services/vehicle/vehicle.service";
import styles from "./GroupShareScreen.styles";


export default function GroupShareScreen() {
  const route = useRoute();
  const {
    groupId,
    vehicleBrand,
    vehicleModel,
    licensePlate,
    imageUrl,
  } = route.params;


  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShares, setSelectedShares] = useState([]);
  const navigation = useNavigation();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      setLoading(true);

      const res = await getAvailableSharesByGroupId(groupId);

      if (!res.data?.isSuccess) {
        throw new Error(res.data?.message || "Get shares failed");
      }

      const data = res.data.data;

      // ✅ set shares
      setShares(data.availableShares || []);

      // ✅ gọi thêm API vehicle
      if (data.vehicleId) {
        const vehicleRes = await getVehicleById(data.vehicleId);

        if (vehicleRes.data?.isSuccess) {
          setVehicle(vehicleRes.data.data);
        }
      }
    } catch (err) {
      console.log("GROUP SHARE ERROR:", err);
      Alert.alert("Lỗi", "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };


  const toggleSelect = (shareId) => {
    setSelectedShares((prev) =>
      prev.includes(shareId)
        ? prev.filter((id) => id !== shareId)
        : [...prev, shareId]
    );
  };


  const renderItem = ({ item }) => {
    const isSelected = selectedShares.includes(item.shareUnitId);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && { borderColor: "#FFD600", borderWidth: 2 },
        ]}
        onPress={() => toggleSelect(item.shareUnitId)}
        activeOpacity={0.8}
      >
        <View>
          <Text style={styles.shareTitle}>
            Share #{item.displayNumber}
          </Text>

          <Text style={styles.text}>
            Certificate: {item.certificateCode}
          </Text>

          <Text style={styles.price}>
            {item.price?.toLocaleString()} {item.currency}
          </Text>
        </View>

        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "#FFD600",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isSelected ? "#FFD600" : "#fff",
          }}
        >
          {isSelected && <Text>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };


  if (loading) {
    return <EVLoading visible={true} />;
  }

  return (


    <SafeAreaView style={[styles.safe, { flex: 1 }]}>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 12,
          }}
        >
          Danh sách cổ phần
        </Text>
      </View>


      {/* Phần có thể scroll */}
      <View style={{ flex: 1 }}>

        <FlatList
          ListHeaderComponent={
            <>
              <View style={{ padding: 16 }}>
                <Image
                  source={{
                    uri:
                      vehicle?.images?.[0]?.secureUrl ||
                      "https://picsum.photos/300/200",
                  }}
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 16,
                    marginBottom: 12,
                  }}
                />

                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {vehicle?.vehicleModel?.brandName}{" "}
                  {vehicle?.vehicleModel?.name}
                </Text>

                <Text style={{ color: "#666" }}>
                  Biển số: {vehicle?.licensePlate}
                </Text>

                <Text style={{ color: "#666" }}>
                  Năm: {vehicle?.year}
                </Text>

                <Text style={{ color: "#666" }}>
                  ODO: {vehicle?.odometer?.toLocaleString()} km
                </Text>

                <Text style={{ color: "#666" }}>
                  Battery: {vehicle?.batteryHealth}%
                </Text>

              </View>

              <Text style={[styles.header, { paddingHorizontal: 16 }]}>
                Danh sách cổ phần
              </Text>
            </>
          }
          data={shares}
          keyExtractor={(item) => item.shareUnitId}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Không có cổ phần đang bán
            </Text>
          }
        />

      </View>

      {/* 🔥 Nút cố định */}
      {selectedShares.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            borderTopWidth: 1,
            borderColor: "#eee",
            backgroundColor: "#fff",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#FFD600",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={() =>
              Alert.alert(
                "Xác nhận",
                `Bạn muốn mua ${selectedShares.length} cổ phần?`
              )
            }
          >
            <Text style={{ fontWeight: "bold" }}>
              Mua {selectedShares.length} cổ phần
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );

}
