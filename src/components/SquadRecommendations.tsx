
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Player } from "@/types/player";
import { usePositionAnalysis } from "@/hooks/usePositionAnalysis";
import PositionAnalysisCard from "./PositionAnalysisCard";
import PriorityRecruitmentTargets from "./PriorityRecruitmentTargets";

interface SquadRecommendationsProps {
  players: Player[];
  selectedPosition: string | null;
  onPositionSelect: (position: string) => void;
}

const SquadRecommendations = ({ players, selectedPosition, onPositionSelect }: SquadRecommendationsProps) => {
  const { getPositionAnalysis } = usePositionAnalysis(players);
  const positionAnalysis = getPositionAnalysis();

  // Filter out positions that don't need recommendations (adequate depth and no risks)
  const positionsWithRecommendations = positionAnalysis.filter(analysis => {
    // Show if priority is not 'Low' OR if there are any risks
    return analysis.priority !== 'Low' || 
           analysis.risks.contractExpiring > 0 || 
           analysis.risks.agingPlayers > 0 || 
           analysis.risks.injuredPlayers > 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Squad Depth Analysis & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {positionsWithRecommendations.length > 0 ? (
          <>
            {positionsWithRecommendations.map((analysis) => (
              <PositionAnalysisCard
                key={analysis.name}
                analysis={analysis}
                isSelected={selectedPosition === analysis.name}
                onPositionSelect={onPositionSelect}
              />
            ))}
            
            <PriorityRecruitmentTargets positionAnalysis={positionsWithRecommendations} />
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>All positions have adequate depth</p>
            <p className="text-sm">No immediate recruitment recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SquadRecommendations;
