// src/utils/colorUtils.js
// Hàm tạo màu ngẫu nhiên
export const getRandomColor = () => {
  const colors = [
    "#4285F4", // Google Blue
    "#0F9D58", // Google Green
    "#DB4437", // Google Red
    "#F4B400", // Google Yellow
    "#673AB7", // Purple
    "#3F51B5", // Indigo
    "#2196F3", // Blue
    "#03A9F4", // Light Blue
    "#00BCD4", // Cyan
    "#009688", // Teal
    "#4CAF50", // Green
    "#8BC34A", // Light Green
    "#CDDC39", // Lime
    "#FFC107", // Amber
    "#FF9800", // Orange
    "#FF5722", // Deep Orange
    "#795548", // Brown
    "#607D8B", // Blue Grey
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
