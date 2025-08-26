const examData = [
  {
    title: "Tổng hai số",
    description:
      "Viết một chương trình nhận vào hai số nguyên và in ra tổng của chúng.",
    examples: [
      {
        input: "2 3",
        output: "5",
        explanation: "2 + 3 = 5",
        score: 10, 
      },
      {
        input: "-1 5",
        output: "4",
        explanation: "-1 + 5 = 4",
        score: 10,
      },
    ],
    constraints: "Các số nằm trong khoảng -10^9 đến 10^9",
    difficulty: "Dễ",
    timeLimit: "1 giây",
    memoryLimit: "256 MB",
  },
  {
    title: "Sắp xếp mảng số nguyên",
    description:
      "Viết một chương trình nhận vào một dãy số nguyên và sắp xếp chúng theo thứ tự tăng dần.",
    examples: [
      {
        input: "4 2 7 1",
        output: "1 2 4 7",
        explanation: "Sắp xếp các số theo thứ tự tăng dần",
        score: 15,
      },
      {
        input: "10 5 3 8 6",
        output: "3 5 6 8 10",
        explanation: "Sắp xếp các số theo thứ tự tăng dần",
        score: 15,
      },
    ],
    constraints:
      "1 <= số lượng phần tử <= 10^5, các số nguyên nằm trong khoảng -10^9 đến 10^9",
    difficulty: "Trung bình",
    timeLimit: "2 giây",
    memoryLimit: "256 MB",
  },
  {
    title: "Dãy con có tổng lớn nhất",
    description:
      "Viết một chương trình tìm dãy con liên tiếp có tổng lớn nhất trong một dãy số nguyên (vấn đề Maximum Subarray).",
    examples: [
      {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "Dãy con [4, -1, 2, 1] có tổng lớn nhất là 6",
        score: 20,
      },
      {
        input: "1 2 3 -2 5",
        output: "9",
        explanation: "Dãy con [1,2,3,-2,5] có tổng lớn nhất là 9",
        score: 20,
      },
    ],
    constraints:
      "1 <= số lượng phần tử <= 10^5, các số nguyên nằm trong khoảng -10^9 đến 10^9",
    difficulty: "Khó",
    timeLimit: "2 giây",
    memoryLimit: "256 MB",
  },
  {
    title: "Giải phương trình bậc 2",
    description:
      "Viết một chương trình nhận vào ba số nguyên a, b, c (với a khác 0) và in ra nghiệm của phương trình ax^2 + bx + c = 0. Nếu phương trình có hai nghiệm phân biệt, in ra các nghiệm theo thứ tự tăng dần; nếu có nghiệm kép, in ra nghiệm đó; nếu phương trình vô nghiệm, in ra 'Vô nghiệm'.",
    examples: [
      {
        input: "1 -3 2",
        output: "1 2",
        explanation:
          "Phương trình x^2 - 3x + 2 = 0 có hai nghiệm phân biệt là 1 và 2.",
        score: 15,
      },
      {
        input: "1 -2 1",
        output: "1",
        explanation: "Phương trình x^2 - 2x + 1 = 0 có nghiệm kép là 1.",
        score: 15,
      },
      {
        input: "1 0 1",
        output: "Vô nghiệm",
        explanation:
          "Phương trình x^2 + 1 = 0 không có nghiệm thực vì delta < 0.",
        score: 15,
      },
    ],
    constraints: "a khác 0 và |a|, |b|, |c| <= 10^9",
    difficulty: "Trung bình",
    timeLimit: "1 giây",
    memoryLimit: "256 MB",
  },
];

export default examData;
