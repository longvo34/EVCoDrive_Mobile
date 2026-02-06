import api from "../api";


export const getRecommendedStations = (userId) => {
  return api.get(`/stations/recommendations/${userId}`);
};

export const getStationById = (stationId) => {
  return api.get(`/stations/${stationId}`);
};