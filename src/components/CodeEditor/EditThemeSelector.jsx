/* eslint-disable react/prop-types */
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const themes = [
  { name: "VS Dark", value: "vs-dark" },
  { name: "Light", value: "light" },
  { name: "High Contrast", value: "hc-black" },
];

const EditorThemeSelector = ({ theme, onThemeChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <span>Theme</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            className={theme === t.value ? "bg-muted font-medium" : ""}
            onClick={() => onThemeChange(t.value)}
          >
            {t.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditorThemeSelector;
