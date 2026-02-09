import api from "../api";

export const createSellRequest = (data) => {
  return api.post("/sellrequests", data);
};

export const getMySellRequests = () => {
  return api.get("/sellrequests/my-requests");
};

export const updateSellRequest = (id, data) => {
  return api.put(`/sellrequests/${id}`, data);
};

export const cancelSellRequest = (id) => {
  return api.delete(`/sellrequests/${id}/cancel`);
};
