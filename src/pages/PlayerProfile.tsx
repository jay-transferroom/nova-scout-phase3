
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PlayerHeader } from "@/components/PlayerHeader";
import { PlayerBasicInfo } from "@/components/PlayerBasicInfo";
import { PlayerClubInfo } from "@/components/PlayerClubInfo";
import { PlayerRecentForm } from "@/components/PlayerRecentForm";
import { PlayerReports } from "@/components/PlayerReports";
import { PlayerNotes } from "@/components/PlayerNotes";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { groupReportsByPlayer } from "@/utils/reportGrouping";
import { 
  getPositionColor, 
  getFormRatingColor, 
  getContractStatusColor, 
  calculateAge, 
  formatDateLocal 
} from "@/utils/playerProfileUtils";

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);

  const { player, isLoading, error, playerReports, reportsLoading } = usePlayerProfile(id);

  // Calculate aggregated data from reports
  const aggregatedData = playerReports && playerReports.length > 0 ? (() => {
    const groupedReports = groupReportsByPlayer(playerReports);
    const playerData = groupedReports[0]; // Should only be one player's reports
    
    return {
      avgRating: playerData?.avgRating || null,
      recommendation: playerData?.recommendation || null,
      reportCount: playerData?.reportCount || 0
    };
  })() : undefined;

  const handleCreateReport = () => {
    navigate('/reports/new', { state: { selectedPlayerId: id } });
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleOpenNotes = () => {
    setNotesOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading player profile...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">Player not found</p>
          <p className="text-gray-600 mb-4">The player you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate('/reports')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <PlayerHeader 
        player={player}
        onCreateReport={handleCreateReport}
        onOpenNotes={handleOpenNotes}
        calculateAge={calculateAge}
        getPositionColor={getPositionColor}
        aggregatedData={aggregatedData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PlayerBasicInfo 
          player={player}
          calculateAge={calculateAge}
          formatDateLocal={formatDateLocal}
        />

        <PlayerClubInfo 
          player={player}
          getContractStatusColor={getContractStatusColor}
          getPositionColor={getPositionColor}
          formatDateLocal={formatDateLocal}
        />

        <PlayerRecentForm 
          player={player}
          getFormRatingColor={getFormRatingColor}
        />
      </div>

      <PlayerReports 
        playerReports={playerReports || []}
        reportsLoading={reportsLoading}
        onViewReport={handleViewReport}
      />

      <PlayerNotes
        playerId={id || ""}
        playerName={player.name}
        open={notesOpen}
        onOpenChange={setNotesOpen}
      />
    </div>
  );
};

export default PlayerProfile;
