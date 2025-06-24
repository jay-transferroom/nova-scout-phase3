
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, LayoutList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockPlayers } from "@/data/mockPlayers";
import SquadSelector from "@/components/SquadSelector";
import SquadRecommendations from "@/components/SquadRecommendations";
import ProspectComparison from "@/components/ProspectComparison";
import SquadValueOverview from "@/components/SquadValueOverview";
import SquadFormationCard from "@/components/SquadFormationCard";
import SquadListView from "@/components/SquadListView";
import { useSquadData } from "@/hooks/useSquadData";
import { useSquadMetrics } from "@/hooks/useSquadMetrics";
import { getSquadDisplayName } from "@/utils/squadUtils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const SquadView = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedSquad, setSelectedSquad] = useState<string>('first-xi');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'pitch' | 'list'>('pitch');

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

  // Check if there are prospects for the selected position
  const hasProspectsForPosition = (position: string | null) => {
    if (!position) return false;
    const mockProspects = {
      'Centre Back': true,
      'Central Midfield': true,
      'Full Back': true
    };
    return mockProspects[position as keyof typeof mockProspects] || false;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
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

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Squad Overview</h2>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'pitch' | 'list')}>
          <ToggleGroupItem value="pitch" aria-label="Pitch View">
            <Users className="h-4 w-4 mr-2" />
            Pitch View
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View">
            <LayoutList className="h-4 w-4 mr-2" />
            List View
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Squad Visualization */}
      {viewMode === 'pitch' ? (
        <SquadFormationCard
          squadPlayers={squadPlayers}
          selectedSquad={selectedSquad}
          onPositionClick={setSelectedPosition}
          selectedPosition={selectedPosition}
        />
      ) : (
        <SquadListView players={squadPlayers} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Squad Recommendations */}
        <SquadRecommendations 
          players={squadPlayers}
          selectedPosition={selectedPosition}
          onPositionSelect={setSelectedPosition}
        />

        {/* Prospect Comparison - Only show if there are prospects for the selected position */}
        {selectedPosition && hasProspectsForPosition(selectedPosition) && (
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
