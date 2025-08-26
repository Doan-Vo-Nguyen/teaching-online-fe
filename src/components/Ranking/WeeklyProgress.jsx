import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeeklyProgress = ({ studentSubmissions }) => {
  console.log("studentSubmissions", studentSubmissions);

  // Tính toán dữ liệu biểu đồ theo điểm (1 đến 10)
  // Mỗi điểm từ 1 đến 10 sẽ có giá trị số lượng bài làm tương ứng
  const data = useMemo(() => {
    // Khởi tạo đối tượng với điểm từ 1 đến 10
    const gradeDistribution = {};
    for (let score = 1; score <= 10; score++) {
      gradeDistribution[score] = 0;
    }

    studentSubmissions.forEach((submission) => {
      if (
        submission.grade !== undefined &&
        submission.grade !== null &&
        submission.grade !== ""
      ) {
        const grade = Number(submission.grade);
        // Chỉ tính những bài làm có điểm từ 1 đến 10
        if (!isNaN(grade) && grade >= 1 && grade <= 10) {
          gradeDistribution[grade] += 1;
        }
      }
    });

    // Chuyển kết quả về mảng với thứ tự từ 1 đến 10
    return Object.keys(gradeDistribution)
      .sort((a, b) => Number(a) - Number(b))
      .map((grade) => ({
        name: grade,
        submissions: gradeDistribution[grade],
      }));
  }, [studentSubmissions]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl dark:shadow-gray-900/20 p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Thống kê theo điểm
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              className="text-xs"
              tick={{ fill: "#6b7280", className: "dark:[fill:#e5e7eb]" }}
              label={{ value: "Điểm", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              type="number"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", className: "dark:[fill:#e5e7eb]" }}
              label={{
                value: "Số bài làm",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
              allowDecimals={false}
              interval={1}
            />

            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: "#1f2937",
              }}
              itemStyle={{ color: "#1f2937" }}
              wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-100"
            />
            <Bar
              dataKey="submissions"
              fill="#3b82f6"
              className="dark:[fill:#60a5fa]"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyProgress;
