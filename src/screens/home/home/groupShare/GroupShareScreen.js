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
import { createBuyRequest } from "../../../../services/buyRequest/buyRequest.service";
import { getAvailableSharesByGroupId } from "../../../../services/coOwnerGroup/coOwnerGroup.service";
import { getWalletByMemberId } from "../../../../services/memberWallet/memberWallet.service";
import { getProfileMember } from "../../../../services/profile/profile.service";
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
  const [balance, setBalance] = useState(0);
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const profileRes = await getProfileMember();
        const mid = profileRes.data?.memberId;
        if (!mid) {
          Alert.alert("Lỗi", "Không lấy được thông tin người dùng");
          return;
        }
        setMemberId(mid);
        try {
          const walletRes = await getWalletByMemberId(mid);
          const walletData = walletRes.data?.data;
          setBalance(walletData?.balance || 0);
        } catch (walletErr) {
          console.log("Lỗi load ví:", walletErr);
          if (walletErr.response?.status === 404) {
            setBalance(0); 
          } else {
            setBalance(0); 
          }
        }
        const res = await getAvailableSharesByGroupId(groupId);

        if (!res.data?.isSuccess) {
          throw new Error(res.data?.message || "Get shares failed");
        }

        const data = res.data.data;
        setShares(data.availableShares || []);

        if (data.vehicleId) {
          const vehicleRes = await getVehicleById(data.vehicleId);
          if (vehicleRes.data?.isSuccess) {
            setVehicle(vehicleRes.data.data);
          }
        }
      } catch (err) {
        console.log("LOAD ALL ERROR:", err);
        Alert.alert("Lỗi", "Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [groupId]);

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
            Cổ phần {item.displayNumber}
          </Text>

          <Text style={styles.text}>
            Ngày bán: {item.listedDate
              ? new Date(item.listedDate).toLocaleDateString("vi-VN")
              : ""}
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

  const handleBuy = async () => {
    try {
      setLoading(true);

      if (selectedShares.length === 0) {
        Alert.alert("Thông báo", "Vui lòng chọn cổ phần");
        return;
      }

      const totalCost = selectedShares.reduce((sum, shareId) => {
        const share = shares.find(s => String(s.shareUnitId) === String(shareId));
        return sum + (share?.price || 0);
      }, 0);

      console.log("Tổng tiền cần mua:", totalCost);
      console.log("Số dư hiện tại:", balance);

      if (balance < totalCost) {
        Alert.alert(
          "Số dư không đủ",
          `Bạn cần ${totalCost.toLocaleString()} ${shares[0]?.currency || "VND"} để mua.\n` +
          `Số dư hiện tại: ${balance.toLocaleString()} ${shares[0]?.currency || "VND"}\n\n` +
          "Vui lòng nạp thêm tiền vào ví.",
          [
            { text: "Huỷ", style: "cancel" },
            {
  text: "Nạp tiền",
  onPress: () => {
    navigation.navigate("Profile", {
      screen: "MemberWallet",
    });
  },
}
          ]
        );
        return;
      }

      const firstShare = shares.find(
        (s) => String(s.shareUnitId) === String(selectedShares[0])
      );

      if (!firstShare) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin cổ phần.");
        return;
      }

     const payload = {
      sellRequestId: firstShare.sellRequestId,
      shareUnitIds: selectedShares,
    };

    console.log("Payload gửi createBuyRequest:", payload);

    const res = await createBuyRequest(payload);

    console.log("=== RESPONSE FULL TỪ createBuyRequest ===");
    console.log("Status code:", res.status);                  
    console.log("Response headers:", res.headers);          
    console.log("Response data (raw):", res.data);           
    console.log("Response data JSON stringified:", 
      JSON.stringify(res.data, null, 2)                        
    );

    if (!res.data?.isSuccess) {
      console.warn("API trả về isSuccess = false");
      throw new Error(res.data?.message || "Tạo buy request thất bại (backend error)");
    }

    let buyRequestData = null;

    if (res.data?.data?.items?.length > 0) {
      buyRequestData = res.data.data.items[0];
      console.log("Parse thành công từ data.items[0]");
    }
    else if (res.data?.data?.buyRequestId) {
      buyRequestData = res.data.data;
      console.log("Parse thành công từ data (object trực tiếp)");
    }
    else if (res.data?.buyRequestId) {
      buyRequestData = res.data;
      console.log("Parse thành công từ res.data trực tiếp");
    }

    if (!buyRequestData) {
      console.error("Không parse được buyRequestData từ bất kỳ cấu trúc nào!");
      throw new Error("Không tìm thấy dữ liệu buy request trong response");
    }

    const buyRequestId = buyRequestData.buyRequestId;
    const contractId = buyRequestData.contractId 
      || buyRequestData.contract?.contractId 
      || buyRequestData.contractIdFromBE;

    if (!buyRequestId) {
      throw new Error("Không lấy được buyRequestId");
    }

    console.log("Đang navigate sang BuySellContract với params:");
    console.log("→ buyRequestId:", buyRequestId);
    console.log("→ contractId:", contractId || "KHÔNG CÓ");

    if (!contractId) {
      console.warn("Cảnh báo: Backend chưa trả contractId. Cần sửa BE.");
    }

    navigation.navigate("BuySellContract", {
      buyRequestId,
      contractId,
    });

  } catch (err) {
    console.log("BUY ERROR chi tiết:", err);
    const errorData = err?.response?.data || err.message;
    console.log("Error data/response:", errorData);

    let errorMessage = "Tạo yêu cầu mua thất bại. Vui lòng thử lại.";
    if (errorData && typeof errorData === 'object' && !errorData.isSuccess) {
      if (errorData.errorCode === "VAL_3003") {
        errorMessage = "Bạn không thể mua chính cổ phần của mình.";
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }

    Alert.alert("Thông báo", errorMessage);
  } finally {
    setLoading(false);
  }
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

                {/* Hiển thị số dư ví*/}
                <View style={{ marginTop: 12 }}>
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    Số dư ví: <Text style={{ fontWeight: "bold" }}>{balance.toLocaleString()} VND</Text>
                  </Text>
                </View>
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

      {/* Nút cố định */}
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
                `Bạn muốn mua ${selectedShares.length} cổ phần?`,
                [
                  { text: "Huỷ", style: "cancel" },
                  { text: "Mua", onPress: handleBuy }
                ]
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