import { Calendar, MapPin, FileText, MessageSquare, Plus, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/player";
import TrackPlayerButton from "./TrackPlayerButton";
import AddToShortlistButton from "./AddToShortlistButton";
import { useShortlists } from "@/hooks/useShortlists";

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
  const { getPlayerShortlists } = useShortlists();

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

  // Get actual shortlists this player is on
  const playerShortlists = getPlayerShortlists(player.id).map(shortlist => shortlist.name);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {player.image ? (
              <img 
                src={player.image} 
                alt={player.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{player.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{player.club}</p>
            
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {player.positions.map((position) => (
                <span
                  key={position}
                  className={`inline-flex items-center justify-center text-xs font-bold rounded px-2 py-1 text-white ${getPositionColor(position)}`}
                >
                  {position}
                </span>
              ))}
              
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{calculateAge(player.dateOfBirth)} years</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{player.nationality}</span>
              </div>
            </div>

            {/* Shortlist badges */}
            {playerShortlists.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Bookmark className="h-3 w-3" />
                  <span>On shortlists:</span>
                </div>
                {playerShortlists.map((shortlist) => (
                  <Badge key={shortlist} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {shortlist}
                  </Badge>
                ))}
              </div>
            )}

            {aggregatedData && (
              <div className="flex flex-wrap items-center gap-3">
                {aggregatedData.avgRating !== null && (
                  <Badge variant="outline" className={`text-xs font-bold ${getRatingColor(aggregatedData.avgRating)}`}>
                    {aggregatedData.avgRating}/10
                  </Badge>
                )}
                
                {aggregatedData.recommendation && (
                  <Badge className={`text-xs ${getRecommendationColor(aggregatedData.recommendation)}`}>
                    {aggregatedData.recommendation}
                  </Badge>
                )}
                
                <span className="text-xs text-gray-600">
                  {aggregatedData.reportCount} {aggregatedData.reportCount === 1 ? 'Report' : 'Reports'}
                </span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex gap-2 flex-wrap">
            <Button onClick={onCreateReport} size="sm" className="gap-1">
              <FileText className="h-3 w-3" />
              Report
            </Button>
            <Button onClick={onOpenNotes} variant="outline" size="sm" className="gap-1">
              <MessageSquare className="h-3 w-3" />
              Notes
            </Button>
            <TrackPlayerButton playerId={player.id} playerName={player.name} />
            <AddToShortlistButton 
              playerId={player.id} 
              playerName={player.name}
              isPrivatePlayer={player.isPrivatePlayer}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
