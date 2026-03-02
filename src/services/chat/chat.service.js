import api from "../api";

export const getChatRooms = () => {
  return api.get("/chat/rooms");
};

export const getMessagesByRoomId = (chatRoomId) => {
  return api.get(`/chat/rooms/${chatRoomId}/messages`);
};

export const sendMessage = (data) => {
  return api.post("/chat/messages", data);
};

export const updateMessage = (messageId, data) => {
  return api.put(`/chat/messages/${messageId}`, data);
};

export const getParticipantsByRoomId = (chatRoomId) => {
  return api.get(`/chat/rooms/${chatRoomId}/participants`);
};
