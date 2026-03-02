import api from "../api";

export const getProfileMember = async () => {
  const res = await api.get("/profile/member");

  console.log("PROFILE MEMBER FULL RESPONSE:", res);
  console.log("PROFILE MEMBER DATA:", res.data);

  return res;
};
