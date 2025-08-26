import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const DiscussionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thảo luận</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Thêm bình luận..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <Button size="icon">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionCard;
