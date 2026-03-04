import api from "../api";

export const suggestPrice = (data) => {
  return api.post("/price-suggestion/suggest", data);
};

export const confirmPriceSuggestion = (suggestedPrice, data) => {
  return api.post(
    `/price-suggestion/confirm?suggestedPrice=${suggestedPrice}`,
    data
  );
};
