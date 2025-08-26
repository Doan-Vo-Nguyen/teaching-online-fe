import axios from "../../src/utils/customAxios";
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;

export const getAllUsers = () => {
  return axios.get("/app/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserById = (userId) => {
  return axios.get(`/app/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createNewUser = (userData) => {
  return axios.post("app/users", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUser = (userId) => {
  return axios.delete(`app/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = (userId, dataUpdate) => {
  return axios.patch(`/app/users/${userId}`, dataUpdate, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserRole = (userId, role) => {
  return axios.patch(
    `/app/users/${userId}/roles/`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changePassword = (userId, passwordData) => {
  return axios.put(`/app/users/${userId}/password/`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const forgotPassword = (email) => {
  return axios.post(`/auth/forgot-password?email=${email}`);
};

export const resetPassword = (email, code, password) => {
  return axios.put(`/auth/reset-password?email=${email}`, {
    code,
    password,
  });
};
export const login = (email, password) => {
  return axios.post("/auth/login", { email, password });
};

export const register = (fullname, email, password) => {
  return axios.post("/auth/register", { fullname, email, password });
};

export const joinClass = (userId, class_join_code) => {
  return axios.post(
    `/app/users/${userId}/join/${class_join_code}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const leaveClass = (userId, classId) => {
  return axios.post(
    `/app/users/${userId}/leave/${classId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const getUserByName = (name) => {
  return axios.get(`/app/users/search?name=${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
