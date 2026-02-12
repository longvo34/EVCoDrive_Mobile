import api from "../api";
import { getProfileMember } from "../profile/profile.service";

export const getMyVehicles = (params = {}) => {
  return api.get("/vehicles/pagination", {
    params: {
      pageNumber: 1,
      pageSize: 20,
      sortBy: "CreatedDate",
      sortOrder: "desc",
      ...params,
    },
  });
};


export const getVehicleById = (vehicleId) => {
  return api.get(`/vehicles/${vehicleId}`);
};

export const createVehicleWithImages = async (data, images = []) => {
  const formData = new FormData();

 
  const memberRes = await getProfileMember();
  const memberId = memberRes.data.memberId;


  formData.append("VehicleModelId", data.vehicleModelId);
  formData.append("MemberId", memberId); 
  formData.append("StationId", data.stationId);
  formData.append("LicensePlate", data.licensePlate);
  formData.append("Color", data.color);
  formData.append("Year", String(data.year));

  if (data.odometer !== null)
    formData.append("Odometer", String(data.odometer));

  if (data.batteryHealth !== null)
    formData.append("BatteryHealth", String(data.batteryHealth));

  if (data.lastMaintenanceDate)
    formData.append("LastMaintenanceDate", data.lastMaintenanceDate);

  images.forEach((img, index) => {
    formData.append("images", {
      uri: img.uri,
      name: `vehicle_${index}.jpg`,
      type: "image/jpeg",
    });
  });

  return api.post("/vehicles/with-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000, // Timeout 60 giây cho upload ảnh
  });
};

export const getVehiclesByMemberId = (memberId) => {
  return api.get(`/vehicles/by-member/${memberId}`);
};

export const updateVehicle = (vehicleId, updateData) => {
  return api.put(`/vehicles/${vehicleId}`, updateData);
};

export const deleteVehicle = (vehicleId) => {
  return api.delete(`/vehicles/${vehicleId}`);
};

export const updateVehicleStatus = (vehicleId, status) => {
  return api.patch(
    `/vehicles/${vehicleId}/status`,
    null,
    {
      params: { status },
    }
  );
};

export const getAvailableSharesByVehicleId = (vehicleId) => {
  return api.get(`/vehicles/${vehicleId}/available-shares`);
};
