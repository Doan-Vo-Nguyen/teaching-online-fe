/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Code,
  Layout,
  Layers,
  Database,
  GitBranch,
  CheckCircle,
  Circle,
  CircleDot,
  Clock,
  Laptop,
  Network,
  BrainCircuit,
  BookOpen,
  Server,
  ShieldCheck,
  FileCode,
  LineChart,
  Briefcase,
  Milestone,
  Lightbulb,
  Code2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// RoadmapItem Component
const RoadmapItem = ({ item }) => {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card className={`roadmap-item flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.opacity}`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center`}>
        {item.icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(item.status)} mb-3`}>
              {item.statusText}
            </span>
          </div>
       
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm text-blue-600 dark:text-blue-400 py-1">
              Xem chi tiết môn học
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {item.subjects.map((subject, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className={`w-8 h-8 rounded-full ${subject.importance === "core" ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"} flex items-center justify-center flex-shrink-0`}>
                      {subject.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{subject.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{subject.credits} tín chỉ</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="skills">
            <AccordionTrigger className="text-sm text-blue-600 dark:text-blue-400 py-1">
              Kỹ năng đạt được
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1 text-xs rounded-md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          {item.opportunities && (
            <AccordionItem value="opportunities">
              <AccordionTrigger className="text-sm text-blue-600 dark:text-blue-400 py-1">
                Cơ hội nghề nghiệp
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {item.opportunities.map((opp, idx) => (
                    <li key={idx}>{opp}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </Card>
  );
};

// YearHeader Component
const YearHeader = ({ year, description, icon }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-grow text-center md:text-left">
        <h2 className="text-2xl font-bold mb-1">{year}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{description}</p>
      
      </div>
    </div>
  );
};

// Main Component
export default function ITRoadmapPage() {
  const [selectedMajor, setSelectedMajor] = useState("software");

  useEffect(() => {
    // Check for saved theme preference
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Data for different majors
  const majorsData = {
    software: {
      title: "Công Nghệ Phần Mềm",
      description:
        "Chuyên ngành tập trung vào quy trình phát triển, thiết kế và bảo trì phần mềm.",
      years: [
        {
          id: 1,
          title: "Năm 1: Nền Tảng CNTT",
          description: "Xây dựng nền tảng kiến thức cơ bản và tư duy lập trình",

          icon: <BookOpen className="w-8 h-8" />,
          items: [
            {
              id: 1,
              title: "Học kỳ 1: Kiến thức đại cương",
              description: "Các môn học cơ bản tạo nền tảng cho sinh viên CNTT",

              icon: <BookOpen className="w-6 h-6" />,
              iconBg:
                "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Giải tích ",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Đại số tuyến tính",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Toán logic",
                  credits: 2,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Thực hành lắp ráp máy tính",
                  credits: 1,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Lập trình cơ bản",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },

                {
                  name: "Tiếng Anh 1",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Triết học Mác-Lênin",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Tư duy logic",
                "Lập trình căn bản",
                "Giải quyết vấn đề",
                "Tiếng Anh cơ bản",
              ],
              opacity: "opacity-100",
            },
            {
              id: 2,
              title: "Học kỳ 2: Nền tảng lập trình",
              description: "Phát triển kỹ năng lập trình và tư duy thuật toán",

              icon: <Code className="w-6 h-6" />,
              iconBg:
                "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Nhập môn thuật toán",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Phương pháp tính",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Hệ quản trị cơ sở dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Pháp luật đại cương",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Triết học Mac-LeNin",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Tiếng anh 2",
                  credits: 4,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "OOP",
                "Cấu trúc dữ liệu",
                "Thuật toán cơ bản",
                "Giải quyết vấn đề",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 2,
          title: "Năm 2: Kiến Thức Chuyên Ngành Cơ Sở",
          description:
            "Đi sâu vào cơ sở ngành và bắt đầu tiếp cận chuyên ngành",

          icon: <Laptop className="w-8 h-8" />,
          items: [
            {
              id: 3,
              title: "Học kỳ 1: Kiến thức cơ sở hệ thống",
              description: "Hiểu biết về kiến trúc máy tính và hệ điều hành",

              icon: <Server className="w-6 h-6" />,
              iconBg:
                "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
              statusIcon: <CircleDot className="w-6 h-6 text-blue-500" />,
              subjects: [
                {
                  name: "Lập trình hướng đối tượng",
                  credits: 3,
                  importance: "core",
                  icon: <Layout className="w-4 h-4" />,
                },
                {
                  name: "Xác xuất thống kê",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn mạng máy tính",
                  credits: 3,
                  importance: "core",
                  icon: <ShieldCheck className="w-4 h-4" />,
                },
                {
                  name: "Toán rời rạc",
                  credits: 1,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "Giới thiệu ngành CNTT",
                  credits: 1,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Kĩ thuật lập trình",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Kinh tế chính trị Mac-LeNin",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Quản lý bộ nhớ",
                "Xử lý dữ liệu",
                "Quản lý tiến trình",
                "Thiết kế CSDL",
              ],
              opacity: "opacity-100",
            },
            {
              id: 4,
              title: "Học kỳ 2: Phát triển ứng dụng",
              description:
                "Xây dựng nền tảng phát triển ứng dụng web và bảo mật",

              icon: <Layout className="w-6 h-6" />,
              iconBg:
                "bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300",
              statusIcon: <Clock className="w-6 h-6 text-yellow-500" />,
              subjects: [
                {
                  name: "Thực tập nhận thức",
                  credits: 1,
                  importance: "core",
                  icon: <Layout className="w-4 h-4" />,
                },
                {
                  name: "Cấu trúc dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Lập trình trên Desktop",
                  credits: 3,
                  importance: "core",
                  icon: <ShieldCheck className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn cơ sở dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "Lập trình ứng dụng web",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Tiếng anh cho CNTT",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Chủ nghĩa xã hội khoa học",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Frontend cơ bản",
                "Java",
                "Thiết kế hệ thống",
                "Bảo mật thông tin",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 3,
          title: "Năm 3: Chuyên Ngành Và Ứng Dụng",
          description:
            "Đi sâu vào chuyên ngành công nghệ phần mềm và thực hành",
          icon: <Layers className="w-8 h-8" />,
          items: [
            {
              id: 5,
              title: "Học kỳ 1: Quy trình phát triển phần mềm",
              description:
                "Học các phương pháp phát triển phần mềm chuyên nghiệp",

              icon: <GitBranch className="w-6 h-6" />,
              iconBg:
                "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Nguyên lí hệ điều hành",
                  credits: 3,
                  importance: "core",
                  icon: <GitBranch className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn công nghệ phần mềm",
                  credits: 3,
                  importance: "core",
                  icon: <CheckCircle className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn trí tuệ nhân tạo",
                  credits: 3,
                  importance: "core",
                  icon: <Layout className="w-4 h-4" />,
                },
                {
                  name: "Quản trị mạng",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Thực hành làm việc nhóm",
                  credits: 2,
                  importance: "core",
                  icon: <Code2 className="w-4 h-4" />,
                },
                {
                  name: "Lịch sử Đảng Cộng sản Việt Nam",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Khởi nghiệp",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Agile/Scrum",
                "Testing",
                "ReactJS/Angular",
                "Mobile Development",
              ],
              opportunities: [
                "Thực tập Fullstack Developer",
                "Frontend Developer (Junior)",
                "QA Engineer (Junior)",
              ],
              opacity: "opacity-100",
            },
            {
              id: 6,
              title: "Học kỳ 2: Công nghệ phần mềm nâng cao",
              description: "Tiếp cận các công nghệ phần mềm hiện đại",

              icon: <Database className="w-6 h-6" />,
              iconBg:
                "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Phân tích và đặc tả yêu cầu phần mềm",
                  credits: 4,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "DevOps cơ bản",
                  credits: 3,
                  importance: "core",
                  icon: <GitBranch className="w-4 h-4" />,
                },
                {
                  name: "Hệ thống quản lý phiên bản",
                  credits: 2,
                  importance: "core",
                  icon: <GitBranch className="w-4 h-4" />,
                },
                {
                  name: "Phát triển backend",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Đồ án cơ sở ngành",
                  credits: 2,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
              ],
              skills: [
                "CI/CD",
                "Git Flow",
                "Microservices",
                "REST API",
                "Node.js/Spring",
              ],
              opportunities: [
                "Backend Developer (Junior)",
                "DevOps Engineer (Junior)",
                "Software Engineer (Intern/Junior)",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 4,
          title: "Năm 4: Chuyên Sâu Và Thực Tiễn",
          description: "Hoàn thiện kiến thức và thực hiện đồ án tốt nghiệp",
          icon: <Briefcase className="w-8 h-8" />,
          items: [
            {
              id: 7,
              title: "Học kỳ 1: Công nghệ hiện đại và dự án",
              description:
                "Áp dụng kiến thức vào dự án thực tế và học công nghệ mới",

              icon: <Lightbulb className="w-6 h-6" />,
              iconBg:
                "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Điện toán đám mây",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Phát triển phần mềm hướng dịch vụ",
                  credits: 3,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "Bảo trì phần mềm",
                  credits: 3,
                  importance: "core",
                  icon: <GitBranch className="w-4 h-4" />,
                },
                {
                  name: "IoT & ứng dụng",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Thực tập doanh nghiệp",
                  credits: 3,
                  importance: "core",
                  icon: <Briefcase className="w-4 h-4" />,
                },
              ],
              skills: [
                "Cloud Services (AWS/Azure/GCP)",
                "Microservices",
                "Software Maintenance",
                "IoT Integration",
              ],
              opportunities: [
                "Software Engineer",
                "DevOps Engineer",
                "Full Stack Developer",
                "Project Management Assistant",
              ],
              opacity: "opacity-100",
            },
            {
              id: 8,
              title: "Học kỳ 2: Khóa luận tốt nghiệp",
              description:
                "Hoàn thành đồ án tốt nghiệp và chuẩn bị hành trang vào nghề",

              icon: <FileCode className="w-6 h-6" />,
              iconBg:
                "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Khóa luận tốt nghiệp",
                  credits: 10,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
                {
                  name: "Quản lý dự án phần mềm",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Kiến trúc hướng dịch vụ",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Project Management",
                "Research Methods",
                "Software Architecture",
                "Portfolio Development",
              ],
              opportunities: [
                "Software Engineer",
                "Software Architect (Junior)",
                "Product Manager (Junior)",
                "Technical Consultant",
              ],
              opacity: "opacity-100",
            },
          ],
        },
      ],
    },
    ai: {
      title: "Trí Tuệ Nhân Tạo",
      description:
        "Chuyên ngành tập trung vào học máy, thị giác máy tính và xử lý ngôn ngữ tự nhiên",
      progress: 0,
      years: [
        {
          id: 1,
          title: "Năm 1: Nền Tảng CNTT",
          description: "Xây dựng nền tảng kiến thức cơ bản và tư duy lập trình",
          icon: <BookOpen className="w-8 h-8" />,
          items: [
            {
              id: 1,
              title: "Học kỳ 1: Kiến thức đại cương",
              description: "Các môn học cơ bản tạo nền tảng cho sinh viên CNTT",

              icon: <BookOpen className="w-6 h-6" />,
              iconBg:
                "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Đại số tuyến tính",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Giải tích 1",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn lập trình",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Vật lý đại cương",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Tiếng Anh cơ bản",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Triết học Mác-Lênin",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Tư duy logic",
                "Lập trình căn bản",
                "Toán học nền tảng",
                "Tiếng Anh học thuật",
              ],
              opacity: "opacity-100",
            },
            {
              id: 2,
              title: "Học kỳ 2: Nền tảng lập trình",
              description: "Phát triển kỹ năng lập trình và tư duy thuật toán",

              icon: <Code className="w-6 h-6" />,
              iconBg:
                "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Cấu trúc dữ liệu và giải thuật",
                  credits: 4,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Lập trình hướng đối tượng",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Toán rời rạc",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Giải tích 2",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Kinh tế chính trị",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "OOP",
                "Cấu trúc dữ liệu",
                "Thuật toán",
                "Toán học cao cấp",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 2,
          title: "Năm 2: Kiến Thức Chuyên Ngành Cơ Sở",
          description:
            "Đi sâu vào cơ sở ngành và bắt đầu tiếp cận chuyên ngành AI",
          icon: <Laptop className="w-8 h-8" />,
          items: [
            {
              id: 3,
              title: "Học kỳ 1: Nền tảng hệ thống và toán học cho AI",
              description:
                "Học kiến thức nền tảng về hệ thống máy tính và toán học cho AI",

              icon: <Server className="w-6 h-6" />,
              iconBg:
                "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
              statusIcon: <CircleDot className="w-6 h-6 text-blue-500" />,
              subjects: [
                {
                  name: "Xác suất thống kê",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Đại số tuyến tính nâng cao",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Lập trình Python",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Cơ sở dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <Database className="w-4 h-4" />,
                },
                {
                  name: "Chủ nghĩa xã hội khoa học",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Python",
                "Xác suất thống kê",
                "Đại số tuyến tính",
                "SQL",
              ],
              opacity: "opacity-100",
            },
            {
              id: 4,
              title: "Học kỳ 2: Nhập môn AI và xử lý dữ liệu",
              description:
                "Bắt đầu tiếp cận với các khái niệm AI và kỹ thuật xử lý dữ liệu",

              icon: <BrainCircuit className="w-6 h-6" />,
              iconBg:
                "bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300",
              statusIcon: <Clock className="w-6 h-6 text-yellow-500" />,
              subjects: [
                {
                  name: "Nhập môn trí tuệ nhân tạo",
                  credits: 3,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Phân tích và xử lý dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
                {
                  name: "Khai phá dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <Database className="w-4 h-4" />,
                },
                {
                  name: "Lập trình khoa học dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Tư tưởng Hồ Chí Minh",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: ["Pandas", "NumPy", "Data Analysis", "AI Fundamentals"],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 3,
          title: "Năm 3: Chuyên Ngành Trí Tuệ Nhân Tạo",
          description: "Đi sâu vào chuyên ngành AI và các mô hình học máy",

          icon: <BrainCircuit className="w-8 h-8" />,
          items: [
            {
              id: 5,
              title: "Học kỳ 1: Học máy và thị giác máy tính",
              description:
                "Học sâu về các thuật toán học máy và thị giác máy tính",

              icon: <BrainCircuit className="w-6 h-6" />,
              iconBg:
                "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Học máy",
                  credits: 4,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Thị giác máy tính",
                  credits: 3,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Học sâu cơ bản",
                  credits: 3,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Tối ưu hóa",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Lịch sử Đảng Cộng sản",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Scikit-learn",
                "TensorFlow/PyTorch",
                "Computer Vision",
                "Optimization Algorithms",
              ],
              opportunities: [
                "Data Scientist (Junior)",
                "Machine Learning Engineer (Intern)",
                "Computer Vision Engineer (Intern)",
              ],
              opacity: "opacity-100",
            },
            {
              id: 6,
              title: "Học kỳ 2: Học sâu và xử lý ngôn ngữ tự nhiên",
              description: "Đi sâu vào học sâu và xử lý ngôn ngữ tự nhiên",

              icon: <Layers className="w-6 h-6" />,
              iconBg:
                "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Học sâu nâng cao",
                  credits: 3,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Xử lý ngôn ngữ tự nhiên",
                  credits: 3,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Big Data Analytics",
                  credits: 3,
                  importance: "core",
                  icon: <Database className="w-4 h-4" />,
                },
                {
                  name: "Robotics cơ bản",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Đồ án cơ sở ngành",
                  credits: 2,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
              ],
              skills: [
                "Deep Learning",
                "NLP",
                "Transformers",
                "Big Data Tools",
                "Neural Networks",
              ],
              opportunities: [
                "NLP Engineer (Junior)",
                "AI Researcher (Intern)",
                "Deep Learning Engineer (Junior)",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 4,
          title: "Năm 4: Chuyên Sâu Và Ứng Dụng AI",
          description:
            "Ứng dụng AI vào thực tiễn và thực hiện đồ án tốt nghiệp",

          icon: <Briefcase className="w-8 h-8" />,
          items: [
            {
              id: 7,
              title: "Học kỳ 1: AI ứng dụng và đạo đức AI",
              description:
                "Nghiên cứu các ứng dụng AI và các vấn đề đạo đức AI",

              icon: <Lightbulb className="w-6 h-6" />,
              iconBg:
                "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "AI trong Y tế",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "AI trong IoT",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Đạo đức AI và công bằng",
                  credits: 3,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Học tăng cường",
                  credits: 3,
                  importance: "core",
                  icon: <BrainCircuit className="w-4 h-4" />,
                },
                {
                  name: "Thực tập doanh nghiệp",
                  credits: 3,
                  importance: "core",
                  icon: <Briefcase className="w-4 h-4" />,
                },
              ],
              skills: [
                "AI Ethics",
                "Reinforcement Learning",
                "Industry Applications",
                "MLOps Basics",
              ],
              opportunities: [
                "Machine Learning Engineer",
                "AI Ethics Researcher",
                "AI Solutions Developer",
                "Data Scientist",
              ],
              opacity: "opacity-100",
            },
            {
              id: 8,
              title: "Học kỳ 2: Khóa luận tốt nghiệp",
              description:
                "Hoàn thành đồ án tốt nghiệp và chuẩn bị hành trang vào nghề",

              icon: <FileCode className="w-6 h-6" />,
              iconBg:
                "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Khóa luận tốt nghiệp",
                  credits: 10,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
                {
                  name: "Generative AI",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "MLOps",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Research Methods",
                "Model Deployment",
                "AI System Design",
                "Generative Models",
              ],
              opportunities: [
                "AI Research Scientist",
                "Machine Learning Engineer",
                "AI Product Manager",
                "Computational Linguist",
              ],
              opacity: "opacity-100",
            },
          ],
        },
      ],
    },
    network: {
      title: "Quản Trị Mạng",
      description:
        "Chuyên ngành tập trung vào thiết kế, triển khai và bảo mật hệ thống mạng",
      years: [
        {
          id: 1,
          title: "Năm 1: Nền Tảng CNTT",
          description: "Xây dựng nền tảng kiến thức cơ bản và tư duy lập trình",
          progress: 25,
          icon: <BookOpen className="w-8 h-8" />,
          items: [
            {
              id: 1,
              title: "Học kỳ 1: Kiến thức đại cương",
              description: "Các môn học cơ bản tạo nền tảng cho sinh viên CNTT",

              icon: <BookOpen className="w-6 h-6" />,
              iconBg:
                "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Đại số tuyến tính",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Giải tích 1",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn lập trình",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Vật lý đại cương",
                  credits: 3,
                  importance: "core",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Tiếng Anh cơ bản",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Triết học Mác-Lênin",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Tư duy logic",
                "Lập trình căn bản",
                "Toán học nền tảng",
                "Tiếng Anh học thuật",
              ],
              opacity: "opacity-100",
            },
            {
              id: 2,
              title: "Học kỳ 2: Nền tảng lập trình và điện tử",
              description:
                "Phát triển kỹ năng lập trình và kiến thức về điện tử",

              icon: <Code className="w-6 h-6" />,
              iconBg:
                "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Cấu trúc dữ liệu và giải thuật",
                  credits: 4,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Lập trình hướng đối tượng",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Kỹ thuật điện tử",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Toán rời rạc",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Kinh tế chính trị",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "OOP",
                "Cấu trúc dữ liệu",
                "Thuật toán",
                "Điện tử cơ bản",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 2,
          title: "Năm 2: Kiến Thức Chuyên Ngành Cơ Sở",
          description:
            "Đi sâu vào cơ sở ngành và bắt đầu tiếp cận chuyên ngành mạng",

          icon: <Laptop className="w-8 h-8" />,
          items: [
            {
              id: 3,
              title: "Học kỳ 1: Kiến trúc máy tính và mạng cơ bản",
              description: "Học kiến thức cơ bản về kiến trúc máy tính và mạng",

              icon: <Server className="w-6 h-6" />,
              iconBg:
                "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
              statusIcon: <CircleDot className="w-6 h-6 text-blue-500" />,
              subjects: [
                {
                  name: "Kiến trúc máy tính",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Nguyên lý hệ điều hành",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Mạng máy tính cơ bản",
                  credits: 4,
                  importance: "core",
                  icon: <Network className="w-4 h-4" />,
                },
                {
                  name: "Cơ sở dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <Database className="w-4 h-4" />,
                },
                {
                  name: "Chủ nghĩa xã hội khoa học",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Quản lý bộ nhớ",
                "Kiến trúc máy tính",
                "Mạng LAN",
                "Giao thức mạng cơ bản",
              ],
              opacity: "opacity-100",
            },
            {
              id: 4,
              title: "Học kỳ 2: Giao thức mạng và hệ thống",
              description: "Tìm hiểu sâu hơn về các giao thức mạng và hệ thống",

              icon: <Network className="w-6 h-6" />,
              iconBg:
                "bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300",
              statusIcon: <Clock className="w-6 h-6 text-yellow-500" />,
              subjects: [
                {
                  name: "Giao thức mạng",
                  credits: 3,
                  importance: "core",
                  icon: <Network className="w-4 h-4" />,
                },
                {
                  name: "Hệ thống Linux/Unix",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Lập trình mạng",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "An toàn thông tin cơ bản",
                  credits: 3,
                  importance: "core",
                  icon: <ShieldCheck className="w-4 h-4" />,
                },
                {
                  name: "Tư tưởng Hồ Chí Minh",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "TCP/IP",
                "Linux Administration",
                "Socket Programming",
                "Network Security Basics",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 3,
          title: "Năm 3: Chuyên Ngành Quản Trị Mạng",
          description: "Đi sâu vào chuyên ngành quản trị và bảo mật mạng",
          icon: <Network className="w-8 h-8" />,
          items: [
            {
              id: 5,
              title: "Học kỳ 1: Quản trị hệ thống mạng",
              description:
                "Học các kỹ thuật quản trị hệ thống mạng chuyên nghiệp",

              icon: <Server className="w-6 h-6" />,
              iconBg:
                "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Quản trị mạng Windows",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Quản trị mạng Linux",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Hệ thống tường lửa",
                  credits: 3,
                  importance: "core",
                  icon: <ShieldCheck className="w-4 h-4" />,
                },
                {
                  name: "Thiết kế hệ thống mạng",
                  credits: 3,
                  importance: "core",
                  icon: <Network className="w-4 h-4" />,
                },
                {
                  name: "Lịch sử Đảng Cộng sản",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Active Directory",
                "Linux Server",
                "Firewall Configuration",
                "Network Design",
              ],
              opportunities: [
                "System Administrator (Junior)",
                "Network Technician",
                "Help Desk Support",
              ],
              opacity: "opacity-100",
            },
            {
              id: 6,
              title: "Học kỳ 2: Bảo mật mạng và công nghệ mới",
              description:
                "Đi sâu vào bảo mật mạng và các công nghệ mạng hiện đại",

              icon: <ShieldCheck className="w-6 h-6" />,
              iconBg:
                "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Bảo mật mạng nâng cao",
                  credits: 3,
                  importance: "core",
                  icon: <ShieldCheck className="w-4 h-4" />,
                },
                {
                  name: "Điện toán đám mây",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Mạng không dây và di động",
                  credits: 3,
                  importance: "core",
                  icon: <Network className="w-4 h-4" />,
                },
                {
                  name: "Ảo hóa và containers",
                  credits: 3,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "Đồ án cơ sở ngành",
                  credits: 2,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
              ],
              skills: [
                "Network Security",
                "Cloud Computing",
                "Wireless Networks",
                "Virtualization",
                "Docker",
              ],
              opportunities: [
                "Network Security Specialist (Junior)",
                "Cloud Administrator (Junior)",
                "Network Engineer (Junior)",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 4,
          title: "Năm 4: Chuyên Sâu Và Ứng Dụng Thực Tiễn",
          description:
            "Ứng dụng kiến thức vào thực tiễn và thực hiện đồ án tốt nghiệp",
          icon: <Briefcase className="w-8 h-8" />,
          items: [
            {
              id: 7,
              title: "Học kỳ 1: Hạ tầng mạng hiện đại và thực tập",
              description:
                "Học về hạ tầng mạng hiện đại và thực tập tại doanh nghiệp",

              icon: <Network className="w-6 h-6" />,
              iconBg:
                "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "SDN và NFV",
                  credits: 3,
                  importance: "core",
                  icon: <Network className="w-4 h-4" />,
                },
                {
                  name: "DevOps cho quản trị mạng",
                  credits: 3,
                  importance: "core",
                  icon: <GitBranch className="w-4 h-4" />,
                },
                {
                  name: "Quản lý và giám sát mạng",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Bảo mật điểm cuối",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Thực tập doanh nghiệp",
                  credits: 3,
                  importance: "core",
                  icon: <Briefcase className="w-4 h-4" />,
                },
              ],
              skills: [
                "Software-Defined Networking",
                "Network Monitoring",
                "DevOps Tools",
                "Infrastructure as Code",
              ],
              opportunities: [
                "Network Engineer",
                "Security Operations Analyst",
                "DevOps Engineer",
                "Network Architect (Junior)",
              ],
              opacity: "opacity-100",
            },
            {
              id: 8,
              title: "Học kỳ 2: Khóa luận tốt nghiệp",
              description:
                "Hoàn thành đồ án tốt nghiệp và chuẩn bị hành trang vào nghề",

              icon: <FileCode className="w-6 h-6" />,
              iconBg:
                "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Khóa luận tốt nghiệp",
                  credits: 10,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
                {
                  name: "Zero Trust Security",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "5G và IoT Network",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Research Methods",
                "Network Architecture",
                "Advanced Security",
                "Documentation",
              ],
              opportunities: [
                "Network Architect",
                "Security Engineer",
                "Network Operations Manager",
                "IT Infrastructure Specialist",
              ],
              opacity: "opacity-100",
            },
          ],
        },
      ],
    },
    information: {
      title: "Hệ Thống Thông Tin",
      description:
        "Chuyên ngành tập trung vào thiết kế, phát triển và quản lý hệ thống thông tin",

      years: [
        {
          id: 1,
          title: "Năm 1: Nền Tảng CNTT",
          description: "Xây dựng nền tảng kiến thức cơ bản và tư duy lập trình",
          icon: <BookOpen className="w-8 h-8" />,
          items: [
            {
              id: 1,
              title: "Học kỳ 1: Kiến thức đại cương",
              description: "Các môn học cơ bản tạo nền tảng cho sinh viên CNTT",
              icon: <BookOpen className="w-6 h-6" />,
              iconBg:
                "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Đại số tuyến tính",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Giải tích 1",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn lập trình",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Kinh tế học đại cương",
                  credits: 3,
                  importance: "core",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Tiếng Anh cơ bản",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Triết học Mác-Lênin",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Tư duy logic",
                "Lập trình căn bản",
                "Toán học nền tảng",
                "Kiến thức kinh tế",
              ],
              opacity: "opacity-100",
            },
            {
              id: 2,
              title: "Học kỳ 2: Nền tảng lập trình và thống kê",
              description:
                "Phát triển kỹ năng lập trình và phương pháp thống kê",
              icon: <Code className="w-6 h-6" />,
              iconBg:
                "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
              statusIcon: <CheckCircle className="w-6 h-6 text-green-500" />,
              subjects: [
                {
                  name: "Cấu trúc dữ liệu và giải thuật",
                  credits: 4,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Lập trình hướng đối tượng",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Xác suất thống kê",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Toán rời rạc",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Kinh tế chính trị",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "OOP",
                "Cấu trúc dữ liệu",
                "Thuật toán",
                "Thống kê ứng dụng",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 2,
          title: "Năm 2: Kiến Thức Chuyên Ngành Cơ Sở",
          description:
            "Đi sâu vào cơ sở ngành và bắt đầu tiếp cận chuyên ngành hệ thống thông tin",
          icon: <Laptop className="w-8 h-8" />,
          items: [
            {
              id: 3,
              title: "Học kỳ 1: Cơ sở dữ liệu và hệ thống",
              description:
                "Học kiến thức cơ bản về cơ sở dữ liệu và hệ thống thông tin",

              icon: <Database className="w-6 h-6" />,
              iconBg:
                "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
              statusIcon: <CircleDot className="w-6 h-6 text-blue-500" />,
              subjects: [
                {
                  name: "Cơ sở dữ liệu",
                  credits: 4,
                  importance: "core",
                  icon: <Database className="w-4 h-4" />,
                },
                {
                  name: "Nhập môn hệ thống thông tin",
                  credits: 3,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "Kiến trúc máy tính",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Hệ điều hành",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Chủ nghĩa xã hội khoa học",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "SQL",
                "Database Design",
                "System Architecture",
                "Business Process Analysis",
              ],
              opacity: "opacity-100",
            },
            {
              id: 4,
              title: "Học kỳ 2: Phân tích và thiết kế hệ thống",
              description: "Học về phân tích và thiết kế hệ thống thông tin",
              icon: <Layers className="w-6 h-6" />,
              iconBg:
                "bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300",
              statusIcon: <Clock className="w-6 h-6 text-yellow-500" />,
              subjects: [
                {
                  name: "Phân tích và thiết kế hệ thống",
                  credits: 4,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "Mạng máy tính cơ bản",
                  credits: 3,
                  importance: "core",
                  icon: <Network className="w-4 h-4" />,
                },
                {
                  name: "Công nghệ web",
                  credits: 3,
                  importance: "core",
                  icon: <Layout className="w-4 h-4" />,
                },
                {
                  name: "Quản lý dự án CNTT",
                  credits: 3,
                  importance: "core",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Tư tưởng Hồ Chí Minh",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "UML",
                "System Analysis",
                "Project Management",
                "Web Development Basics",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 3,
          title: "Năm 3: Chuyên Ngành Hệ Thống Thông Tin",
          description:
            "Đi sâu vào chuyên ngành HTTT và các hệ thống doanh nghiệp",
          icon: <Layers className="w-8 h-8" />,
          items: [
            {
              id: 5,
              title: "Học kỳ 1: Hệ thống thông tin doanh nghiệp",
              description:
                "Học về các hệ thống thông tin doanh nghiệp và quy trình kinh doanh",

              icon: <Database className="w-6 h-6" />,
              iconBg:
                "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Hệ thống thông tin doanh nghiệp",
                  credits: 3,
                  importance: "core",
                  icon: <Database className="w-4 h-4" />,
                },
                {
                  name: "Quản lý quy trình kinh doanh",
                  credits: 3,
                  importance: "core",
                  icon: <Layers className="w-4 h-4" />,
                },
                {
                  name: "Cơ sở dữ liệu nâng cao",
                  credits: 3,
                  importance: "core",
                  icon: <Database className="w-4 h-4" />,
                },
                {
                  name: "Phát triển ứng dụng web",
                  credits: 3,
                  importance: "core",
                  icon: <Layout className="w-4 h-4" />,
                },
                {
                  name: "Lịch sử Đảng Cộng sản",
                  credits: 2,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "ERP",
                "CRM",
                "Business Process Management",
                "Full-stack Development",
              ],
              opportunities: [
                "Business Analyst (Junior)",
                "Database Developer (Junior)",
                "Web Developer (Junior)",
              ],
              opacity: "opacity-100",
            },
            {
              id: 6,
              title: "Học kỳ 2: Phân tích dữ liệu và hệ thống di động",
              description:
                "Học về phân tích dữ liệu và phát triển hệ thống trên nền tảng di động",

              icon: <LineChart className="w-6 h-6" />,
              iconBg:
                "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Phân tích và khai phá dữ liệu",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Phát triển ứng dụng di động",
                  credits: 3,
                  importance: "core",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  name: "Thương mại điện tử",
                  credits: 3,
                  importance: "core",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "An toàn thông tin",
                  credits: 3,
                  importance: "core",
                  icon: <ShieldCheck className="w-4 h-4" />,
                },
                {
                  name: "Đồ án cơ sở ngành",
                  credits: 2,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
              ],
              skills: [
                "Data Analysis",
                "Mobile Development",
                "E-commerce Solutions",
                "Information Security",
              ],
              opportunities: [
                "Data Analyst (Junior)",
                "Mobile Developer (Junior)",
                "E-commerce Specialist",
              ],
              opacity: "opacity-100",
            },
          ],
        },
        {
          id: 4,
          title: "Năm 4: Chuyên Sâu Và Ứng Dụng HTTT",
          description:
            "Ứng dụng kiến thức vào nghiệp vụ thực tế và thực hiện đồ án tốt nghiệp",
          icon: <Briefcase className="w-8 h-8" />,
          items: [
            {
              id: 7,
              title: "Học kỳ 1: Công nghệ tiên tiến và chiến lược HTTT",
              description:
                "Học về công nghệ mới và chiến lược HTTT cho doanh nghiệp",

              icon: <Lightbulb className="w-6 h-6" />,
              iconBg:
                "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Chiến lược và quản trị HTTT",
                  credits: 3,
                  importance: "core",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Điện toán đám mây",
                  credits: 3,
                  importance: "core",
                  icon: <Server className="w-4 h-4" />,
                },
                {
                  name: "Business Intelligence",
                  credits: 3,
                  importance: "core",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  name: "Hệ thống thông tin địa lý",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Thực tập doanh nghiệp",
                  credits: 3,
                  importance: "core",
                  icon: <Briefcase className="w-4 h-4" />,
                },
              ],
              skills: [
                "IT Strategy",
                "Cloud Computing",
                "BI Tools",
                "GIS",
                "IT Governance",
              ],
              opportunities: [
                "IT Business Analyst",
                "BI Developer",
                "IT Consultant",
                "GIS Specialist",
              ],
              opacity: "opacity-100",
            },
            {
              id: 8,
              title: "Học kỳ 2: Khóa luận tốt nghiệp",
              description:
                "Hoàn thành đồ án tốt nghiệp và chuẩn bị hành trang vào nghề",

              icon: <FileCode className="w-6 h-6" />,
              iconBg:
                "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300",
              statusIcon: <Circle className="w-6 h-6 text-gray-400" />,
              subjects: [
                {
                  name: "Khóa luận tốt nghiệp",
                  credits: 10,
                  importance: "core",
                  icon: <FileCode className="w-4 h-4" />,
                },
                {
                  name: "Fintech và Blockchain",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
                {
                  name: "Digital Transformation",
                  credits: 3,
                  importance: "elective",
                  icon: <Milestone className="w-4 h-4" />,
                },
              ],
              skills: [
                "Research Methods",
                "Enterprise Systems",
                "Digital Transformation",
                "Blockchain Basics",
              ],
              opportunities: [
                "IT Project Manager",
                "ERP Consultant",
                "IT System Architect",
                "Digital Transformation Specialist",
              ],
              opacity: "opacity-100",
            },
          ],
        },
      ],
    },
  };

  // Calculate progress for the selected major
  const calculateMajorProgress = (major) => {
    let completedItems = 0;
    let totalItems = 0;

    majorsData[major].years.forEach(year => {
      year.items.forEach(item => {
        totalItems++;
        if (item.status === "completed") {
          completedItems++;
        }
      });
    });

    return Math.round((completedItems / totalItems) * 100);
  };

  useEffect(() => {
    const progress = calculateMajorProgress(selectedMajor);
    majorsData[selectedMajor].progress = progress;
  }, [selectedMajor]);

  const selectedMajorData = majorsData[selectedMajor];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="max-w-5xl mx-auto mb-12 text-center">
        <div className="">
          <h1 className="text-3xl  h-[65px] md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Lộ Trình Học Ngành CNTT
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Hành trình 4 năm từ sinh viên đến kỹ sư CNTT chuyên nghiệp
        </p>

        <Tabs
          defaultValue={selectedMajor}
          onValueChange={setSelectedMajor}
          className="w-full max-w-3xl mx-auto mb-8"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="software" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden md:inline">Công Nghệ Phần Mềm</span>
              <span className="inline md:hidden">CNPM</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              <span className="hidden md:inline">Trí Tuệ Nhân Tạo</span>
              <span className="inline md:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="hidden md:inline">Quản Trị Mạng</span>
              <span className="inline md:hidden">QTM</span>
            </TabsTrigger>
            <TabsTrigger
              value="information"
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span className="hidden md:inline">Hệ Thống Thông Tin</span>
              <span className="inline md:hidden">HTTT</span>
            </TabsTrigger>
          </TabsList>

          {Object.keys(majorsData).map((major) => (
            <TabsContent key={major} value={major} className="mt-0">
              <Card className="p-4 mb-6 flex justify-center">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold ">
                      {majorsData[major].title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {majorsData[major].description}
                    </p>
                  </div>
                 
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        
      </header>

      <main className="max-w-5xl mx-auto">
        {selectedMajorData.years.map((year) => (
          <div key={year.id} className="mb-16">
            <YearHeader
              year={year.title}
              description={year.description}
              icon={year.icon}
            />

            <div className="relative z-10">
              {/* Connector Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -z-10 md:block hidden"></div>
              <div className="absolute left-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -z-10 md:hidden block"></div>

              {/* Roadmap Items */}
              <div className="space-y-12">
                {year.items.map((item) => (
                  <RoadmapItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="max-w-5xl mx-auto mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Badge variant="outline" className="px-3 py-1">
            HTML/CSS
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            JavaScript
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            React/Angular
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Node.js
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Python
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Java
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Machine Learning
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Network Security
          </Badge>
        </div>
        <p>
          © 2025 Lộ Trình Học CNTT Sinh Viên Trường Đại Học Quy Nhơn
        </p>
      </footer>
    </div>
  );
}