import { EncodingType, readAsStringAsync } from "expo-file-system/legacy";
import api from "../api";

export const uploadCCCD = async (frontImage, backImage) => {
  const frontBase64 = await readAsStringAsync(frontImage.uri, {
    encoding: EncodingType.Base64,
  });
  const backBase64 = await readAsStringAsync(backImage.uri, {
    encoding: EncodingType.Base64,
  });

  const formData = new FormData();

  formData.append("frontImageFile", {
    uri: `data:image/jpeg;base64,${frontBase64}`,
    name: "front.jpg",
    type: "image/jpeg",
  });

  formData.append("backImageFile", {
    uri: `data:image/jpeg;base64,${backBase64}`,
    name: "back.jpg",
    type: "image/jpeg",
  });

  const res = await api.post("/ekyc/cccd", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("EKYC RESPONSE:", res.data);

  // 🔥 QUAN TRỌNG: parse chuỗi JSON backend trả về
  try {
    const parsed = JSON.parse(res.data.data);
    return parsed?.data?.[0] ?? null;
  } catch (err) {
    console.log("❌ Parse EKYC failed:", err);
    return null;
  }
};
