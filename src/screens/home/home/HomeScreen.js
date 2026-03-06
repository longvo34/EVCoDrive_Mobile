import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EVLoading from "../../../components/animation/EVLoading";
import { getMyProfile } from "../../../services/auth/auth.service";
import { getGroupsWithAvailableShares } from "../../../services/coOwnerGroup/coOwnerGroup.service";
import { getVehicleById } from "../../../services/vehicle/vehicle.service";
import { getVehicleModels } from "../../../services/vehicleModel/vehicleModel.service";
import styles from "./HomeScreen.styles";

export default function HomeScreen() {

  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [groups, setGroups] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);

  const [selectedModel, setSelectedModel] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  useFocusEffect(
    useCallback(() => {

      const fetchData = async () => {
        try {

          setLoading(true);

          const profileRes = await getMyProfile();
          setUser(profileRes.data.data);

          const groupRes = await getGroupsWithAvailableShares();
          const groupsData = groupRes.data.data?.items || [];

          const groupsWithImages = await Promise.all(
            groupsData.map(async (group) => {
              try {

                const vehicleRes = await getVehicleById(group.vehicleId);
                const vehicle = vehicleRes.data.data;

                return {
                  ...group,
                  imageUrl: vehicle.images?.[0]?.secureUrl || null,
                };

              } catch {

                return {
                  ...group,
                  imageUrl: null
                };

              }
            })
          );

          setGroups(groupsWithImages);

          const modelRes = await getVehicleModels();
          setVehicleModels(modelRes.data.data || []);

        } catch (err) {

          console.log("HOME ERROR:", err);
          Alert.alert("Lỗi", "Không tải được dữ liệu");

        } finally {

          setLoading(false);

        }
      };

      fetchData();

    }, [])
  );

  const filteredGroups = groups.filter((group) => {

    if (!selectedModel) return true;

    return group.vehicleModel === selectedModel;

  });

  return (

    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>

        <View style={styles.userRow}>

          <Image
            source={{
              uri:
                user?.avatarUrl && user.avatarUrl.trim() !== ""
                  ? user.avatarUrl
                  : "https://www.gravatar.com/avatar/?d=mp&s=200",
            }}
            style={styles.avatar}
          />

          <View>

            <Text style={styles.hello}>Xin chào</Text>

            <Text style={styles.username}>
              {user?.fullName || user?.email || "Người dùng"}
            </Text>

          </View>

        </View>

        {/* FILTER BUTTON */}

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilter(!showFilter)}
        >

          <Ionicons name="filter" size={20} color="#000" />

        </TouchableOpacity>

      </View>

      {/* FILTER DROPDOWN */}

     {showFilter && (
  <TouchableOpacity
    style={styles.overlay}
    activeOpacity={1}
    onPress={() => setShowFilter(false)}
  >
    <View style={styles.filterDropdown}>
      <ScrollView style={{ maxHeight: 220 }}>
        
        <TouchableOpacity
          style={styles.filterItem}
          onPress={() => {
            setSelectedModel(null);
            setShowFilter(false);
          }}
        >
          <Text>Tất cả</Text>
        </TouchableOpacity>

        {vehicleModels.map((model) => (
          <TouchableOpacity
            key={model.vehicleModelId}
            style={styles.filterItem}
            onPress={() => {
              setSelectedModel(model.name);
              setShowFilter(false);
            }}
          >
            <Text>{model.name}</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  </TouchableOpacity>
)}

      {/* LIST */}

      <FlatList
  data={filteredGroups}
  keyExtractor={(item) => item.coOwnerGroupId}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ padding: 20 }}
  showsVerticalScrollIndicator={false}

  ListHeaderComponent={() => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.welcome}>Marketplace</Text>
      <Text style={styles.subtitle}>
        Các xe đang có cổ phần bán
      </Text>
    </View>
  )}

        renderItem={({ item: group }) => (

          <TouchableOpacity
            style={styles.carCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("GroupShare", {
                groupId: group.coOwnerGroupId,
                vehicleId: group.vehicleId,
                vehicleBrand: group.vehicleBrand,
                vehicleModel: group.vehicleModel,
                licensePlate: group.licensePlate,
                imageUrl: group.imageUrl,
              })
            }
          >

            <Image
              source={{
                uri: group.imageUrl || "https://picsum.photos/300/200",
              }}
              style={styles.carImage}
            />

            <View style={styles.carFooter}>

              <View>

                <Text style={styles.carName}>
                  {group.vehicleBrand} {group.vehicleModel}
                </Text>

                <Text style={{ fontSize: 12 }}>
                  Biển số: {group.licensePlate || "Chưa có"}
                </Text>

                <Text style={{ fontSize: 12 }}>
                  Đang bán: {group.totalSharesForSale} gói đầu tư
                </Text>

                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  Giá: {group.sharePrice?.toLocaleString()} VND
                </Text>

              </View>

            </View>

          </TouchableOpacity>

        )}
      />

      <EVLoading visible={loading} />

    </SafeAreaView>

  );
}