import api from "../api";

export const createPaymentUrl = (data) => {
  return api.post("/payments/create-payment-url", data);
};

export const vnpayReturn = (params) => {
  return api.get("/payments/vnpay-return", { params });
};

export const vnpayIpn = (params) => {
  return api.get("/payments/vnpay-ipn", { params });
};
