import api from "../api";

export const suggestPrice = (data) => {
  return api.post("/price-suggestion/suggest", data);
};
