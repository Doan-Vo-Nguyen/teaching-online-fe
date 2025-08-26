/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScoreDistributionChart = ({ studentSumbmissions }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check the current theme on component mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    // Listen for changes in the system theme
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup on component unmount
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Lọc các bài nộp có điểm hợp lệ và chuyển đổi sang số
  const validGrades = studentSumbmissions
    .filter((g) => g.grade !== null)
    .map((g) => parseFloat(g.grade));

  // Khởi tạo các khoảng điểm và đếm số lượng điểm thuộc từng khoảng
  const distribution = {
    "0-4": 0,
    "4-5": 0,
    "5-6.5": 0,
    "6.5-8": 0,
    "8-9": 0,
    "9-10": 0,
  };

  validGrades.forEach((score) => {
    if (score >= 0 && score < 4) distribution["0-4"]++;
    else if (score >= 4 && score < 5) distribution["4-5"]++;
    else if (score >= 5 && score < 6.5) distribution["5-6.5"]++;
    else if (score >= 6.5 && score < 8) distribution["6.5-8"]++;
    else if (score >= 8 && score < 9) distribution["8-9"]++;
    else if (score >= 9 && score <= 10) distribution["9-10"]++;
  });

  // Cấu hình dữ liệu cho biểu đồ Bar
  const data = {
    labels: Object.keys(distribution),
    datasets: [
      {
        label: "Số lượng",
        data: Object.values(distribution),
        backgroundColor: isDarkMode
          ? "rgba(53, 162, 235, 0.6)" // Dark mode color
          : "rgba(75, 192, 192, 0.5)", // Light mode color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Phân phối điểm số" },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ScoreDistributionChart;
