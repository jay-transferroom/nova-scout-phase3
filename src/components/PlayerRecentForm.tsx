
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types/player";

interface PlayerRecentFormProps {
  player: Player;
  getFormRatingColor: (rating: number) => string;
}

export const PlayerRecentForm = ({ player, getFormRatingColor }: PlayerRecentFormProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4" />
          Recent Form
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        {player.recentForm ? (
          <div className="grid grid-cols-4 gap-1">
            <div className="text-center p-1.5 bg-gray-50 rounded">
              <p className="text-sm font-bold text-gray-900">{player.recentForm.matches}</p>
              <p className="text-xs text-gray-600">Matches</p>
            </div>
            
            <div className="text-center p-1.5 bg-gray-50 rounded">
              <p className="text-sm font-bold text-blue-600">{player.recentForm.goals}</p>
              <p className="text-xs text-gray-600">Goals</p>
            </div>
            
            <div className="text-center p-1.5 bg-gray-50 rounded">
              <p className="text-sm font-bold text-green-600">{player.recentForm.assists}</p>
              <p className="text-xs text-gray-600">Assists</p>
            </div>
            
            <div className="text-center p-1.5 bg-gray-50 rounded">
              <p className={`text-sm font-bold ${getFormRatingColor(player.recentForm.rating)}`}>
                {player.recentForm.rating}
              </p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-2 text-xs">No recent form data available</p>
        )}
      </CardContent>
    </Card>
  );
};
