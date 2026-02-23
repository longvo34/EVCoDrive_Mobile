import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EVLoading from "../../../../components/animation/EVLoading";
import COLORS from "../../../../constants/colors";
import { getCoOwnerGroupDetails } from "../../../../services/coOwnerGroup/coOwnerGroup.service";
import { getVehicleById } from "../../../../services/vehicle/vehicle.service";
import styles from "./MyVehicleDetailScreen.styles";

export default function MyVehicleDetailScreen({ navigation, route }) {
  const { groupId } = route.params;
  console.log("groupId:", groupId);
  const [loading, setLoading] = useState(true);
  const [groupDetail, setGroupDetail] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    fetchGroupDetail();
  }, []);

  const fetchGroupDetail = async () => {
    try {
      const res = await getCoOwnerGroupDetails(groupId);
      const groupData = res.data.data;

      setGroupDetail(groupData);
      if (groupData?.vehicleId) {
        fetchVehicle(groupData.vehicleId);
      }
    } catch (error) {
      console.log("Lỗi lấy group detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicle = async (vehicleId) => {
    try {
      const res = await getVehicleById(vehicleId);
      setVehicle(res.data.data);
    } catch (error) {
      console.log("Lỗi lấy vehicle:", error);
    }
  };

  const shareHolders = groupDetail?.shareHolders || [];

  const currentUserId = 1;

  const myShare = shareHolders.find(
    (item) => item.memberId === currentUserId
  );

  const getStatusText = (status) => {
    switch (status) {
      case "Active":
        return "Đang hoạt động";
      case "Inactive":
        return "Ngừng hoạt động";
      case "Pending":
        return "Đang xử lý";
      case "Rejected":
        return "Từ chối";
      case "Approved":
        return "Đã duyệt";
      default:
        return "Không xác định";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <EVLoading visible={loading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết xe của tôi</Text>
        </View>

        {/* Car Image */}
        <Image
          source={{
            uri:
              vehicle?.images?.[0]?.secureUrl ||
              "https://via.placeholder.com/400",
          }}
          style={styles.carImage}
        />

        {/* Vehicle Info */}
        <View style={styles.infoBox}>
          <Text style={styles.carName}>
            {vehicle?.vehicleModel?.name || "Đang tải..."}
          </Text>

          <Text style={styles.plate}>
            Biển số: {vehicle?.licensePlate || "---"}
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.batteryBox}>
              <Ionicons name="battery-half" size={16} color={COLORS.gray} />
              <Text style={styles.grayText}>
                Tổng giá trị:{" "}
                {(
                  (groupDetail?.totalShares || 0) *
                  (groupDetail?.sharePrice || 0)
                ).toLocaleString()}đ
              </Text>
            </View>

            <View style={styles.readyTag}>
              <Text style={styles.readyText}>
                {getStatusText(groupDetail?.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons  */}
        <View style={styles.actionContainer}>
         {[
  { label: "Đặt xe", icon: "calendar-outline" },
  { label: "Hóa đơn", icon: "receipt-outline" },
  { label: "Biểu quyết", icon: "create-outline" },
  {
    label: "Xem thêm",
    icon: "menu-outline",
    onPress: () => navigation.navigate("ExtendedFeatures", { groupId }),
  },
].map((item, index) => (
  <TouchableOpacity
    key={index}
    style={styles.actionItem}
    activeOpacity={0.8}
    onPress={item.onPress}
  >
    <View style={styles.actionCircle}>
      <Ionicons
        name={item.icon}
        size={22}
        color={COLORS.white}
      />
    </View>
    <Text style={styles.actionText}>{item.label}</Text>
  </TouchableOpacity>
))}
        </View>

        {/* Wallet  */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletIcon}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.walletTitle}>Ví quỹ chung</Text>
          </View>

          <Text style={styles.walletSub}>Số dư hiện tại</Text>
          <Text style={styles.walletAmount}>1.200.000đ</Text>
        </View>

        {/* Stats  */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Ionicons
              name="pie-chart-outline"
              size={22}
              color="#ea580c"
            />
            <Text style={styles.gridLabel}>Sở hữu</Text>
            <Text style={styles.gridValue}>
              {myShare?.ownershipPercentage || 0}%
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Ionicons
              name="people-outline"
              size={22}
              color="#e11d48"
            />
            <Text style={styles.gridLabel}>Đồng sở hữu</Text>
            <Text style={styles.gridValue}>
              {shareHolders.length} người
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Ionicons
              name="cash-outline"
              size={22}
              color="#16a34a"
            />
            <Text style={styles.gridLabel}>Tổng cổ phần</Text>
            <Text style={styles.gridValue}>
              {groupDetail?.totalShares || 0}
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Ionicons
              name="wallet-outline"
              size={22}
              color="#3b82f6"
            />
            <Text style={styles.gridLabel}>Giá / cổ phần</Text>
            <Text style={styles.gridValue}>
              {(groupDetail?.sharePrice || 0).toLocaleString()}đ
            </Text>
          </View>
          <View style={styles.grid}>
            {/* PIN */}
            <View style={styles.gridItem}>
              <Ionicons
                name="battery-half-outline"
                size={22}
                color="#16a34a"
              />
              <Text style={styles.gridLabel}>PIN</Text>
              <Text style={styles.gridValue}>
                {vehicle?.batteryHealth || 0}%
              </Text>
            </View>

            {/* ODO / năm */}
            <View style={styles.gridItem}>
              <Ionicons
                name="speedometer-outline"
                size={22}
                color="#3b82f6"
              />
              <Text style={styles.gridLabel}>ODO/năm</Text>
              <Text style={styles.gridValue}>
                {(vehicle?.odometer || 0).toLocaleString()} km
              </Text>
            </View>

            {/* Số chuyến / năm */}
            <View style={styles.gridItem}>
              <Ionicons
                name="sync-outline"
                size={22}
                color="#f59e0b"
              />
              <Text style={styles.gridLabel}>Số chuyến/năm</Text>
              <Text style={styles.gridValue}>
                CHƯA CÓ
              </Text>
            </View>

            {/* Tình trạng */}
            <View style={styles.gridItem}>
              <Ionicons
                name="construct-outline"
                size={22}
                color="#9333ea"
              />
              <Text style={styles.gridLabel}>Tình trạng</Text>
              <Text style={styles.gridValue}>
                CHƯA CÓ
              </Text>
            </View>
          </View>
        </View>

        {/* Schedule  */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Danh sách đồng sở hữu</Text>

          {shareHolders.map((item, index) => (
            <View key={item.shareHolderId} style={styles.scheduleItem}>
              <Text style={styles.scheduleName}>
                {item.memberName}
              </Text>

              <Text>
                {item.ownershipPercentage}%
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}