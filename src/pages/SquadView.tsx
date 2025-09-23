
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayersData } from "@/hooks/usePlayersData";
import { usePlayerPositionAssignments, useUpdatePlayerPositionAssignment } from "@/hooks/usePlayerPositionAssignments";
import SquadSelector from "@/components/SquadSelector";
import SquadRecommendations from "@/components/SquadRecommendations";
import ProspectComparison from "@/components/ProspectComparison";
import CompactSquadValueOverview from "@/components/CompactSquadValueOverview";
import SquadFormationCard from "@/components/SquadFormationCard";
import SquadTableView from "@/components/SquadTableView";
import ViewToggle from "@/components/ViewToggle";
import SquadSettingsButton from "@/components/SquadSettingsButton";
import { useSquadData } from "@/hooks/useSquadData";
import { useSquadMetrics } from "@/hooks/useSquadMetrics";
import { useClubSettings } from "@/hooks/useClubSettings";
import { getSquadDisplayName } from "@/utils/squadUtils";

const SquadView = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedSquad, setSelectedSquad] = useState<string>('first-team');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'pitch' | 'list'>('pitch');

  // Redirect if not recruitment or director role
  if (profile?.role !== 'recruitment' && profile?.role !== 'director') {
    navigate('/');
    return null;
  }

  // Fetch real players data
  const { data: allPlayers = [], isLoading, error } = usePlayersData();

  const userClub = "Chelsea F.C.";

  // Get club settings including formation
  const { data: clubSettings } = useClubSettings(userClub);
  const currentFormation = clubSettings?.formation || '4-3-3';
  
  // Get player position assignments
  const { data: positionAssignments = [] } = usePlayerPositionAssignments(userClub, currentFormation, selectedSquad);
  const updateAssignment = useUpdatePlayerPositionAssignment();

  // Filter players based on Chelsea F.C. (including all squads and loans)
  const clubPlayers = useMemo(() => {
    return allPlayers.filter(player => {
      // Check if player belongs to Chelsea in any capacity
      const club = player.club?.toLowerCase() || '';
      return club.includes('chelsea') || 
             club === 'chelsea fc' || 
             club === 'chelsea';
    });
  }, [allPlayers]);

  // Use custom hooks for data management
  const { squadPlayers } = useSquadData(clubPlayers, selectedSquad);
  const squadMetrics = useSquadMetrics(squadPlayers, selectedSquad);

  const displayTitle = `${userClub} ${getSquadDisplayName(selectedSquad)} Analysis`;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading squad data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading squad data. Please try again.</div>
        </div>
      </div>
    );
  }

  const handlePlayerChange = async (position: string, playerId: string) => {
    console.log(`Player change requested: ${position} -> ${playerId}`);
    
    try {
      await updateAssignment.mutateAsync({
        club_name: userClub,
        position: position,
        player_id: playerId,
        formation: currentFormation,
        squad_type: selectedSquad
      });
    } catch (error) {
      console.error('Failed to update player assignment:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">CFC</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{displayTitle}</h1>
            <p className="text-muted-foreground mt-2">
              Manage squad formations, analyze depth, and identify recruitment opportunities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SquadSettingsButton clubName={userClub} />
          <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
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
      <CompactSquadValueOverview
        selectedSquad={selectedSquad}
        squadMetrics={squadMetrics}
        squadPlayersLength={squadPlayers.length}
      />

      {/* Conditional View Rendering */}
      {currentView === 'pitch' ? (
        <>
          {/* Enhanced Football Pitch Visualization */}
          <SquadFormationCard
            squadPlayers={squadPlayers}
            selectedSquad={selectedSquad}
            formation={currentFormation}
            positionAssignments={positionAssignments}
            onPositionClick={setSelectedPosition}
            selectedPosition={selectedPosition}
            onPlayerChange={handlePlayerChange}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Squad Recommendations */}
            <SquadRecommendations 
              players={squadPlayers}
              selectedPosition={selectedPosition}
              onPositionSelect={setSelectedPosition}
              allPlayers={allPlayers}
            />

            {/* Prospect Comparison */}
            {selectedPosition && (
              <ProspectComparison 
                position={selectedPosition}
                currentPlayers={squadPlayers.filter(p => 
                  p.positions.some(pos => pos.toLowerCase().includes(selectedPosition.toLowerCase()))
                )}
                allPlayers={allPlayers}
              />
            )}
          </div>
        </>
      ) : (
        /* Table View */
        <SquadTableView players={squadPlayers} />
      )}
    </div>
  );
};

export default SquadView;
