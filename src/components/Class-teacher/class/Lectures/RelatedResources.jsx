// components/RelatedResources.jsx
import { ExternalLink, FileText, PlayCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RelatedResources = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ExternalLink className="h-5 w-5 mr-2 text-blue-600" />
          Tài nguyên liên quan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <a
            href="#"
            className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Tài liệu tham khảo</p>
                <p className="text-xs text-gray-500 mt-1">
                  Bài đọc bổ sung cho bài giảng
                </p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Video hướng dẫn thực hành</p>
                <p className="text-xs text-gray-500 mt-1">
                  Thực hành cùng giảng viên
                </p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-sm">Bài kiểm tra kiến thức</p>
                <p className="text-xs text-gray-500 mt-1">
                  Kiểm tra sau khi học xong bài giảng
                </p>
              </div>
            </div>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedResources;
