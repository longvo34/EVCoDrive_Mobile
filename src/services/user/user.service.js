import api from "../api";

export const updateUserProfile = (data) => {
  console.log("PUT /user/profile payload:", data);
  return api.put("/user/profile", data);
};

export const getUserProfile = () => {
  return api.get("/user/profile");
};

export const getUserById = (id) => {
  return api.get(`/user/${id}`);
};
