
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
  allPlayers?: Player[];
}

const SquadRecommendations = ({ players, selectedPosition, onPositionSelect, allPlayers = [] }: SquadRecommendationsProps) => {
  const { getPositionAnalysis } = usePositionAnalysis(players, allPlayers);
  const positionAnalysis = getPositionAnalysis();

  // Filter to show positions with strategic opportunities or recommendations
  const positionsWithRecommendations = positionAnalysis.filter(analysis => {
    // Show positions where we can improve depth, quality, or planning
    return analysis.priority === 'High' || 
           analysis.priority === 'Critical' ||
           analysis.priority === 'Medium' ||
           analysis.risks.contractExpiring > 0 || 
           analysis.risks.agingPlayers > 1;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Strategic Squad Recommendations
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
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
            <p className="font-medium text-green-700">Squad depth looks excellent</p>
            <p className="text-sm">All positions have strong coverage with good rotation options</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SquadRecommendations;
