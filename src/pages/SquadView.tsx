
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockPlayers } from "@/data/mockPlayers";
import SquadSelector from "@/components/SquadSelector";
import SquadRecommendations from "@/components/SquadRecommendations";
import ProspectComparison from "@/components/ProspectComparison";
import SquadValueOverview from "@/components/SquadValueOverview";
import SquadFormationCard from "@/components/SquadFormationCard";
import { useSquadData } from "@/hooks/useSquadData";
import { useSquadMetrics } from "@/hooks/useSquadMetrics";
import { getSquadDisplayName } from "@/utils/squadUtils";

const SquadView = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedSquad, setSelectedSquad] = useState<string>('first-xi');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Redirect if not recruitment role
  if (profile?.role !== 'recruitment') {
    navigate('/');
    return null;
  }

  // For now, we'll use a mock club affiliation - in a real app this would come from the user profile
  const userClub = "Manchester United"; // This should come from profile.club or similar

  // Filter players based on user's club affiliation
  const clubPlayers = useMemo(() => {
    return mockPlayers.filter(player => player.club === userClub);
  }, [userClub]);

  // Use custom hooks for data management
  const { squadPlayers } = useSquadData(clubPlayers, selectedSquad);
  const squadMetrics = useSquadMetrics(squadPlayers, selectedSquad);

  const displayTitle = `${userClub} ${getSquadDisplayName(selectedSquad)} Analysis`;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{displayTitle}</h1>
            <p className="text-muted-foreground mt-2">
              Manage squad formations, analyze depth, and identify recruitment opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Squad Selector */}
      <SquadSelector 
        selectedSquad={selectedSquad}
        onSquadSelect={setSelectedSquad}
        club={userClub}
        players={clubPlayers}
      />

      {/* Squad Value Overview */}
      <SquadValueOverview
        selectedSquad={selectedSquad}
        squadMetrics={squadMetrics}
        squadPlayersLength={squadPlayers.length}
      />

      {/* Enhanced Football Pitch Visualization */}
      <SquadFormationCard
        squadPlayers={squadPlayers}
        selectedSquad={selectedSquad}
        onPositionClick={setSelectedPosition}
        selectedPosition={selectedPosition}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Squad Recommendations */}
        <SquadRecommendations 
          players={squadPlayers}
          selectedPosition={selectedPosition}
          onPositionSelect={setSelectedPosition}
        />

        {/* Prospect Comparison */}
        {selectedPosition && (
          <ProspectComparison 
            position={selectedPosition}
            currentPlayers={squadPlayers.filter(p => 
              p.positions.some(pos => pos.toLowerCase().includes(selectedPosition.toLowerCase()))
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SquadView;
