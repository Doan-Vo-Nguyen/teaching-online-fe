import axios from "../utils/customAxios"
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;

export const getAllLectures =  () => {
  return axios.get("/app/lectures", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllLecturesByClassId = (classId) => {
  return axios.get(`/app/lectures/class/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getLectureDetails = (lectureId) => {
  return axios.get(`/app/lectures/${lectureId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const createNewLectureByClassId = (classId, lectureData) => {
  return axios.post(`app/lectures/class/${classId}`, lectureData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateLectureByIdAndClassId = (lectureId,  classId , dataUpdate) => {
  return axios.patch(`/app/lectures/${lectureId}/class/${classId}`, dataUpdate, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteLectureByIdAndClassId = (lectureId , classId) => {
  return axios.delete(`app/lectures/${lectureId}/class/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteLectureBy = (lectureId) => {
  return axios.delete(`app/lectures/${lectureId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const addFileToLectureByIdAndClassId = (lectureId, classId, lectureData) => {
  return axios.post(`app/lectures/${lectureId}/class/${classId}/content`, lectureData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getAllLecturesContentById = (lectureId) => {
  return axios.get(`/app/lectures/content/${lectureId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteLectureContent = (lectureId , lectureContentId) => {
  return axios.delete(
    `/app/lectures/${lectureId}/content/${lectureContentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
