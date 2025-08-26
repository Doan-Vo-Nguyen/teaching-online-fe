import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthToken from "@/hooks/userAuthToken";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TestCaseCard from "../TestCase/TestcaseCard";
import MarkdownIt from "markdown-it";
import MDEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const ExamContentDetail = () => {
  const { classId, examId, examContentId } = useParams();
  const auth = useAuthToken();
  const navigate = useNavigate();
  const location = useLocation();
  const examContent = location.state;
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const mdParser = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });
  const processedDescription = examContent?.description
    ? examContent.description
        .replace(/\\n/g, "\n")
        .replace(/\\\*/g, "*")
        .replace(/\\#/g, "#")
    : "";

  useEffect(() => {
    const htmlClasses = document.documentElement.classList;
    setIsDarkMode(htmlClasses.contains("dark"));
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-1 justify-start 
                   hover:bg-gray-100 dark:hover:bg-gray-800 
                   transition-colors duration-200 text-gray-800 dark:text-gray-100"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      <Card className="shadow-md border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-[#1e293b] dark:to-[#0f172a] border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">
              {examContent?.title}
            </CardTitle>
            {auth?.role === "student" && (
              <Button
                variant="info"
                className="mt-4 sm:mt-0"
                onClick={() => {
                  navigate(
                    `/classes/${classId}/exams/${examId}/examContent/${examContentId}/code-env`
                  );
                }}
              >
                Làm bài tập
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-[#1e293b] rounded-lg border border-blue-100 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Mô tả bài tập
            </h3>
            <div className="prose dark:prose-invert">
              <MDEditor
                value={processedDescription}
                renderHTML={(text) => mdParser.render(text)}
                readOnly={true}
                hideToolbar={true}
                view={{ menu: false, md: false, html: true }}
                data-color-mode={isDarkMode ? "dark" : "light"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <TestCaseCard />
      </div>
    </div>
  );
};

export default ExamContentDetail;
