
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, Clock, Target } from "lucide-react";
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
  
  // Calculate average completion time (mock for now - in real app this would be calculated from actual dates)
  const avgCompletionDays = scoutAssignments.length > 0 
    ? Math.round(Math.random() * 10 + 3) // Mock: 3-13 days average
    : 0;

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

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
            <div>
              <div className="font-medium">{scout.first_name} {scout.last_name}</div>
              <div className="text-xs text-muted-foreground font-normal">Scout</div>
            </div>
          </div>
          <TrendingUp className={`h-4 w-4 ${getPerformanceColor(completionRate)}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              Active tasks:
            </span>
            <span className="font-semibold">{scoutAssignments.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completed:</span>
            <span className="font-semibold text-green-600">{completedCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Success rate:</span>
            <span className={`font-semibold ${getPerformanceColor(completionRate)}`}>
              {completionRate}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Avg. time:
            </span>
            <span className="font-semibold text-blue-600">
              {avgCompletionDays}d
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoutPerformanceCard;
