import axios from "../utils/customAxios";
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;

export const submitExamsForITStudent = (
  examId,
  studentId,
  classId,
  examContentId,
  data
) => {
  console.log("data", data);
  return axios.post(
    `/app/exam-submissions/exams/${examId}/students/${studentId}/classes/${classId}/exam-contents/${examContentId}/submissions`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const submitExams = (data) => {
  return axios.post(`/app/exam-submissions`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllFileSubmitForASpecificStudent = (
  examId,
  studentId,
  classId
) => {
  return axios.get(
    `/app/exam-submissions/exams/${examId}/students/${studentId}/classes/${classId}/submissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteFileSubmission = (
  examsSubmissionId,
  examsSubmissionContentId
) => {
  return axios.delete(
    `/app/exam-submissions/submissions/${examsSubmissionId}/content/${examsSubmissionContentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getAllStudentSumbmissions = (examId, classId) => {
  return axios.get(
    `/app/exam-submissions/exams/${examId}/classes/${classId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const gradingForStudents = (examsSubmissionId, examData) => {
  return axios.put(`/app/exam-submissions/${examsSubmissionId}`, examData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllExamSubmissions = () => {
  return axios.put(`/app/exam-submissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const runCodeForStudentIt = (examContentId, data) => {
  return axios.post(`/app/exam-submissions/exams/${examContentId}/run`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
