import axios from "../utils/customAxios";
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;

export const getExamDetail = (examId) => {
  return axios.get(`/app/exams/${examId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createNotify = (teacherId , classId ,notifyData) => {
  return axios.post(`/app/notifications/${teacherId}/${classId}`, notifyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getAllNotifyInClass = () => {
  return axios.get("/app/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateNotify = (notifyCationId, notifyData) => {
  return axios.put(
    `/app/notifications/${notifyCationId}`,
    notifyData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteNotify = (notifyCationId) => {
  return axios.delete(`/app/notifications/${notifyCationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};