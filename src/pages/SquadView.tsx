
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayersData } from "@/hooks/usePlayersData";
import SquadSelector from "@/components/SquadSelector";
import SquadRecommendations from "@/components/SquadRecommendations";
import ProspectComparison from "@/components/ProspectComparison";
import SquadValueOverview from "@/components/SquadValueOverview";
import SquadFormationCard from "@/components/SquadFormationCard";
import SquadListView from "@/components/SquadListView";
import ViewToggle from "@/components/ViewToggle";
import { useSquadData } from "@/hooks/useSquadData";
import { useSquadMetrics } from "@/hooks/useSquadMetrics";
import { getSquadDisplayName } from "@/utils/squadUtils";

const SquadView = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedSquad, setSelectedSquad] = useState<string>('first-xi');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'pitch' | 'list'>('pitch');

  // Redirect if not recruitment role
  if (profile?.role !== 'recruitment') {
    navigate('/');
    return null;
  }

  // Fetch real players data
  const { data: allPlayers = [], isLoading, error } = usePlayersData();

  // All users work for Chelsea F.C.
  const userClub = "Chelsea F.C.";

  // Filter players based on Chelsea F.C.
  const clubPlayers = useMemo(() => {
    return allPlayers.filter(player => 
      player.club === userClub || 
      player.club === "Chelsea" ||
      player.club?.toLowerCase().includes('chelsea')
    );
  }, [allPlayers, userClub]);

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
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
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

      {/* Conditional View Rendering */}
      {currentView === 'pitch' ? (
        <>
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
        /* List View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SquadListView players={squadPlayers} />
          <SquadRecommendations 
            players={squadPlayers}
            selectedPosition={selectedPosition}
            onPositionSelect={setSelectedPosition}
            allPlayers={allPlayers}
          />
        </div>
      )}
    </div>
  );
};

export default SquadView;
