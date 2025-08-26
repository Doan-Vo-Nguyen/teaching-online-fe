/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const TestCaseItem = ({ test, index }) => {
  return (
    <Accordion type="multiple" collapsible>
      <AccordionItem
        value={`item-${index}`}
        className="border rounded-md shadow-sm"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2 w-full">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                test.status === "passed"
                  ? "bg-green-500"
                  : test.status === "failed"
                  ? "bg-red-500"
                  : test.status === "running"
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
              initial={{ scale: 0.8 }}
              animate={{
                scale: test.status === "running" ? [0.8, 1.2, 0.8] : 1,
                transition: {
                  repeat: test.status === "running" ? Infinity : 0,
                  duration: 1,
                },
              }}
            />
            <div className="flex justify-between w-full mr-3">
              <span className="font-medium">Testcase {index + 1}</span>
              <span
                className={`text-sm text-muted-foreground ${
                  test.status === "passed" ? "text-green-500" : "text-red-500"
                }`}
              >
                {test.status === "passed" ? `+${test.score}` : 0}
              </span>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 py-4 min-h-[150px]">
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium mb-1">Input:</h4>
              <pre className="text-xs bg-muted p-2 rounded-md">
                {test.input}
              </pre>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-1">Expected Output:</h4>
              <pre className="text-xs bg-muted p-2 rounded-md">
                {test.expected}
              </pre>
            </div>
            {test.status !== "idle" && (
              <>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-xs font-medium mb-1">Actual Output:</h4>
                  <pre
                    className={`text-xs p-2 rounded-md ${
                      test.status === "passed"
                        ? "bg-green-100 dark:bg-green-900/40"
                        : test.status === "failed"
                        ? "bg-red-100 dark:bg-red-900/40"
                        : "bg-muted"
                    }`}
                  >
                    {test.actual || "Running..."}
                  </pre>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h4 className="text-xs font-medium mb-1">Score:</h4>
                  <pre className="text-xs bg-muted p-2 rounded-md">
                    {test.status === "passed" ? test.score : 0}
                  </pre>
                </motion.div>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TestCaseItem;
