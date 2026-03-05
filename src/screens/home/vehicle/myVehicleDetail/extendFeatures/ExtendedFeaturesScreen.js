import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EVLoading from "../../../../../components/animation/EVLoading";
import styles from "./ExtendedFeaturesScreen.styles";

import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { getContractsByGroup } from "../../../../../services/contract/contract.service";
import { getAccessToken } from "../../../../../utils/authStorage";

export default function ExtendedFeaturesScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);

  const { groupId } = route.params;

  const handleDownloadGroupContract = async () => {
  try {
    setLoading(true);

    const res = await getContractsByGroup(groupId);

    const contracts = res?.data?.data || [];

    if (contracts.length === 0) {
      Alert.alert("Thông báo", "Không tìm thấy hợp đồng của nhóm");
      return;
    }

    const token = await getAccessToken();
    const API_URL = Constants.expoConfig.extra.API_URL;

    for (const contract of contracts) {
      const fileName = `Hop-dong_${contract.contractNumber}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadUrl = `${API_URL}/contracts/${contract.contractId}/pdf`;

      const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: contract.contractNumber,
          UTI: "com.adobe.pdf",
        });
      }
    }
  } catch (err) {
    console.log("DOWNLOAD CONTRACT ERROR", err);
    Alert.alert("Lỗi", "Không thể tải hợp đồng nhóm");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ flex: 1 }}>
      <EVLoading visible={loading} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color={styles.iconColor.color} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tiện ích mở rộng</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* QUẢN LÝ VẬN HÀNH */}
        <Text style={styles.sectionTitle}>QUẢN LÝ VẬN HÀNH</Text>

        <View style={styles.grid}>
          {[
            { label: "Lịch xe chung", icon: "calendar-outline", type: "yellow" },
            { label: "Chuyến đi của tôi", icon: "car-outline", type: "yellow" },
            { label: "Quỹ chung", icon: "wallet-outline", type: "yellow" },
            { label: "Thành viên", icon: "people-outline", type: "yellow" },
          ].map((item, index) => (
            <View key={index} style={styles.item}>
              <View
                style={
                  item.type === "yellow"
                    ? styles.circleYellow
                    : styles.circleGray
                }
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={
                    item.type === "yellow"
                      ? styles.yellowIcon.color
                      : styles.grayIcon.color
                  }
                />
              </View>
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* HỒ SƠ & PHÁP LÝ */}
        <Text style={styles.sectionTitle}>HỒ SƠ & PHÁP LÝ</Text>

        <View style={styles.grid}>
          {[
            {
              label: "Hợp đồng của nhóm",
              icon: "document-text-outline",
              action: handleDownloadGroupContract,
            },
            { label: "Giấy tờ xe", icon: "clipboard-outline" },
            { label: "Bảo hiểm", icon: "shield-checkmark-outline" },
            { label: "Quy định nhóm", icon: "hammer-outline" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={item.action}
            >
              <View style={styles.circleGray}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={styles.grayIcon.color}
                />
              </View>
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CỘNG ĐỒNG & TIỆN ÍCH */}
        <Text style={styles.sectionTitle}>CỘNG ĐỒNG & TIỆN ÍCH</Text>

        <View style={styles.grid}>
          <View style={styles.item}>
            <View style={styles.circleYellow}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={styles.yellowIcon.color}
              />
            </View>
            <Text style={styles.itemText}>Chat nhóm</Text>
          </View>

          <View style={styles.item}>
            <View style={styles.circleGray}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={styles.grayIcon.color}
              />
              <View style={styles.dot} />
            </View>
            <Text style={styles.itemText}>Thông báo</Text>
          </View>

          <View style={styles.item}>
            <View style={styles.circleGray}>
              <Ionicons
                name="build-outline"
                size={22}
                color={styles.grayIcon.color}
              />
            </View>
            <Text style={styles.itemText}>Lịch sử bảo dưỡng</Text>
          </View>

          <View style={styles.item}>
            <View style={styles.circleRed}>
              <Ionicons
                name="warning-outline"
                size={22}
                color={styles.redIcon.color}
              />
            </View>
            <Text style={styles.itemText}>Báo cáo sự cố</Text>
          </View>
        </View>

        {/* MỤC ĐẶC BIỆT */}
        <Text style={styles.sectionTitle}>MỤC ĐẶC BIỆT</Text>

        <View style={styles.grid}>
          <View style={styles.item}>
            <View style={styles.circleYellow}>
              <Ionicons
                name="pricetag-outline"
                size={22}
                color={styles.yellowIcon.color}
              />
            </View>
            <Text style={styles.itemText}>Đăng bán gói đầu tư</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}