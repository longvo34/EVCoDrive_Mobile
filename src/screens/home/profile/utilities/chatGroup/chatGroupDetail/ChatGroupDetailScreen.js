import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import EVLoading from "../../../../../../components/animation/EVLoading";
import COLORS from "../../../../../../constants/colors";
import styles from "./ChatGroupDetailScreen.styles";

import {
  getMessagesByRoomId,
  getParticipantsByRoomId,
  sendMessage,
  updateMessage,
} from "../../../../../../services/chat/chat.service";
import { getUserProfile } from "../../../../../../services/user/user.service";

export default function ChatDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const { chatRoomId, roomName } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [myFullName, setMyFullName] = useState(""); // ← Thêm để lưu tên thật của mình
  const [profileLoading, setProfileLoading] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // Edit states
  const [editingMessage, setEditingMessage] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Participants
  const [participants, setParticipants] = useState([]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await getUserProfile();
        const userData = res.data?.data;
        const userId = userData?.id;
        setCurrentUserId(userId);
        setMyFullName(userData?.fullName || "Bạn"); // ← Lấy fullName thật
        console.log("Tên của tôi:", userData?.fullName);
      } catch (error) {
        console.log("Lỗi lấy profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const scrollToBottom = (animated = true) => {
    if (!autoScrollEnabled) return;
    flatListRef.current?.scrollToOffset({ offset: 0, animated });
  };

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setAutoScrollEnabled(offsetY <= 50);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getMessagesByRoomId(chatRoomId);
      const rawItems = res.data?.data?.items || [];
      setMessages(rawItems);
    } catch (err) {
      console.log("Lỗi lấy tin nhắn:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      setParticipantsLoading(true);
      const res = await getParticipantsByRoomId(chatRoomId);
      const data = res.data?.data || [];
      setParticipants(data);
      console.log("Danh sách thành viên:", data);
    } catch (err) {
      console.log("Lỗi lấy thành viên:", err);
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitial = async () => {
      await fetchMessages();
      if (isMounted) {
        setAutoScrollEnabled(true);
        scrollToBottom(false);
      }
    };

    loadInitial();

    const interval = setInterval(async () => {
      const prevLength = messages.length;
      await fetchMessages();
      if (isMounted && (messages.length > prevLength || autoScrollEnabled)) {
        scrollToBottom(true);
      }
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSendOrEdit = async () => {
    if (!text.trim() || !currentUserId) return;

    try {
      if (editingMessage) {
        console.log("=== ĐANG CHỈNH SỬA TIN NHẮN ===");
        console.log("ID gọi API:", editingMessage.id);
        console.log("Nội dung mới:", text);

        if (!editingMessage.id || String(editingMessage.id).startsWith("optimistic-")) {
          console.warn("Không thể edit tin đang gửi");
          setEditingMessage(null);
          setText("");
          return;
        }

        await updateMessage(editingMessage.id, { content: text });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === editingMessage.id
              ? { ...msg, content: text, isEdited: true }
              : msg
          )
        );

        setEditingMessage(null);
        setText("");
        scrollToBottom(true);
        return;
      }

      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticMessage = {
        id: optimisticId,
        senderId: currentUserId,
        content: text,
      };

      setText("");
      setMessages((prev) => [...prev, optimisticMessage]);
      scrollToBottom(true);

      await sendMessage({ chatRoomId, content: text, type: "Text" });
      await fetchMessages();
    } catch (err) {
      console.log("Lỗi gửi/sửa:", err);
    }
  };

  const handleLongPress = (item) => {
    if (item.senderId !== currentUserId) return;
    setSelectedMessage(item);
    setShowActionMenu(true);
  };

  const startEdit = () => {
    if (!selectedMessage) return;

    setEditingMessage({
      ...selectedMessage,
      id: selectedMessage.messageId || selectedMessage.id,
    });

    setText(selectedMessage.content);
    setShowActionMenu(false);
    setSelectedMessage(null);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setText("");
  };

  const openParticipants = () => {
    setShowParticipantsModal(true);
    fetchParticipants();
  };

  const renderMessage = ({ item }) => {
    const isMine = item.senderId === currentUserId;

    return (
      <TouchableOpacity activeOpacity={0.8} onLongPress={() => handleLongPress(item)}>
        <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.otherMessage]}>
          <Text style={styles.messageText}>
            {item.content}
            {item.isEdited && <Text style={styles.editedText}> (đã chỉnh sửa)</Text>}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderParticipant = ({ item }) => {
    // Ưu tiên tên thật nếu là mình, còn lại fallback
    const displayName =
      item.accountId === currentUserId
        ? myFullName || "Bạn"
        : item.accountName || `Thành viên ${item.accountId.slice(0, 8)}`;

    console.log("Hiển thị tên:", displayName, "cho accountId:", item.accountId); // Debug

    return (
      <View style={styles.participantItem}>
        <Ionicons
          name="person-circle-outline"
          size={44}
          color={item.status === "Active" ? COLORS.softGreen : "gray"}
        />
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>{displayName}</Text>
          <Text style={styles.participantRole}>
            {item.role} • {item.status}
          </Text>
          <Text style={styles.joinedDate}>
            Tham gia: {new Date(item.joinedDate).toLocaleDateString("vi-VN")}
          </Text>
        </View>
      </View>
    );
  };

  if (profileLoading) return <EVLoading visible />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <EVLoading visible={loading} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{roomName}</Text>
        <TouchableOpacity onPress={openParticipants}>
          <Ionicons name="people-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Tin nhắn */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) =>
          item.messageId?.toString() || item.id?.toString() || `${index}`
        }
        inverted
        contentContainerStyle={{ padding: 15 }}
        initialNumToRender={15}
        windowSize={21}
        maxToRenderPerBatch={10}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={() => scrollToBottom(false)}
        onLayout={() => scrollToBottom(false)}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={editingMessage ? "Chỉnh sửa tin nhắn..." : "Nhập tin nhắn..."}
          style={styles.input}
          multiline
          autoFocus={!!editingMessage}
        />
        {editingMessage ? (
          <>
            <TouchableOpacity onPress={cancelEdit} style={{ marginRight: 12 }}>
              <Ionicons name="close-circle-outline" size={28} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSendOrEdit}>
              <Ionicons name="checkmark-circle" size={32} color={COLORS.softGreen} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleSendOrEdit}>
            <Ionicons name="send" size={28} color={COLORS.softGreen} />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal menu edit */}
      <Modal visible={showActionMenu} transparent animationType="fade" onRequestClose={() => setShowActionMenu(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActionMenu(false)}>
          <View style={styles.actionMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={startEdit}>
              <Ionicons name="create-outline" size={22} color={COLORS.text} />
              <Text style={styles.menuText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowActionMenu(false)}>
              <Text style={[styles.menuText, { color: "red" }]}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal danh sách thành viên */}
      <Modal
        visible={showParticipantsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowParticipantsModal(false)}
      >
        <View style={styles.participantModalContainer}>
          <View style={styles.participantModalContent}>
            <View style={styles.participantModalHeader}>
              <Text style={styles.participantModalTitle}>Thành viên ({participants.length})</Text>
              <TouchableOpacity onPress={() => setShowParticipantsModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {participantsLoading ? (
              <EVLoading visible />
            ) : (
              <FlatList
                data={participants}
                renderItem={renderParticipant}
                keyExtractor={(item) => item.chatParticipantId}
                ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 30, color: "gray" }}>Không có thành viên</Text>}
              />
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}