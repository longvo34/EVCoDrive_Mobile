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

export const updateUserAvatar = (formData) => {
  // axios should automatically set the correct multipart boundary when
  // you pass a FormData instance, but some environments need an explicit
  // header. including it here improves compatibility.
  console.log("PUT /user/avatar formData:", formData);
  return api.put("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
