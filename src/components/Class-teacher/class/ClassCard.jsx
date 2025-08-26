// src/components/class/ClassCard.jsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";
import moment from "moment";
import ClassAvatar from "./ClassAvatar";

const ClassCard = ({ classItem, color }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 overflow-hidden">
      <CardHeader className="p-0">
        <ClassAvatar
          className={classItem.class_name}
          classId={classItem.class_id}
          color={color}
        />
        <div className="px-6 pt-4">
          <CardTitle className="text-xl mt-2 line-clamp-1">
            {classItem.class_name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="line-clamp-1">{classItem.teacher}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{moment(classItem.created_at).format("DD/MM/YYYY")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 pt-0">
        <Link to={`/classes/${classItem.class_id}`} className="w-full">
          <Button variant="info" className="w-full">
            <span>Xem chi tiết</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ClassCard;
