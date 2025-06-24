
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

  // Format xTV score with currency symbol
  const formatXTVScore = (score: number | null | undefined) => {
    if (!score) return 'N/A';
    
    // Determine currency based on player's region or nationality
    const isEuropean = player.region === 'Europe' || 
                      ['Spain', 'France', 'Germany', 'Italy', 'Portugal', 'Netherlands', 'Belgium'].includes(player.nationality);
    const currency = isEuropean ? '€' : '£';
    
    return `${currency}${score.toFixed(1)}M`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Player Ratings & Scores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Market Value & Analysis Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">xTV</span>
            </div>
            <div className={`text-lg font-bold ${getRatingColor(player.xtvScore)}`}>
              {formatXTVScore(player.xtvScore)}
            </div>
            <div className="text-xs text-blue-600">Expected Transfer Value</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">TransferRoom</span>
            </div>
            <div className={`text-lg font-bold ${getRatingColor(player.transferroomRating)}`}>
              {player.transferroomRating ? `${player.transferroomRating.toFixed(1)}` : 'N/A'}
            </div>
            <div className="text-xs text-purple-600">Platform Rating</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Future Rating</span>
            </div>
            <div className={`text-lg font-bold ${getRatingColor(player.futureRating)}`}>
              {player.futureRating ? `${player.futureRating.toFixed(1)}` : 'N/A'}
            </div>
            <div className="text-xs text-green-600">Potential Score</div>
          </div>
        </div>

        {/* Scouting Analysis */}
        {aggregatedData && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Scouting Analysis</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Scout Rating:</span>
                <Badge className={getRatingBadgeColor(aggregatedData.avgRating)}>
                  {aggregatedData.avgRating ? `${aggregatedData.avgRating.toFixed(1)}/10` : 'No ratings'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reports Count:</span>
                <Badge variant="outline">
                  {aggregatedData.reportCount} report{aggregatedData.reportCount !== 1 ? 's' : ''}
                </Badge>
              </div>

              {aggregatedData.recommendation && (
                <div className="col-span-full">
                  <span className="text-sm text-gray-600">Scout Recommendation:</span>
                  <div className="mt-1">
                    <Badge 
                      variant={aggregatedData.recommendation.toLowerCase().includes('recommend') ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {aggregatedData.recommendation}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRatingsCard;
