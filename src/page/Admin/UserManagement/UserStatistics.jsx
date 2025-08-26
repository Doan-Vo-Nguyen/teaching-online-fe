/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Users, UserCheck, UserX, ChartBar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserStatistics = ({ users }) => {
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === "admin").length;
    const teacherCount = users.filter((user) => user.role === "teacher").length;
    const studentCount = users.filter((user) => user.role === "student").length;

    const chartData = [
      { name: "Admin", count: adminCount },
      { name: "Teacher", count: teacherCount },
      { name: "Student", count: studentCount },
    ];

    return {
      totalUsers,
      adminCount,
      teacherCount,
      studentCount,
      chartData,
    };
  }, [users]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Admin"
          value={stats.adminCount}
          icon={UserCheck}
          color="bg-purple-500"
        />
        <StatCard
          title="Giáo viên"
          value={stats.teacherCount}
          icon={UserCheck}
          color="bg-green-500"
        />
        <StatCard
          title="Học sinh"
          value={stats.studentCount}
          icon={UserX}
          color="bg-orange-500"
        />
      </div>

      {/* Biểu đồ */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <ChartBar className="w-5 h-5" />
          Phân bổ người dùng theo vai trò
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <XAxis
                dataKey="name"
                stroke="#8884d8"
                tick={{
                  fill: "currentColor",
                  style: { color: "gray" },
                }}
              />
              <YAxis
                stroke="#8884d8"
                tick={{
                  fill: "currentColor",
                  style: { color: "gray" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937", // dark:bg-gray-800
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
                labelStyle={{ color: "white" }}
                itemStyle={{ color: "white" }}
              />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
