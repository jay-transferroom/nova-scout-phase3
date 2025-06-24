
import { Calendar, MapPin, FileText, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/player";
import TrackPlayerButton from "./TrackPlayerButton";

interface PlayerHeaderProps {
  player: Player;
  onCreateReport: () => void;
  onOpenNotes: () => void;
  calculateAge: (dateOfBirth: string) => number;
  getPositionColor: (position: string) => string;
  aggregatedData?: {
    avgRating: number | null;
    recommendation: string | null;
    reportCount: number;
  };
}

export const PlayerHeader = ({ 
  player, 
  onCreateReport, 
  onOpenNotes,
  calculateAge, 
  getPositionColor,
  aggregatedData 
}: PlayerHeaderProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600 bg-green-50";
    if (rating >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRecommendationColor = (recommendation: string) => {
    const rec = recommendation?.toLowerCase();
    if (rec?.includes("priority") || rec?.includes("sign")) return "bg-green-100 text-green-800";
    if (rec?.includes("monitor") || rec?.includes("track")) return "bg-blue-100 text-blue-800";
    if (rec?.includes("consider")) return "bg-yellow-100 text-yellow-800";
    if (rec?.includes("watch")) return "bg-purple-100 text-purple-800";
    if (rec?.includes("pass")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0">
            {player.image ? (
              <img 
                src={player.image} 
                alt={player.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{player.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{player.club}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {player.positions.map((position) => (
                <span
                  key={position}
                  className={`inline-flex items-center justify-center text-sm font-bold rounded-md px-3 py-1 text-white ${getPositionColor(position)}`}
                >
                  {position}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{calculateAge(player.dateOfBirth)} years old</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{player.nationality}</span>
              </div>
            </div>

            {aggregatedData && (
              <div className="flex items-center gap-4 mb-4">
                {aggregatedData.avgRating !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Overall Rating:</span>
                    <Badge variant="outline" className={`font-bold ${getRatingColor(aggregatedData.avgRating)}`}>
                      {aggregatedData.avgRating}/10
                    </Badge>
                  </div>
                )}
                
                {aggregatedData.recommendation && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Recommendation:</span>
                    <Badge className={getRecommendationColor(aggregatedData.recommendation)}>
                      {aggregatedData.recommendation}
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {aggregatedData.reportCount} {aggregatedData.reportCount === 1 ? 'Report' : 'Reports'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex flex-col gap-2">
            <Button onClick={onCreateReport} className="gap-2">
              <FileText className="h-4 w-4" />
              Create Report
            </Button>
            <Button onClick={onOpenNotes} variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes
            </Button>
            <TrackPlayerButton playerId={player.id} playerName={player.name} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
