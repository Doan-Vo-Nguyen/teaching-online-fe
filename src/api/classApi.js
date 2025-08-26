import axios from "../../src/utils/customAxios";
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;
export const getAllClasses = () => {
  return axios.get("/app/classes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getClassDetail = (classId) => {
  return axios.get(`/app/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllClassesByTeacherId = (teacherId) => {
  return axios.get(`/app/classes/teacher/${teacherId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createClass = ( classData) => {
  return axios.post(`/app/classes`, classData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createClassByTeacher = (id , classData) => {
  return axios.post(`/app/users/${id}/class`, classData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const updateClass = (classId , dataUpdate) => {
  return axios.patch(`/app/classes/${classId}`, dataUpdate,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const deleteClass = (classId) => {
  return axios.delete(`/app/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllStudentClass = () => {
  return axios.get(`/app/student-classes/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStudentClassDetail = (student_class) => {
  return axios.get(
    `/app/student-classes/joined-class/${student_class}`,{},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getStudentJoinedClass = (student_id, class_id) => {
  return axios.get(
    `/app/student-classes/joined-class`,
    { student_id, class_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getClassesStudentByStudentId = (student_id) =>{
  return axios.get(
    `/app/student-classes/student/${student_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export const getAllStudentJoinedByClassId = (classId) =>{
   return axios.get(`/app/student-classes/class/${classId}`, {
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
}

