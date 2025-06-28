
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
import PlayerAIRecommendation from "@/components/PlayerAIRecommendation";
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
    console.log(`Manager verdict updated for player ${id}:`, verdict);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[400px]">
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
          onCreateReport={handleCreateReport}
          onOpenNotes={handleOpenNotes}
          calculateAge={calculateAge}
          getPositionColor={getPositionColor}
          aggregatedData={aggregatedData}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        {/* Left Column - Main Info */}
        <div className="xl:col-span-3 space-y-6">
          {/* Basic Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Scout Manager Verdict Panel */}
          <ScoutManagerVerdictPanel
            playerId={id || ""}
            playerName={player.name}
            currentVerdict={managerVerdict}
            onVerdictUpdate={handleVerdictUpdate}
          />

          {/* Detailed Player Statistics */}
          <PlayerDetailedStats player={player} />

          {/* Player Injury History */}
          <PlayerInjuryHistory playerId={id || ""} />

          {/* Player Reports Section */}
          <PlayerReports 
            playerReports={playerReports || []}
            reportsLoading={reportsLoading}
            onViewReport={handleViewReport}
          />
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <PlayerRatingsCard player={player} aggregatedData={aggregatedData} />
          <PlayerAIRecommendation player={player} />
        </div>
      </div>

      {/* Player Notes Modal */}
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
