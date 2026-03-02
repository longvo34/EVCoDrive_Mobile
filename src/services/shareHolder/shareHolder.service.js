import api from "../api";


export const getMyShares = () => {
  return api.get("/ShareHolder/my-shares");
};