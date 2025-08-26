import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProblemPanel from "./ProblemPanel";
import CodePanel from "./CodePanel";
import IOPanel from "./IOPanel";
import { codeExamples } from "../../../constant.js";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
// Import API function lấy test case theo examContentId
import { getAllTestCaseByExamContentId } from "@/api/testcaseApi";
import {
  runCodeForStudentIt,
  submitExamsForITStudent,
} from "@/api/SubmissionApi";
import useAuthToken from "@/hooks/userAuthToken";

const CodeEditor = () => {
  const auth = useAuthToken();
  const { examId, classId, examContentId } = useParams();
  const navigate = useNavigate();
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(codeExamples.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [testcases, setTestcases] = useState([]);
  const [ioExpanded, setIoExpanded] = useState(false);
  const [collapseProblem, setCollapseProblem] = useState(false);

  const calculateScore = (testcases) => {
    const { totalScore, totalPossible } = testcases.reduce(
      (acc, testcase) => ({
        totalScore:
          acc.totalScore + (testcase.status === "passed" ? testcase.score : 0),
        totalPossible: acc.totalPossible + testcase.score,
      }),
      { totalScore: 0, totalPossible: 0 }
    );

    setScore(totalScore);
    setMaxScore(totalPossible);
  };

  const languages = [
    { id: 63, name: "JavaScript", value: "javascript" },
    { id: 71, name: "Python", value: "python" },
    { id: 54, name: "C++", value: "cpp" },
    { id: 62, name: "Java", value: "java" },
  ];

  useEffect(() => {
    setCode(codeExamples[language] || codeExamples.javascript);
  }, [language]);

  useEffect(() => {
    if (examContentId) {
      fetchAllTestCaseForExamContent();
    }
  }, [examContentId]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const fetchAllTestCaseForExamContent = async () => {
    try {
      const res = await getAllTestCaseByExamContentId(examContentId);
      if (res.success) {
        setTestcases(res.data);
      }
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };
  const runCode = async (inputText = input) => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const res = await runCodeForStudentIt(examContentId, {
        file_content: code,
        language_id: languages.find((l) => l.value === language)?.id || 54,
        input: inputText,
      });
      console.log("runCode res", res);
      if (res.success) {
        const processed = res.data.testcase_results.map((tc) => {
          return {
            ...tc,
            input: tc?.input || "",
            score: tc?.score || 0,
            expected_output: tc?.expected_output || tc.expected_output,
            status: tc.passed ? "passed" : "failed",
            actual: tc.output || "",
          };
        });
        setOutput(res.data.user_input_result.output);
        setTestcases(processed);
        calculateScore(processed);

        const passed = processed.filter((t) => t.status === "passed").length;
        toast.success(`${passed}/${processed.length} test cases passed!`);
      } else {
        toast.error(res.message);
        setOutput("Error: " + res.message);
      }
    } catch (error) {
      toast.error("Execution failed");
      setOutput("Error: " + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitExamsForITStudent = async () => {
    const detailed_testcase_results = testcases.map((tc) => ({
      testcase_id: tc.id,
      score: tc.score,
      status: tc.status,
    }));

    const res = await submitExamsForITStudent(
      examId,
      auth.id,
      classId,
      examContentId,
      {
        file_content: code,
        grade: score,
        exam_content_id: examContentId,
        detailed_testcase_results: detailed_testcase_results,
      }
    );
    if (res.success) {
      toast.success("Submitted successfully!");
    } else {
      toast.error(res.message);
    }
  };

  const uploadCode = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
      toast.success(`Uploaded file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const fileExtension =
      language === "javascript"
        ? "js"
        : language === "python"
        ? "py"
        : language === "cpp"
        ? "cpp"
        : "java";

    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `solution.${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded solution.${fileExtension}`);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const toggleIOExpanded = () => {
    setIoExpanded((prev) => !prev);
  };

  const toggleProblemPanel = () => {
    setCollapseProblem((prev) => !prev);
  };

  return (
    <motion.div
      className="h-screen flex flex-col bg-background overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-1 overflow-hidden relative">
        {!isFullScreen && (
          <motion.div
            className="bg-card border-r flex flex-col"
            initial={{ width: "40%", opacity: 1 }}
            animate={{
              width: collapseProblem ? "0%" : "40%",
              opacity: collapseProblem ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-border">
              <div className="flex items-center ">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mr-4 flex items-center"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  <span>Quay lại</span>
                </Button>
                {/* Score indicator */}
                {maxScore > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={score === maxScore ? "success" : "secondary"}
                      className="text-xs py-1"
                    >
                      Score: {score}/{maxScore}
                    </Badge>

                    {/* Custom Progress bar */}
                    <div className="w-24 h-2 bg-gray-300 rounded overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${(score / maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullScreen}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1  p-4">
              <ProblemPanel />
            </div>
          </motion.div>
        )}

        {/* Toggle button khi problem panel collapsed */}
        {collapseProblem && !isFullScreen && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleProblemPanel}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-6 rounded-r-md rounded-l-none border-l-0 bg-primary/10 hover:bg-primary/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        <motion.div
          className="flex flex-col bg-card ml-auto h-full "
          style={{ transformOrigin: "right" }}
          animate={{ width: isFullScreen ? "100%" : "60%" }}
          transition={{
            duration: 0.3,
            ease: isFullScreen ? "easeOut" : "easeIn",
          }}
        >
          {/* Code editor */}
          <div className="flex-1 min-h-[50%]">
            <CodePanel
              code={code}
              setCode={setCode}
              language={language}
              input={input}
              setLanguage={setLanguage}
              languages={languages}
              editorTheme={editorTheme}
              setEditorTheme={setEditorTheme}
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
              downloadCode={downloadCode}
              uploadCode={uploadCode}
              runCode={runCode}
              submitCode={handleSubmitExamsForITStudent}
              isRunning={isRunning}
            />
          </div>

          {/* Divider với toggle control cho I/O */}
          <motion.div
            className="border-t border-border bg-card/50 flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-card/80 transition-colors"
            onClick={toggleIOExpanded}
            whileHover={{ backgroundColor: "rgba(var(--card), 0.9)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Test Cases & Output</h3>
              {testcases.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {testcases.filter((t) => t.status === "passed").length}/
                  {testcases.length} passing
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted transition-colors">
              {ioExpanded ? (
                <Minimize className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Maximize className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </motion.div>

          {/* Output panel */}
          <div
            className="transition-all duration-300 border-t border-border bg-card"
            style={{
              height: ioExpanded ? "50%" : "30%",
              minHeight: "20%",
              maxHeight: ioExpanded ? "60%" : "40%",
            }}
          >
            <IOPanel
              input={input}
              setInput={setInput}
              output={output}
              testcases={testcases}
              score={score}
              maxScore={maxScore}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CodeEditor;
