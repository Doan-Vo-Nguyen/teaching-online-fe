import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "@/components/Loading";
import PublicRoute from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
const Layout = lazy(() => import("@/components/Layout"));
const LayoutDashboard = lazy(() => import("@/components/LayoutDashboard"));
const LayoutClientClass = lazy(() =>
  import("@/components/client/class/LayoutClientClass")
);

const Login = lazy(() => import("@/page/auth/Login"));
const SignUp = lazy(() => import("@/page/auth/SignUp"));
const ForgotPassword = lazy(() => import("@/components/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/components/ResetPasswordPage"));

const Homepage = lazy(() => import("@/components/common/Homepage"));
const UserProfile = lazy(() => import("@/components/User/UserProfile"));
const ClientClassList = lazy(() =>
  import("@/components/client/class/ClientClassList")
);
const TeacherClassDetail = lazy(() =>
  import("@/components/Class-teacher/class/TeacherClassDetail")
);
const ExamsDetail = lazy(() =>
  import("@/components/Class-teacher/class/Exams/ExamsDetail")
);
const RoadmapPage = lazy(() => import("@/components/Roadmap/RoadmapPage"));
const BlogPage = lazy(() => import("@/components/Blog/BlogPage"));
const RankingPage = lazy(() => import("@/components/Ranking/RankingPage"));
const Statistics = lazy(() =>
  import("@/components/Teacher/Statistics/Statitics")
);
const CodeEditor = lazy(() => import("@/components/CodeEditor/CodeEditor"));
const NotFound = lazy(() => import("@/components/Notfound"));
const UnAuthorized = lazy(() => import("@/components/UnAuthorized"));

const CreateClass = lazy(() => import("@/components/Class/CreateClass"));
const EditClass = lazy(() => import("@/components/Class/EditClass"));
const LectureDetail = lazy(() =>
  import("@/components/Class-teacher/class/Lectures/LectureDetail")
);
const EditLecture = lazy(() =>
  import("@/components/Class-teacher/class/Lectures/EditLecture")
);
const CreateExamForAllStudent = lazy(() =>
  import("@/components/Class-teacher/class/Exams/CreateExamForAllStudent")
);
const EditExamForAllStudent = lazy(() =>
  import("@/components/Class-teacher/class/Exams/EditExamForAllStudent")
);
const CreateExamForIT = lazy(() =>
  import("@/components/Class-teacher/class/Exams/CreateExamForIt")
);

const UserList = lazy(() => import("@/page/Admin/UserManagement/UserList"));
const CreateUser = lazy(() => import("@/page/Admin/UserManagement/CreateUser"));
const ExamContentDetail = lazy(() =>
  import(
    "@/components/Class-teacher/class/Exams/ExamContentForIT/ExamContentDetail"
  )
);
const AddExamContentPage = lazy(() =>
  import(
    "@/components/Class-teacher/class/Exams/ExamContentForIT/AddExamContent"
  )
);
const EditExamContentPage = lazy(() =>
  import(
    "@/components/Class-teacher/class/Exams/ExamContentForIT/EditExamContent"
  )
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* ----------------- Public Routes ----------------- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* --------------- Routes dùng chung cho tất cả người dùng đã đăng nhập --------------- */}
        <Route
          path="/"
          element={
            <PrivateRoutes allowedRoles={["admin", "teacher", "student"]}>
              <Layout />
            </PrivateRoutes>
          }
        >
          {/* Các trang hiển thị trong Layout (sẽ có Header) */}
          <Route index element={<Homepage />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="profile/:userId" element={<UserProfile />} />

          {/* Routes lớp học sử dụng LayoutClientClass để có Sidebar, nhưng vẫn nằm trong Layout để giữ Header */}
          <Route path="classes" element={<LayoutClientClass />}>
            <Route index element={<ClientClassList />} />
            <Route path=":classId" element={<TeacherClassDetail />} />
            <Route path=":classId/exams/:examId" element={<ExamsDetail />} />
            <Route
              path=":classId/exams/:examId/examContent/:examContentId"
              element={<ExamContentDetail />}
            />
            <Route
              path=":classId/exams/:examId/examContent/:examContentId/code-env"
              element={<CodeEditor />}
            />

            <Route
              path=":classId/lectures/:lectureId"
              element={<LectureDetail />}
            />
          </Route>

          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="staticics" element={<Statistics />} />

          <Route path="unauthorized" element={<UnAuthorized />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ----------------- Teacher Routes (cho admin & teacher) ----------------- */}
        <Route
          path="/teacher"
          element={
            <PrivateRoutes allowedRoles={["admin", "teacher", "student"]}>
              <Layout />
            </PrivateRoutes>
          }
        >
          {/* Các route của teacher sẽ được bọc bởi Layout có Header */}
          <Route index element={<Navigate to="classes" replace />} />
          <Route path="classes/create" element={<CreateClass />} />
          <Route path="classes/update/:classId" element={<EditClass />} />
          <Route
            path="classes/:classId/lectures/:lectureId"
            element={<LectureDetail />}
          />
          <Route
            path="classes/:classId/lectures/update/:lectureId"
            element={<EditLecture />}
          />
          <Route
            path="classes/:classId/exams/create-for-all"
            element={<CreateExamForAllStudent />}
          />
          <Route
            path="classes/:classId/exams/update/:examId"
            element={<EditExamForAllStudent />}
          />
          <Route
            path="classes/:classId/exams/create-for-it"
            element={<CreateExamForIT />}
          />
          <Route
            path="classes/:classId/exams/:examId/create/exam-content"
            element={<AddExamContentPage />}
          />
          <Route
            path="classes/:classId/exams/:examId/update/exam-content/:examContentId"
            element={<EditExamContentPage />}
          />
        </Route>

        {/* ----------------- Admin Routes ----------------- */}
        <Route
          path="/admin"
          element={
            <PrivateRoutes allowedRoles={["admin"]}>
              <LayoutDashboard />
            </PrivateRoutes>
          }
        >
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:userId" element={<UserProfile />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="classes/create" element={<CreateClass />} />
          <Route path="classes/update/:classId" element={<EditClass />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
