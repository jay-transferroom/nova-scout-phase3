
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
import PlayerRatingsCard from "@/components/PlayerRatingsCard";
import PlayerDetailedStats from "@/components/PlayerDetailedStats";
import PlayerInjuryHistory from "@/components/PlayerInjuryHistory";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { groupReportsByPlayer } from "@/utils/reportGrouping";
import { 
  getPositionColor, 
  getFormRatingColor, 
  getContractStatusColor, 
  calculateAge, 
  formatDateLocal 
} from "@/utils/playerProfileUtils";
import ScoutManagerVerdictPanel from "@/components/ScoutManagerVerdictPanel";

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);
  const [managerVerdict, setManagerVerdict] = useState<string | null>(null);

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
    navigate('/report-builder', { state: { selectedPlayerId: id } });
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handleOpenNotes = () => {
    setNotesOpen(true);
  };

  const handleVerdictUpdate = (verdict: string) => {
    setManagerVerdict(verdict);
    // In a real implementation, you would save this to the database
    console.log(`Manager verdict updated for player ${id}:`, verdict);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 flex items-center justify-center">
        <p>Loading player profile...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto py-4 flex items-center justify-center">
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
    <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
        
        <div className="space-y-6">
          <PlayerRatingsCard player={player} aggregatedData={aggregatedData} />
        </div>
      </div>

      {/* Scout Manager Verdict Panel */}
      <div className="mb-4">
        <ScoutManagerVerdictPanel
          playerId={id || ""}
          playerName={player.name}
          currentVerdict={managerVerdict}
          onVerdictUpdate={handleVerdictUpdate}
        />
      </div>

      {/* Detailed Player Statistics */}
      <div className="mb-4">
        <PlayerDetailedStats player={player} />
      </div>

      {/* Player Injury History */}
      <div className="mb-4">
        <PlayerInjuryHistory playerId={id || ""} />
      </div>

      {/* Player Reports Section - Enhanced */}
      <div className="mb-4">
        <PlayerReports 
          playerReports={playerReports || []}
          reportsLoading={reportsLoading}
          onViewReport={handleViewReport}
        />
      </div>

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
