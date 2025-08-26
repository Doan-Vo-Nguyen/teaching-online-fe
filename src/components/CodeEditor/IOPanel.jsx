/* eslint-disable react/prop-types */
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileInput, FileOutput, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TestCaseItem from "./TestCaseItem";
import { motion, AnimatePresence } from "framer-motion";

const IOPanel = ({ input, setInput, output, testcases, score, maxScore }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  return (
    <Card className="border-0 h-[250px] rounded-none ">
      <Tabs defaultValue="input" className="h-full flex flex-col">
        <motion.div
          className="px-4 py-2 border-b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="input" className="flex items-center gap-2">
                <FileInput className="h-4 w-4" />
                <span>Input</span>
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <FileOutput className="h-4 w-4" />
                <span>Output</span>
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Testcases</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </motion.div>

        <TabsContent value="input" className="flex-grow p-0 m-0">
          <motion.textarea
            className="w-full h-full p-4 resize-none focus:outline-none bg-background"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập input cho chương trình..."
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </TabsContent>

        <TabsContent value="output" className="flex-grow p-0 m-0">
          <motion.pre
            className="w-full h-full p-4 bg-background font-mono whitespace-pre-wrap overflow-auto custom-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={output}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {output || "Output sẽ hiển thị ở đây..."}
              </motion.div>
            </AnimatePresence>
          </motion.pre>
        </TabsContent>

        <TabsContent
          value="testcases"
          className="flex-grow p-4 m-0 overflow-auto"
        >
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Test Cases</h3>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              ></motion.div>
            </div>

            <ScrollArea className="max-h-[calc(100vh-15rem)]">
              <motion.div className="space-y-3" variants={containerVariants}>
                {testcases.map((test, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <TestCaseItem
                      test={{
                        input: test.input,
                        expected: test.expected_output,
                        actual: test.actual,
                        status: test.status,
                        score: test.score,
                      }}
                      index={index}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
            <div className="p-4 bg-muted/30 rounded-md">
              <h4 className="font-semibold mb-2">Điểm số:</h4>
              <div className="text-2xl font-bold text-green-600">
                {Number.isInteger(score)
                  ? `${score}/${maxScore}`
                  : `${score.toFixed(2)}/${maxScore}`}
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default IOPanel;
