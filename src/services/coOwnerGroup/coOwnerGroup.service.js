import api from "../api";

export const getGroupsWithAvailableShares = () => {
  return api.get("/coownergroups/with-available-shares");
};

export const getAvailableSharesByGroupId = (groupId) => {
  return api.get(`/coownergroups/${groupId}/available-shares`);
};

export const createCoOwnerGroup = (data) => {
  return api.post("/coownergroups", data);
};

export const getCoOwnerGroupDetails = (groupId) => {
  return api.get(`/coownergroups/${groupId}/details`);
};


export const getMyCoOwnerGroups = () => {
  return api.get("/coownergroups/my-groups");
};