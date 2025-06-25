
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";
import { ScoutUser } from "@/hooks/useScoutUsers";
import { ScoutingAssignmentWithDetails } from "@/hooks/useScoutingAssignments";

interface ScoutPerformanceCardProps {
  scout: ScoutUser;
  assignments: ScoutingAssignmentWithDetails[];
  selectedScout: string;
  onScoutClick: (scoutId: string) => void;
}

const ScoutPerformanceCard = ({
  scout,
  assignments,
  selectedScout,
  onScoutClick
}: ScoutPerformanceCardProps) => {
  const scoutAssignments = assignments.filter(a => a.assigned_to_scout_id === scout.id);
  const completedCount = scoutAssignments.filter(a => a.status === 'completed').length;
  const completionRate = scoutAssignments.length > 0 ? Math.round((completedCount / scoutAssignments.length) * 100) : 0;

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        selectedScout === scout.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onScoutClick(scout.id)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {scout.first_name?.[0]}{scout.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {scout.first_name} {scout.last_name}
          </div>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Active tasks:</span>
            <span className="font-semibold">{scoutAssignments.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Completed:</span>
            <span className="font-semibold text-green-600">{completedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Success rate:</span>
            <span className="font-semibold">{completionRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoutPerformanceCard;
