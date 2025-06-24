
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { PositionAnalysis } from "@/hooks/usePositionAnalysis";

interface PriorityRecruitmentTargetsProps {
  positionAnalysis: PositionAnalysis[];
}

const PriorityRecruitmentTargets = ({ positionAnalysis }: PriorityRecruitmentTargetsProps) => {
  const priorityTargets = positionAnalysis
    .filter(p => p.priority === 'Critical' || p.priority === 'High')
    .slice(0, 3);

  if (priorityTargets.length === 0) return null;

  return (
    <div className="pt-4 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Star className="h-4 w-4" />
        Priority Recruitment Targets
      </div>
      <div className="space-y-2">
        {priorityTargets.map((pos, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span className="text-sm">
              {pos.priority === 'Critical' ? '🚨' : '⚡'} {pos.name} - {pos.recommendation}
            </span>
            <Badge variant="outline">{pos.priority}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityRecruitmentTargets;
