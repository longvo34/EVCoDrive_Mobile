import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
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
import styles from "./HomeScreen.styles";


export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const navigation = useNavigation();


  useFocusEffect(
  useCallback(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const profileRes = await getMyProfile();
        if (!profileRes.data?.isSuccess) {
          throw new Error(profileRes.data?.message || "Get profile failed");
        }
        setUser(profileRes.data.data);

        const groupRes = await getGroupsWithAvailableShares();
        if (!groupRes.data?.isSuccess) {
          throw new Error(groupRes.data?.message || "Get groups failed");
        }

        const groupsData = groupRes.data.data;

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
              return { ...group, imageUrl: null };
            }
          })
        );

        setGroups(groupsWithImages);
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


  if (loading) {
  return (
    <SafeAreaView style={styles.safe}>
      <EVLoading />
    </SafeAreaView>
  );
}


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
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>Marketplace</Text>
        <Text style={styles.subtitle}>
          Các xe đang có cổ phần bán
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {groups.map((group) => (
            <TouchableOpacity
              key={group.coOwnerGroupId}
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
                  uri:
                    group.imageUrl ||
                    "https://picsum.photos/300/200",
                }}
                style={styles.carImage}
              />

              <View style={styles.carFooter}>
                <View>
                  <Text style={styles.carName}>
                    {group.vehicleBrand}{" "}
                    {group.vehicleModel}
                  </Text>

                  <Text style={{ fontSize: 12 }}>
                    Biển số: {group.licensePlate}
                  </Text>

                  <Text style={{ fontSize: 12 }}>
                    Đang bán:{" "}
                    {group.totalSharesForSale} gói đầu tư
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    Giá:{" "}

                    {group.highestPricePerShare?.toLocaleString()}{" "}
                    VND
                  </Text>
                </View>

                <View style={styles.arrowCircle}>
                  <Text style={styles.arrow}>↗</Text>
                </View>
              </View>
            </TouchableOpacity>

          ))}
        </ScrollView>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
