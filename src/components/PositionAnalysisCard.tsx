
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { PositionAnalysis } from "@/hooks/usePositionAnalysis";
import PositionPriorityBadge from "./PositionPriorityBadge";
import PositionRiskIndicators from "./PositionRiskIndicators";

interface PositionAnalysisCardProps {
  analysis: PositionAnalysis;
  isSelected: boolean;
  onPositionSelect: (position: string) => void;
}

const PositionAnalysisCard = ({ analysis, isSelected, onPositionSelect }: PositionAnalysisCardProps) => {
  const completionPercentage = Math.min((analysis.current / analysis.needed) * 100, 100);

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onPositionSelect(analysis.name)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{analysis.name}</h3>
          <PositionPriorityBadge priority={analysis.priority} />
        </div>
        <div className="text-sm text-muted-foreground">
          {analysis.current}/{analysis.needed}
        </div>
      </div>
      
      <Progress 
        value={completionPercentage} 
        className="mb-2"
      />
      
      <p className="text-sm text-muted-foreground mb-2">
        {analysis.recommendation}
      </p>

      <PositionRiskIndicators risks={analysis.risks} />
      
      {(analysis.priority === 'High' || analysis.priority === 'Critical') && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
          <AlertTriangle className="h-3 w-3" />
          {analysis.priority === 'Critical' ? 'URGENT ACTION REQUIRED' : 'Immediate attention required'}
        </div>
      )}

      {analysis.players.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-muted-foreground mb-1">Key players:</p>
          <div className="flex flex-wrap gap-1">
            {analysis.players.slice(0, 3).map((player, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {player.name.split(' ')[0]} ({player.age})
              </Badge>
            ))}
            {analysis.players.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{analysis.players.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionAnalysisCard;
