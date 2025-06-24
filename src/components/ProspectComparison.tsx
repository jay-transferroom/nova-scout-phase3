
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Users, Star, TrendingUp } from "lucide-react";
import { Player } from "@/types/player";

interface ProspectComparisonProps {
  position: string;
  currentPlayers: Player[];
  allPlayers: Player[];
}

const ProspectComparison = ({ position, currentPlayers, allPlayers }: ProspectComparisonProps) => {
  // Get the best current player for this position
  const currentBest = currentPlayers.length > 0 
    ? currentPlayers.reduce((best, player) => {
        const bestRating = best?.transferroomRating || best?.xtvScore || 0;
        const playerRating = player.transferroomRating || player.xtvScore || 0;
        return playerRating > bestRating ? player : best;
      }, currentPlayers[0])
    : null;

  const currentBestRating = currentBest?.transferroomRating || currentBest?.xtvScore || 50;

  // Find recommended prospects from other clubs
  const prospects = allPlayers
    .filter(p => {
      // Must play the required position
      const positionMap: { [key: string]: string[] } = {
        'Goalkeeper': ['GK'],
        'Centre Back': ['CB'],
        'Full Back': ['LB', 'RB', 'LWB', 'RWB'],
        'Central Midfield': ['CM', 'CDM', 'CAM'],
        'Winger': ['LW', 'RW', 'LM', 'RM'],
        'Striker': ['ST', 'CF']
      };
      
      const requiredPositions = positionMap[position] || [];
      const playsPosition = p.positions.some(playerPos => requiredPositions.includes(playerPos));
      
      // Must not be from Chelsea
      const notChelsea = !p.club?.toLowerCase().includes('chelsea');
      
      // Must have better or similar rating
      const rating = p.transferroomRating || p.xtvScore || 0;
      const hasGoodRating = rating >= currentBestRating - 10;
      
      // Age considerations
      const reasonableAge = p.age >= 18 && p.age <= 30;
      
      return playsPosition && notChelsea && hasGoodRating && reasonableAge;
    })
    .sort((a, b) => {
      const ratingA = a.transferroomRating || a.xtvScore || 0;
      const ratingB = b.transferroomRating || b.xtvScore || 0;
      return ratingB - ratingA;
    })
    .slice(0, 3);

  if (prospects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Prospect Analysis - {position}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No suitable prospects found for this position</p>
        </CardContent>
      </Card>
    );
  }

  const topProspect = prospects[0];
  const prospectRating = topProspect.transferroomRating || topProspect.xtvScore || 0;
  const matchPercentage = Math.min(95, Math.max(60, (prospectRating / Math.max(currentBestRating, 50)) * 80 + 10));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          Prospect Analysis - {position}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommendation Header */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Top Recommendation</h3>
              <p className="text-sm text-green-600">{Math.round(matchPercentage)}% match for {position}</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">
            {prospectRating >= currentBestRating ? 'Upgrade' : 'Alternative'}
          </Badge>
        </div>

        {/* Prospect Profile */}
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Avatar className="w-16 h-16">
            <AvatarImage src={topProspect.image} alt={topProspect.name} />
            <AvatarFallback className="bg-green-100 text-green-700 text-lg">
              {topProspect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{topProspect.name}</h3>
            <p className="text-muted-foreground">{topProspect.club}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">Age {topProspect.age}</Badge>
              <Badge variant="outline">{topProspect.nationality}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{prospectRating}</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
        </div>

        {/* Comparison with Current Best */}
        {currentBest && (
          <div className="space-y-3">
            <h4 className="font-medium">vs Current Best ({currentBest.name})</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded">
                <div className="text-sm text-muted-foreground">Current</div>
                <div className="text-lg font-semibold">{currentBestRating}</div>
                <div className="text-xs text-muted-foreground">Age {currentBest.age}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-muted-foreground">Prospect</div>
                <div className="text-lg font-semibold">{prospectRating}</div>
                <div className="text-xs text-muted-foreground">Age {topProspect.age}</div>
              </div>
            </div>
            {prospectRating > currentBestRating && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                Potential upgrade of {(prospectRating - currentBestRating).toFixed(1)} rating points
              </div>
            )}
          </div>
        )}

        {/* Alternative Prospects */}
        {prospects.length > 1 && (
          <div className="space-y-3">
            <h4 className="font-medium">Alternative Options</h4>
            <div className="space-y-2">
              {prospects.slice(1, 3).map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-2 border rounded">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={player.image} alt={player.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{player.name}</div>
                    <div className="text-sm text-muted-foreground">{player.club} • Age {player.age}</div>
                  </div>
                  <div className="text-sm font-medium">{player.transferroomRating || player.xtvScore || 0}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full" size="lg">
          View Detailed Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProspectComparison;
