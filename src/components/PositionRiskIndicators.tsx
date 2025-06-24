
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Activity } from "lucide-react";
import { PositionRisk } from "@/hooks/usePositionAnalysis";

interface PositionRiskIndicatorsProps {
  risks: PositionRisk;
}

const PositionRiskIndicators = ({ risks }: PositionRiskIndicatorsProps) => {
  const hasRisks = risks.contractExpiring > 0 || risks.agingPlayers > 0 || risks.injuredPlayers > 0;

  if (!hasRisks) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {risks.contractExpiring > 0 && (
        <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
          <Clock className="h-3 w-3" />
          {risks.contractExpiring} contract{risks.contractExpiring > 1 ? 's' : ''} expiring
        </div>
      )}
      {risks.agingPlayers > 0 && (
        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
          <TrendingUp className="h-3 w-3" />
          {risks.agingPlayers} aging player{risks.agingPlayers > 1 ? 's' : ''}
        </div>
      )}
      {risks.injuredPlayers > 0 && (
        <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          <Activity className="h-3 w-3" />
          {risks.injuredPlayers} injured
        </div>
      )}
    </div>
  );
};

export default PositionRiskIndicators;
