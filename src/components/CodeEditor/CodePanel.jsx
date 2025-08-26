/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import {
  Download,
  Upload,
  Maximize,
  Minimize,
  Loader2,
  Play,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import EditorThemeSelector from "../CodeEditor/EditThemeSelector";
import { useState } from "react";
import ConfirmSubmit from "./ConfirmSubmit";

const CodePanel = ({
  code,
  setCode,
  language,
  input,
  setLanguage,
  languages,
  editorTheme,
  setEditorTheme,
  isFullScreen,
  toggleFullScreen,
  downloadCode,
  uploadCode,
  runCode,
  submitCode,
  isRunning,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-0 h-full rounded-none ">
      <CardHeader className="px-4 py-2 flex flex-row justify-between items-center">
        {/* Nhóm bên trái: 3 nút */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
              {isFullScreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
          <EditorThemeSelector
            theme={editorTheme}
            onThemeChange={setEditorTheme}
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.value}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nhóm bên phải: 4 nút */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button variant="ghost" size="icon" onClick={downloadCode}>
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById("upload-code").click()}
            >
              <Upload className="h-4 w-4" />
              <input
                id="upload-code"
                type="file"
                accept=".js,.py,.cpp,.java,.txt"
                className="hidden"
                onChange={uploadCode}
              />
            </Button>
          </motion.div>
          <Button
            variant="info"
            onClick={() => {
              runCode();
            }}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Check className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-[calc(100%-3rem)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={setCode}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 2,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
            }}
          />
        </motion.div>
      </CardContent>

      {
        <ConfirmSubmit
          show={open}
          handleClose={(open) => {
            setOpen(open);
            if (!open) {
              setOpen(null);
            }
          }}
          submitCode={submitCode}
        />
      }
    </Card>
  );
};

export default CodePanel;
