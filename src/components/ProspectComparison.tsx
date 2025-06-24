
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { Player } from "@/types/player";
import { mockProspects } from "@/data/mockProspects";
import ProspectRecommendationHeader from "./ProspectRecommendationHeader";
import ProspectProfile from "./ProspectProfile";
import ProspectVsCurrent from "./ProspectVsCurrent";
import ProspectStrengths from "./ProspectStrengths";
import ProspectImpactAnalysis from "./ProspectImpactAnalysis";

interface ProspectComparisonProps {
  position: string;
  currentPlayers: Player[];
}

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
        <ProspectRecommendationHeader
          matchPercentage={prospect.matchPercentage}
          recommendation={prospect.recommendation}
          name={prospect.name}
          position={position}
        />

        <ProspectProfile prospect={prospect} />

        <ProspectVsCurrent currentBest={currentBest} prospect={prospect} />

        <ProspectStrengths strengths={prospect.strengths} />

        <ProspectImpactAnalysis currentBest={currentBest} prospect={prospect} />

        <Button className="w-full" size="lg">
          View Full Scouting Report
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProspectComparison;
