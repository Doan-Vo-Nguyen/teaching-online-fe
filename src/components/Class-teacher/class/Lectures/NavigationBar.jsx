// components/NavigationBar.jsx
import { ChevronLeft, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavigationBar = ({ title, isMenuOpen, setIsMenuOpen, goBack }) => {
  return (
    <div className="bg-white dark:bg-[#020818] shadow-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-blue-950"
            onClick={goBack}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <h2 className="font-medium dark:text-white text-gray-700">
              {title}
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
