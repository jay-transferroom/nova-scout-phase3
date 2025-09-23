
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Users, Star, TrendingUp, BookmarkCheck, Target, AlertTriangle } from "lucide-react";
import { Player } from "@/types/player";
import { useShortlists } from "@/hooks/useShortlists";
import { useEffect, useState } from "react";

interface ProspectComparisonProps {
  position: string;
  currentPlayers: Player[];
  allPlayers: Player[];
  squadAnalysis?: {
    priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Strong';
    recruitmentSuggestion: string;
    averageRating: number;
    current: number;
    needed: number;
  };
}

const ProspectComparison = ({ 
  position, 
  currentPlayers, 
  allPlayers, 
  squadAnalysis 
}: ProspectComparisonProps) => {
  const { shortlists } = useShortlists();
  const [shortlistPlayers, setShortlistPlayers] = useState<Player[]>([]);

  // Get the best current player for this position
  const currentBest = currentPlayers.length > 0 
    ? currentPlayers.reduce((best, player) => {
        const bestRating = best?.transferroomRating || best?.xtvScore || 0;
        const playerRating = player.transferroomRating || player.xtvScore || 0;
        return playerRating > bestRating ? player : best;
      }, currentPlayers[0])
    : null;

  const currentBestRating = currentBest?.transferroomRating || currentBest?.xtvScore || 50;
  const averageSquadRating = squadAnalysis?.averageRating || currentBestRating;

  // Position mapping for more accurate filtering
  const getPositionMapping = (pos: string) => {
    const positionMap: { [key: string]: string[] } = {
      'GK': ['GK'],
      'CB': ['CB'],
      'FB': ['LB', 'RB', 'LWB', 'RWB'],
      'CM': ['CM', 'CDM', 'CAM'],
      'W': ['LW', 'RW', 'LM', 'RM', 'W'],
      'ST': ['ST', 'CF', 'F', 'FW'],
      // Legacy support
      'Goalkeeper': ['GK'],
      'Centre Back': ['CB'],
      'Full Back': ['LB', 'RB', 'LWB', 'RWB'],
      'Central Midfield': ['CM', 'CDM', 'CAM'],
      'Winger': ['LW', 'RW', 'LM', 'RM', 'W'],
      'Striker': ['ST', 'CF', 'F', 'FW']
    };
    return positionMap[pos] || [];
  };

  // Load shortlisted players for this position
  useEffect(() => {
    const loadShortlistPlayers = () => {
      const requiredPositions = getPositionMapping(position);
      const allShortlistPlayerIds: string[] = [];

      // Collect all player IDs from shortlists
      shortlists.forEach(shortlist => {
        if (shortlist.playerIds) {
          allShortlistPlayerIds.push(...shortlist.playerIds);
        }
      });

      // Remove duplicates
      const uniquePlayerIds = [...new Set(allShortlistPlayerIds)];

      // Find matching players from allPlayers that match the position
      const matchingPlayers = allPlayers.filter((player: Player) => {
        const isInShortlist = uniquePlayerIds.includes(player.id);
        const playsPosition = player.positions?.some(playerPos => requiredPositions.includes(playerPos));
        return isInShortlist && playsPosition;
      });

      setShortlistPlayers(matchingPlayers);
    };

    if (shortlists.length > 0 && allPlayers.length > 0) {
      loadShortlistPlayers();
    }
  }, [shortlists, position, allPlayers]);

  // Find recommended prospects from other clubs based on squad analysis
  const getRecommendedProspects = () => {
    const requiredPositions = getPositionMapping(position);
    const targetRating = squadAnalysis?.priority === 'Critical' || squadAnalysis?.priority === 'High' 
      ? Math.max(averageSquadRating + 10, 70) // Aim higher for critical positions
      : Math.max(averageSquadRating, 60); // Match or slightly improve for others

    return allPlayers
      .filter(p => {
        const playsPosition = p.positions?.some(playerPos => requiredPositions.includes(playerPos));
        const notChelsea = !p.club?.toLowerCase().includes('chelsea');
        const rating = p.transferroomRating || p.xtvScore || 0;
        const meetsRatingRequirement = rating >= targetRating - 15;
        const reasonableAge = p.age >= 18 && p.age <= 32;
        
        return playsPosition && notChelsea && meetsRatingRequirement && reasonableAge;
      })
      .sort((a, b) => {
        const ratingA = a.transferroomRating || a.xtvScore || 0;
        const ratingB = b.transferroomRating || b.xtvScore || 0;
        return ratingB - ratingA;
      })
      .slice(0, 4);
  };

  const prospects = getRecommendedProspects();
  const topProspect = prospects[0];

  // Get recruitment priority styling
  const getPriorityStyling = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return { 
          bg: 'bg-red-50 border-red-200', 
          text: 'text-red-800', 
          badge: 'bg-red-100 text-red-800',
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />
        };
      case 'High':
        return { 
          bg: 'bg-orange-50 border-orange-200', 
          text: 'text-orange-800', 
          badge: 'bg-orange-100 text-orange-800',
          icon: <Target className="h-5 w-5 text-orange-600" />
        };
      case 'Strong':
        return { 
          bg: 'bg-green-50 border-green-200', 
          text: 'text-green-800', 
          badge: 'bg-green-100 text-green-800',
          icon: <Star className="h-5 w-5 text-green-600" />
        };
      default:
        return { 
          bg: 'bg-blue-50 border-blue-200', 
          text: 'text-blue-800', 
          badge: 'bg-blue-100 text-blue-800',
          icon: <Users className="h-5 w-5 text-blue-600" />
        };
    }
  };

  const styling = getPriorityStyling(squadAnalysis?.priority);

  if (!topProspect && shortlistPlayers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {styling.icon}
            Recruitment Recommendations - {position}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No suitable prospects or shortlisted players found for this position</p>
          {squadAnalysis && (
            <div className="mt-4 p-3 bg-muted/50 rounded text-sm">
              <strong>Recruitment Strategy:</strong> {squadAnalysis.recruitmentSuggestion}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {styling.icon}
          Recruitment Recommendations - {position}
        </CardTitle>
        {squadAnalysis && (
          <div className={`p-3 rounded-lg ${styling.bg} border mt-2`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className={styling.badge}>
                    {squadAnalysis.priority} Priority
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {squadAnalysis.current}/{squadAnalysis.needed} players
                  </span>
                </div>
                <p className="text-sm mt-1 text-muted-foreground">{squadAnalysis.recruitmentSuggestion}</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shortlisted Players Section */}
        {shortlistPlayers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium">From Your Shortlists</h4>
              <Badge variant="outline">{shortlistPlayers.length} players</Badge>
            </div>
            <div className="space-y-2">
              {shortlistPlayers.slice(0, 3).map((player) => (
                <div key={player.id} className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50/50">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={player.image} alt={player.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {player.club} • Age {player.age} • {player.nationality}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{player.transferroomRating || player.xtvScore || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Recommendations */}
        {topProspect && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Market Opportunities</h4>
              </div>
              
              {/* Top Recommendation */}
              <div className={`p-4 rounded-lg border ${styling.bg}`}>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={topProspect.image} alt={topProspect.name} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {topProspect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{topProspect.name}</h3>
                      <Badge className={styling.badge}>Top Target</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{topProspect.club}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">Age {topProspect.age}</Badge>
                      <Badge variant="outline">{topProspect.nationality}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{topProspect.transferroomRating || topProspect.xtvScore || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Options */}
            {prospects.length > 1 && (
              <div className="space-y-3">
                <h4 className="font-medium">Alternative Options</h4>
                <div className="grid gap-2">
                  {prospects.slice(1, 4).map((player) => (
                    <div key={player.id} className="flex items-center gap-3 p-2 border rounded hover:bg-muted/30 transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={player.image} alt={player.name} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.club} • Age {player.age}</div>
                      </div>
                      <div className="text-sm font-medium">{player.transferroomRating || player.xtvScore || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Analysis */}
            {currentBest && topProspect && (
              <div className="space-y-3">
                <h4 className="font-medium">Impact Analysis</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border rounded text-center">
                    <div className="text-sm text-muted-foreground">Current Best</div>
                    <div className="text-lg font-semibold">{currentBestRating}</div>
                    <div className="text-xs text-muted-foreground">{currentBest.name}</div>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <div className="text-sm text-muted-foreground">Squad Average</div>
                    <div className="text-lg font-semibold">{averageSquadRating}</div>
                    <div className="text-xs text-muted-foreground">Position</div>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <div className="text-sm text-muted-foreground">Top Target</div>
                    <div className="text-lg font-semibold">{topProspect.transferroomRating || topProspect.xtvScore || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">{topProspect.name}</div>
                  </div>
                </div>
                {((topProspect.transferroomRating || topProspect.xtvScore || 0) > currentBestRating) && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded">
                    <TrendingUp className="h-4 w-4" />
                    Potential improvement of {((topProspect.transferroomRating || topProspect.xtvScore || 0) - currentBestRating).toFixed(1)} rating points
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <Button className="w-full" size="lg">
          View Detailed Scouting Reports
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProspectComparison;
