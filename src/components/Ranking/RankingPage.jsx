import { useState, useEffect } from "react";
import StudentCard from "./StudentCard";
import WeeklyProgress from "./WeeklyProgress";
import { getAllStudentSumbmissions } from "@/api/SubmissionApi";
import { getAllClasses } from "@/api/classApi";
import { getAllExams } from "@/api/ExamApi";
import { getUserById } from "@/api/userApi";

const RankingPage = () => {
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [sortedStudents, setSortedStudents] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("score");
  const [studentDetails, setStudentDetails] = useState([]);

  useEffect(() => {
    fetchAllClasses();
  }, []);

  useEffect(() => {
    console.log("selectedClassId", selectedClassId);
    if (selectedClassId) {
      fetchAllExamByClassId(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedClassId && selectedExamId) {
      fetchAllStudentSubmissions(selectedExamId, selectedClassId);
    }
  }, [selectedClassId, selectedExamId]);

  useEffect(() => {
    // Sort students based on criteria whenever submissions or sort criteria change
    sortStudents();
  }, [studentSubmissions, sortCriteria]);
  useEffect(() => {
    fetchStudentDetails();
  }, [studentSubmissions]);

  const fetchStudentDetails = async () => {
    try {
      const results = await Promise.all(
        studentSubmissions.map((student) => getUserById(student?.student_id))
      );
      console.log("results", results);
      const fetchedStudents = results
        .filter((res) => res.success)
        .map((res) => res.data);
      console.log("fetchedStudents", fetchedStudents);
      setStudentDetails(fetchedStudents);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };
  const fetchAllStudentSubmissions = async (
    selectedExamId,
    selectedClassId
  ) => {
    try {
      const res = await getAllStudentSumbmissions(
        selectedExamId,
        selectedClassId
      );
      if (res.success) {
        setStudentSubmissions(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllClasses = async () => {
    try {
      const res = await getAllClasses();
      setClasses(res.data);
      if (res.data && res.data.length > 0) {
        setSelectedClassId(res.data[0].class_id);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchAllExamByClassId = async (selectedClassId) => {
    try {
      const res = await getAllExams();
      if (res.data) {
        let examData = res.data.filter(
          (exam) => exam.class_id.toString() === selectedClassId.toString()
        );
        console.log("Exams:", examData);
        setExams(examData);
        if (examData.length > 0) {
          setSelectedExamId(examData[0].exam_id);
        }
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const sortStudents = () => {
    if (!studentSubmissions.length) {
      setSortedStudents([]);
      return;
    }

    let filteredSubmissions = [...studentSubmissions];
    const currentDate = new Date();

    if (timeFilter === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 7);
      filteredSubmissions = filteredSubmissions.filter(
        (sub) => new Date(sub.submittedAt) >= oneWeekAgo
      );
    } else if (timeFilter === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(currentDate.getMonth() - 1);
      filteredSubmissions = filteredSubmissions.filter(
        (sub) => new Date(sub.submittedAt) >= oneMonthAgo
      );
    }

    // Group submissions by student
    const studentMap = new Map();
    filteredSubmissions.forEach((submission) => {
      if (!studentMap.has(submission.studentId)) {
        studentMap.set(submission.studentId, {
          id: submission.studentId,
          name: submission.studentName,
          avatar: submission.studentAvatar,
          totalScore: 0,
          bestScore: 0,
          totalAttempts: 0,
          averageTime: 0,
          submissions: [],
        });
      }

      const student = studentMap.get(submission.studentId);
      student.submissions.push(submission);
      student.totalScore += submission.score;
      student.bestScore = Math.max(student.bestScore, submission.score);
      student.totalAttempts += 1;
    });

    // Calculate average time and other metrics
    studentMap.forEach((student) => {
      console.log("Student:", student);
      if (student.submissions.length > 0) {
        const totalTime = student.submissions.reduce(
          (sum, sub) => sum + (sub.completionTime || 0),
          0
        );
        student.averageTime = totalTime / student.submissions.length;
        student.averageScore = student.totalScore / student.submissions.length;
      }
    });

    // Convert map to array and sort based on criteria
    let sortedArray = Array.from(studentMap.values());

    if (sortCriteria === "score") {
      sortedArray.sort((a, b) => b.bestScore - a.bestScore);
    } else if (sortCriteria === "time") {
      sortedArray.sort((a, b) => a.averageTime - b.averageTime);
    } else if (sortCriteria === "attempts") {
      sortedArray.sort((a, b) => b.totalAttempts - a.totalAttempts);
    }

    setSortedStudents(sortedArray);
  };

  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
    setSelectedExamId("");
  };

  const handleExamChange = (e) => {
    setSelectedExamId(e.target.value);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 dark:bg-blue-950">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 L100,0 L100,100 L0,100 Z"
                  fill="url(#grid-pattern)"
                />
              </svg>
              <defs>
                <pattern
                  id="grid-pattern"
                  x="0"
                  y="0"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
            </div>

            {/* Header content */}
            <div className="px-6 py-10 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
                    <svg
                      className="w-8 h-8 mr-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 9L12 5L16 9M15 11L11 15L7 11"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                    Bảng Xếp Hạng Học Sinh
                  </h1>
                  <p className="text-blue-100 mt-2">
                    Theo dõi thành tích và tiến độ của học sinh trong các bài
                    thi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white dark:bg-blue-900 rounded-lg p-4 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Chọn lớp
              </label>
              <select
                value={selectedClassId}
                onChange={handleClassChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-blue-800 dark:border-blue-700 dark:text-white"
              >
                <option value="">Tất cả các lớp</option>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Chọn bài thi
              </label>
              <select
                value={selectedExamId}
                onChange={handleExamChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-blue-800 dark:border-blue-700 dark:text-white"
                disabled={!selectedClassId}
              >
                <option value="">Tất cả các bài thi</option>
                {exams.map((exam) => (
                  <option key={exam.exam_id} value={exam.exam_id}>
                    {exam.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {studentSubmissions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {studentSubmissions?.map((student, index) => (
                <div
                  key={student.id}
                  className={`transform hover:scale-105 transition-transform duration-200 ${
                    index === 0 ? "md:-mt-4" : ""
                  }`}
                >
                  <StudentCard
                    student={student}
                    position={index + 1}
                    studentDetails={studentDetails}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-blue-900 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-300">
              {selectedClassId && selectedExamId
                ? "Không có dữ liệu bài làm nào cho bài thi này"
                : "Vui lòng chọn lớp và bài thi để xem xếp hạng"}
            </p>
          </div>
        )}

        {studentSubmissions.length > 0 && (
          <WeeklyProgress studentSubmissions={studentSubmissions} />
        )}
      </div>
    </div>
  );
};

export default RankingPage;
