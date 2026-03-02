import api from "../api";

export const getWalletByMemberId = (memberId) => {
  return api.get(`/wallets/${memberId}`);
};

export const createWallet = (memberId) => {
  return api.post(`/wallets/${memberId}`);
};

export const topUpWallet = (data) => {
  return api.put("/wallets/top-up", data);
};

export const withdrawWallet = (data) => {
  return api.put("/wallets/withdraw", data);
};

export const getWithdrawalsByMemberId = (memberId) => {
  return api.get(`/wallets/${memberId}/withdrawals`);
};

export const transferToGroup = (data) => {
  return api.post("/wallets/transfer-to-group", data);
};
