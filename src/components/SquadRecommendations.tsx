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
const SquadRecommendations = ({
  players,
  selectedPosition,
  onPositionSelect,
  allPlayers = []
}: SquadRecommendationsProps) => {
  const {
    getPositionAnalysis
  } = usePositionAnalysis(players, allPlayers);
  const positionAnalysis = getPositionAnalysis();

  // Filter to show positions with strategic opportunities or recommendations
  const positionsWithRecommendations = positionAnalysis.filter(analysis => {
    // Show positions where we can improve depth, quality, or planning
    return analysis.priority === 'High' || analysis.priority === 'Critical' || analysis.priority === 'Medium' || analysis.risks.contractExpiring > 0 || analysis.risks.agingPlayers > 1;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Squad Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {positionsWithRecommendations.length > 0 ? (
          <>
            <div className="grid gap-3">
              {positionsWithRecommendations.map((analysis) => (
                <PositionAnalysisCard
                  key={analysis.name}
                  analysis={analysis}
                  onPositionSelect={onPositionSelect}
                  isSelected={selectedPosition === analysis.name}
                />
              ))}
            </div>
            
            <PriorityRecruitmentTargets 
              positionAnalysis={positionsWithRecommendations}
            />
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No urgent squad recommendations at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default SquadRecommendations;