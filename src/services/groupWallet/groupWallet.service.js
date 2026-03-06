import api from "../api";

export const getGroupWalletByGroupId = (groupId) => {
  return api.get(`/group-wallets/${groupId}`);
};