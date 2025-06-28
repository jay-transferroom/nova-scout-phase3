
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Target, BarChart3 } from "lucide-react";
import { Player } from "@/types/player";

interface PlayerRatingsCardProps {
  player: Player;
  aggregatedData?: {
    avgRating: number | null;
    recommendation: string | null;
    reportCount: number;
  };
}

const PlayerRatingsCard = ({ player, aggregatedData }: PlayerRatingsCardProps) => {
  const getRatingColor = (rating: number | null | undefined) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-blue-600';
    if (rating >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadgeColor = (rating: number | null | undefined) => {
    if (!rating) return 'bg-gray-100 text-gray-600';
    if (rating >= 8) return 'bg-green-100 text-green-700';
    if (rating >= 6) return 'bg-blue-100 text-blue-700';
    if (rating >= 4) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Format xTV score with currency symbol - convert from raw value to millions
  const formatXTVScore = (score: number | null | undefined) => {
    if (!score) return 'N/A';
    
    // Convert the raw value to millions (assuming it's in basic currency units)
    const valueInMillions = score / 1000000;
    
    // Determine currency based on player's region or nationality
    const isEuropean = player.region === 'Europe' || 
                      ['Spain', 'France', 'Germany', 'Italy', 'Portugal', 'Netherlands', 'Belgium'].includes(player.nationality);
    const currency = isEuropean ? '€' : '£';
    
    return `${currency}${valueInMillions.toFixed(1)}M`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="h-4 w-4" />
          Ratings & Scores
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3 space-y-2">
        {/* Market Value & Analysis Scores */}
        <div className="space-y-1.5">
          <div className="text-center p-1.5 bg-blue-50 rounded">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">xTV</span>
            </div>
            <div className={`text-sm font-bold ${getRatingColor(player.xtvScore)}`}>
              {formatXTVScore(player.xtvScore)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-center p-1.5 bg-purple-50 rounded">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Star className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">TR</span>
              </div>
              <div className={`text-sm font-bold ${getRatingColor(player.transferroomRating)}`}>
                {player.transferroomRating ? `${player.transferroomRating.toFixed(1)}` : 'N/A'}
              </div>
            </div>

            <div className="text-center p-1.5 bg-green-50 rounded">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Target className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">Future</span>
              </div>
              <div className={`text-sm font-bold ${getRatingColor(player.futureRating)}`}>
                {player.futureRating ? `${player.futureRating.toFixed(1)}` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Scouting Analysis */}
        {aggregatedData && (
          <div className="border-t pt-1.5">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Scout Analysis</h4>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Avg Rating:</span>
                <Badge className={`text-xs ${getRatingBadgeColor(aggregatedData.avgRating)}`}>
                  {aggregatedData.avgRating ? `${aggregatedData.avgRating.toFixed(1)}` : 'None'}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Reports:</span>
                <Badge variant="outline" className="text-xs">
                  {aggregatedData.reportCount}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRatingsCard;
