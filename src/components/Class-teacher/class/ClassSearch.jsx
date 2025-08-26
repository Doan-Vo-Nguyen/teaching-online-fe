// src/components/class/ClassSearch.jsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ClassSearch = ({ searchTerm, onSearch }) => {
  return (
    <div className="relative w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm lớp học..."
        className="pl-8"
        value={searchTerm}
        onChange={onSearch}
      />
    </div>
  );
};

export default ClassSearch;
