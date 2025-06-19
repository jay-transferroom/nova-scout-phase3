
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        {player.recentForm ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{player.recentForm.matches}</p>
              <p className="text-sm text-gray-600">Matches</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{player.recentForm.goals}</p>
              <p className="text-sm text-gray-600">Goals</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{player.recentForm.assists}</p>
              <p className="text-sm text-gray-600">Assists</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className={`text-2xl font-bold ${getFormRatingColor(player.recentForm.rating)}`}>
                {player.recentForm.rating}
              </p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No recent form data available</p>
        )}
      </CardContent>
    </Card>
  );
};
