/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Code } from "lucide-react";
import useAuthToken from "@/hooks/userAuthToken";
import AddTestCaseModal from "./AddTestCaseModal";
import { getAllTestCaseByExamContentId } from "@/api/testcaseApi";
import { useParams } from "react-router-dom";
import DeleteTestCase from "./DeleteTestCase";
import EditTestCaseModal from "./EditTestCaseModal";

// Mock data cho các test case

const TestCaseCard = () => {
  const auth = useAuthToken();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedCase, setExpandedCase] = useState(null);
  const { examContentId } = useParams();
  const [testCases, setTestCases] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testCaseToDelete, setTestCaseToDelete] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [testCaseToEdit, setTestCaseToEdit] = useState(null);
  useEffect(() => {
    fetchAllTestCaseForExamContent();
  }, [examContentId]);

  const fetchAllTestCaseForExamContent = async () => {
    try {
      const res = await getAllTestCaseByExamContentId(examContentId);
      if (res.success) {
        setTestCases(res.data);
      }
    } catch (error) {
      console.error("Error fetching test cases:", error);
    }
  };
  // Hiển thị tất cả các test case
  const visibleTestCases = testCases;

  const handleDeleteTestCase = (tescase) => {
    setTestCaseToDelete(tescase);
    setShowDeleteModal(true);
  };

  const handleEditTestCase = (tescase) => {
    setTestCaseToEdit(tescase);
    setShowEditModal(true);
  };
  return (
    <Card className="shadow-md border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-900 border-b dark:border-gray-600">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
            Test Cases
          </CardTitle>
        </div>
        <div className="flex gap-2">
          {auth?.role !== "student" && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Thêm test case
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {visibleTestCases.length > 0 ? (
          <div className="space-y-3">
            {visibleTestCases.map((testCase, index) => (
              <div
                key={index}
                className={`border rounded-lg transition-all duration-200 ${
                  expandedCase === index
                    ? "shadow-md bg-white dark:bg-gray-700"
                    : "hover:shadow hover:bg-gray-50 dark:hover:bg-gray-700"
                } border-gray-200 dark:border-gray-600`}
              >
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() =>
                    setExpandedCase(expandedCase === index ? null : index)
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Test case #{index + 1}
                    </span>
                  </div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    {testCase.score} điểm
                  </span>
                </div>

                {expandedCase === index && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          Input:
                        </h4>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                          {testCase.input}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          Expected Output:
                        </h4>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                          {testCase.expected_output}
                        </pre>
                      </div>
                    </div>

                    {auth?.role !== "student" && (
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTestCase(testCase)}
                          className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800"
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                          onClick={() => handleDeleteTestCase(testCase)}
                        >
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-full mb-3">
              <Code className="h-6 w-6 text-gray-400 dark:text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có test case nào được tạo
            </p>
            {auth?.role !== "student" && (
              <Button
                className="mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
                onClick={() => setShowCreateModal(true)}
              >
                Tạo test case mới
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <AddTestCaseModal
        open={showCreateModal}
        onOpenChange={(open) => setShowCreateModal(open)}
        fetchAllTestCaseForExamContent={fetchAllTestCaseForExamContent}
      />

      {testCaseToDelete && (
        <DeleteTestCase
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          testCaseToDelete={testCaseToDelete}
          fetchAllTestCaseForExamContent={fetchAllTestCaseForExamContent}
        />
      )}

      {testCaseToEdit && (
        <EditTestCaseModal
          open={showEditModal}
          onOpenChange={() => setShowEditModal(false)}
          testCaseToEdit={testCaseToEdit}
          fetchAllTestCaseForExamContent={fetchAllTestCaseForExamContent}
        />
      )}
    </Card>
  );
};

export default TestCaseCard;
