import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { usePrivatePlayerProfile } from "@/hooks/usePrivatePlayerProfile";
import { usePrivatePlayerActions } from "@/hooks/usePrivatePlayerActions";
import { PlayerHeader } from "@/components/PlayerHeader";
import { PlayerNotes } from "@/components/PlayerNotes";
import {
  PrivatePlayerLoadingState,
  PrivatePlayerErrorState,
  PrivatePlayerMainContent,
  PrivatePlayerSidebar
} from "@/components/private-player";
import { 
  calculateAge, 
  formatDateLocal, 
  getPositionColor, 
  getContractStatusColor 
} from "@/utils/playerProfileUtils";

const PrivatePlayerProfile = () => {
  const { id: playerId } = useParams();
  const navigate = useNavigate();
  
  const { player, isLoading, error, playerReports, reportsLoading } = usePrivatePlayerProfile(playerId);
  const { 
    notesOpen, 
    setNotesOpen, 
    calculateAggregatedData, 
    onCreateReport, 
    onOpenNotes, 
    handleViewReport 
  } = usePrivatePlayerActions();

  // Calculate aggregated data from reports
  const aggregatedData = calculateAggregatedData(playerReports);

  // Loading state
  if (isLoading) {
    return <PrivatePlayerLoadingState />;
  }

  // Error state
  if (error || !player) {
    return <PrivatePlayerErrorState />;
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* Player Header */}
      <div className="mb-6">
        <PlayerHeader
          player={player}
          onCreateReport={() => onCreateReport(player)}
          onOpenNotes={onOpenNotes}
          calculateAge={calculateAge}
          getPositionColor={getPositionColor}
          aggregatedData={aggregatedData}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        <PrivatePlayerMainContent
          player={player}
          playerReports={playerReports}
          reportsLoading={reportsLoading}
          onViewReport={handleViewReport}
          calculateAge={calculateAge}
          formatDateLocal={formatDateLocal}
          getContractStatusColor={getContractStatusColor}
          getPositionColor={getPositionColor}
        />
        
        <PrivatePlayerSidebar 
          player={player} 
          aggregatedData={aggregatedData} 
        />
      </div>

      {/* Player Notes Modal */}
      <PlayerNotes
        playerId={player.id || ""}
        playerName={player.name}
        open={notesOpen}
        onOpenChange={setNotesOpen}
      />
    </div>
  );
};

export default PrivatePlayerProfile;