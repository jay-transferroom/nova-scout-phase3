
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { getSquadDisplayName } from "@/utils/squadUtils";

interface SquadValueOverviewProps {
  selectedSquad: string;
  squadMetrics: {
    totalValue: number;
    avgAge: number;
    contractsExpiring: number;
  };
  squadPlayersLength: number;
}

const SquadValueOverview = ({ selectedSquad, squadMetrics, squadPlayersLength }: SquadValueOverviewProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-600" />
          {getSquadDisplayName(selectedSquad)} Value Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">£{squadMetrics.totalValue.toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">Total Squad Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{squadPlayersLength}</div>
            <div className="text-sm text-muted-foreground">Squad Size</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{squadMetrics.avgAge.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Average Age</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{squadMetrics.contractsExpiring}</div>
            <div className="text-sm text-muted-foreground">Contracts Expiring</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquadValueOverview;
