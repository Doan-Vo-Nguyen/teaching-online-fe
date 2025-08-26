import axios from "axios";

export const getAllAssignments = () => {
  return axios.get("http://localhost:3000/assignments");
};

export const getAssignmentById = (assignmentId) => {
  return axios.get(`http://localhost:3000/assignments/${assignmentId}`);
};

export const createNewAssignment = (assignmentData) => {
  return axios.post("http://localhost:3000/assignments", assignmentData);
};

export const deleteAssignment  = (userId) => {
  return axios.delete(`http://localhost:3000/assignments/${userId}`);
};

export const editAssignment = (assignmentId, assignmentData) => {
  return axios.put(
    `http://localhost:3000/assignments/${assignmentId}`,
    assignmentData
  );
};
