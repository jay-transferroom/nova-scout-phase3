import { Button } from "@/components/ui/button";
import { Edit, FileText } from "lucide-react";
const AssignedPlayersHeader = () => {
  return <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold">Your Assignments</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your scouting assignments
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Submit Reports
        </Button>
      </div>
    </div>;
};
export default AssignedPlayersHeader;