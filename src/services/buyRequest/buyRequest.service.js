import api from "../api";

export const createBuyRequest = (data) => {
  return api.post("/buyrequests", data);
};

export const getMyBuyRequests = () => {
  console.log("📡 API getMyBuyRequests HIT");
  return api.get("/buyrequests/my-requests");
};

export const getBuyRequestById = (id) => {
  return api.get(`/buyrequests/${id}`);
};

export const deleteBuyRequest = (id) => {
  return api.delete(`/buyrequests/${id}`);
};

export const updateBuyRequestStatus = (id, data) => {
  return api.put(`/buyrequests/${id}/status`, data);
};
