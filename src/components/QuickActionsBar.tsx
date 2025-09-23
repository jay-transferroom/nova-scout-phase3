import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddPrivatePlayerDialog from "./AddPrivatePlayerDialog";

const QuickActionsBar = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <AddPrivatePlayerDialog
            trigger={
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Private Player
              </Button>
            }
          />
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/transfers/data-import")}
          >
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsBar;