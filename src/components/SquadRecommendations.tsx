
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Squad Depth Analysis & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {positionAnalysis.map((analysis) => (
          <PositionAnalysisCard
            key={analysis.name}
            analysis={analysis}
            isSelected={selectedPosition === analysis.name}
            onPositionSelect={onPositionSelect}
          />
        ))}
        
        <PriorityRecruitmentTargets positionAnalysis={positionAnalysis} />
      </CardContent>
    </Card>
  );
};

export default SquadRecommendations;
