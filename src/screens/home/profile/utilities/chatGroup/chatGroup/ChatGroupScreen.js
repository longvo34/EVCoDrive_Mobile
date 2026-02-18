import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import EVLoading from "../../../../../../components/animation/EVLoading";
import COLORS from "../../../../../../constants/colors";
import { getChatRooms } from "../../../../../../services/chat/chat.service";
import styles from "./ChatGroupScreen.styles";

export default function ChatGroupScreen() {
  const navigation = useNavigation();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getChatRooms();

      const data = res.data?.data || [];
      setRooms(data);
    } catch (error) {
      console.log("Lỗi lấy danh sách phòng chat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("ChatDetail", {
            chatRoomId: item.chatRoomId,
            roomName: item.roomName,
          })
        }
      >
        <View style={styles.avatar}>
          <Ionicons name="people" size={22} color={COLORS.white} />
        </View>

        <View style={styles.content}>
          <Text style={styles.roomName}>{item.roomName}</Text>
        </View>

        <View style={styles.rightSection}>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <EVLoading visible={loading} />

      {/* Header */}
    <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Nhóm chat</Text>

  <View style={{ width: 24 }} />
</View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.chatRoomId}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Chưa có nhóm chat nào
          </Text>
        }
      />
    </View>
  );
}
