
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, Star, ArrowRight, Users } from "lucide-react";
import { Player } from "@/types/player";

interface ProspectComparisonProps {
  position: string;
  currentPlayers: Player[];
}

// Mock prospect data - in real app this would come from your scouting database
const mockProspects = {
  'Centre Back': [
    {
      id: '1',
      name: 'Dahoud Malacia',
      club: 'AS Monaco',
      age: 24,
      xTV: 45.2,
      rating: 89.1,
      strengths: ['Aerial ability', 'Passing range', 'Leadership'],
      recommendation: 'Highly recommended',
      matchPercentage: 90,
      transferValue: '£35M',
      nationality: 'Netherlands'
    }
  ],
  'Central Midfield': [
    {
      id: '2',
      name: 'Marco Silva',
      club: 'FC Porto',
      age: 22,
      xTV: 38.7,
      rating: 82.3,
      strengths: ['Vision', 'Work rate', 'Set pieces'],
      recommendation: 'Good potential',
      matchPercentage: 85,
      transferValue: '£28M',
      nationality: 'Portugal'
    }
  ],
  'Full Back': [
    {
      id: '3',
      name: 'Carlos Mendoza',
      club: 'Valencia CF',
      age: 21,
      xTV: 25.8,
      rating: 78.9,
      strengths: ['Pace', 'Crossing', 'Defensive work rate'],
      recommendation: 'Promising prospect',
      matchPercentage: 82,
      transferValue: '£18M',
      nationality: 'Spain'
    }
  ]
};

const ProspectComparison = ({ position, currentPlayers }: ProspectComparisonProps) => {
  const prospects = mockProspects[position as keyof typeof mockProspects] || [];
  
  // Don't render the component if there are no prospects
  if (prospects.length === 0) {
    return null;
  }

  // Find the best current player for this position based on recent form rating
  const currentBest = currentPlayers.length > 0 
    ? currentPlayers.reduce((best, player) => {
        const bestRating = best?.recentForm?.rating || 0;
        const playerRating = player.recentForm?.rating || 0;
        return playerRating > bestRating ? player : best;
      }, currentPlayers[0])
    : null;

  const prospect = prospects[0];

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
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {prospect.matchPercentage}%
          </div>
          <div className="flex-1">
            <div className="font-medium text-blue-900">{prospect.recommendation}</div>
            <div className="text-sm text-blue-700">
              {prospect.name} looks like an excellent fit for {position}
            </div>
          </div>
        </div>

        {/* Prospect Profile */}
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-green-100 text-green-700">
              {prospect.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">{prospect.name}</div>
            <div className="text-sm text-muted-foreground">
              {prospect.club} • Age {prospect.age} • {prospect.nationality}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-green-600">{prospect.rating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Current Best
            </h4>
            {currentBest ? (
              <div className="p-3 border rounded-lg">
                <div className="font-medium">{currentBest.name}</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {currentBest.club} • Age {currentBest.age}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Rating</span>
                    <span className="font-medium">
                      {currentBest.recentForm?.rating ? currentBest.recentForm.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Matches</span>
                    <span className="font-medium">{currentBest.recentForm?.matches || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Goals</span>
                    <span className="font-medium">{currentBest.recentForm?.goals || 0}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">No current players for this position</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-green-600" />
              Prospect
            </h4>
            <div className="p-3 border rounded-lg border-green-200 bg-green-50">
              <div className="font-medium">{prospect.name}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {prospect.club} • Age {prospect.age}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Rating</span>
                  <span className="font-medium text-green-600">{prospect.rating}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>xTV</span>
                  <span className="font-medium text-green-600">£{prospect.xTV}M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Strengths */}
        <div>
          <h4 className="font-medium mb-2">Key Strengths</h4>
          <div className="flex flex-wrap gap-2">
            {prospect.strengths.map((strength, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        {/* Impact Analysis */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Expected Impact</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Squad Rating Improvement</span>
              <span className="font-medium text-green-600">
                {currentBest && currentBest.recentForm?.rating 
                  ? `+${(prospect.rating - currentBest.recentForm.rating).toFixed(1)}` 
                  : '+12.3%'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Position Depth</span>
              <span className="font-medium text-blue-600">Significantly Enhanced</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Transfer Value</span>
              <span className="font-medium">{prospect.transferValue}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full" size="lg">
          View Full Scouting Report
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProspectComparison;
