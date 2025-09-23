import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import { getSquadDisplayName } from "@/utils/squadUtils";

interface CompactSquadValueOverviewProps {
  selectedSquad: string;
  squadMetrics: {
    totalValue: number;
    avgAge: number;
    contractsExpiring: number;
  };
  squadPlayersLength: number;
}

const CompactSquadValueOverview = ({ selectedSquad, squadMetrics, squadPlayersLength }: CompactSquadValueOverviewProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-700">
            {getSquadDisplayName(selectedSquad)} Overview
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xl font-bold text-blue-600">£{squadMetrics.totalValue.toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground">Total Value</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-xl font-bold text-green-600">{squadPlayersLength}</div>
                <div className="text-xs text-muted-foreground">Squad Size</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <div>
                <div className="text-xl font-bold text-amber-600">{squadMetrics.avgAge.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Avg Age</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-xl font-bold text-red-600">{squadMetrics.contractsExpiring}</div>
                <div className="text-xs text-muted-foreground">Expiring</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactSquadValueOverview;