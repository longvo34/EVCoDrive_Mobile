import api from "../api";

export const createContract = (data) => {
  return api.post("/contracts", data);
};

export const getContractById = (contractId) => {
  return api.get(`/contracts/${contractId}`);
};

export const getContractPdf = (contractId) => {
  return api.get(`/contracts/${contractId}/pdf`, {
    responseType: "blob",
  });
};

export const sendContractVerification = (contractId) => {
  return api.post(`/contracts/${contractId}/send-verification`);
};

export const verifyContractSignature = (contractId, otp) => {
  return api.post(`/contracts/${contractId}/verify-signature`, {
    otp,
  });
};

export const getContractsByMember = (memberId) => {
  return api.get(`/contracts/member/${memberId}`);
};

export const getContractsByGroup = (groupId, contractTypeCode) => {
  return api.get("/contracts/group", {
    params: {
      groupId,
      contractTypeCode,
    },
  });
};
