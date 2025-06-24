
import { Player } from "@/types/player";
import { Prospect } from "@/data/mockProspects";

interface ProspectImpactAnalysisProps {
  currentBest: Player | null;
  prospect: Prospect;
}

const ProspectImpactAnalysis = ({ currentBest, prospect }: ProspectImpactAnalysisProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium mb-2">Expected Impact</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Squad Rating Improvement</span>
          <span className="font-medium text-green-600">
            {currentBest && currentBest.recentForm?.rating 
              ? `+${(prospect.rating - currentBest.recentForm.rating).toFixed(1)}` 
              : '+12.3%'
            }
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Position Depth</span>
          <span className="font-medium text-blue-600">Significantly Enhanced</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Transfer Value</span>
          <span className="font-medium">{prospect.transferValue}</span>
        </div>
      </div>
    </div>
  );
};

export default ProspectImpactAnalysis;
