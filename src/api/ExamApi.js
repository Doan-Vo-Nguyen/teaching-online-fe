import axios from "../utils/customAxios";
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;

export const getExamDetail = (examId) => {
  return axios.get(`/app/exams/${examId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createExam = (examData) => {
  return axios.post(`/app/exams`, examData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllExams = () => {
  return axios.get("/app/exams", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editExamByExamId = (examId, examData) => {
  return axios.patch(`/app/exams/${examId}`, examData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteExam = (examId) => {
  return axios.delete(`/app/exams/${examId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createExamContentByExamId = (examId, content) => {
  return axios.post(`/app/exams/${examId}/content`, content, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateExamContentByExamContentId = (examContentId, dataUpdate) => {
  return axios.patch(`/app/exams/content/${examContentId}`, dataUpdate, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllExamContentByExamId = (examId) => {
  return axios.get(`/app/exams/${examId}/content`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteExamContent = (examId) => {
  return axios.delete(`/app/exams/${examId}/content`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
