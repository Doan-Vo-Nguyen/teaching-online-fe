import axios from "../../src/utils/customAxios";
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;

export const createTestcaseForExam = (examContentId, testcaseData) => {
  return axios.post(`/app/testcases/${examContentId}`, testcaseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllTestCase = () => {
  return axios.get("/app/testcases", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllTestCaseByExamContentId = (examContentId) => {
  return axios.get(`/app/testcases/content/${examContentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editTestCase = (testCaseId, examContentId, data) => {
  return axios.put(
    `/app/testcases/${testCaseId}/content/${examContentId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleleTestCase = (testCaseId) => {
  return axios.delete(`/app/testcases/${testCaseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
