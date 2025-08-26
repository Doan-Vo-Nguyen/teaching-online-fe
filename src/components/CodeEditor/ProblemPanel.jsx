/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import MDEditor from "@uiw/react-md-editor";
import { getAllExamContentByExamId } from "@/api/ExamApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ProblemPanel = () => {
  const { examId, examContentId } = useParams();
  const [problem, setProblem] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const processedDescription = problem?.description
    ? problem.description
        .replace(/\\n/g, "\n")
        .replace(/\\\*/g, "*")
        .replace(/\\#/g, "#")
    : "";

  useEffect(() => {
    fetchAllProblem();
    const htmlClasses = document.documentElement.classList;
    setIsDarkMode(htmlClasses.contains("dark"));
  }, [examId, examContentId]);

  const fetchAllProblem = async () => {
    try {
      const res = await getAllExamContentByExamId(examId);
      const filteredProblems = res.data.filter(
        (content) => Number(content.id) === Number(examContentId)
      );
      if (filteredProblems.length > 0) {
        setProblem(filteredProblems[0]);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  return (
    <Card className="border-0 h-full rounded-none">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Đề bài</span>
          <motion.div
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-3">{problem?.title}</h3>
            <div
              data-color-mode={isDarkMode ? "dark" : "light"}
              className="mx-2"
            >
              <MDEditor.Markdown source={processedDescription} />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProblemPanel;
