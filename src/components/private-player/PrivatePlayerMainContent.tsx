import { PlayerBasicInfo } from "@/components/PlayerBasicInfo";
import { PlayerClubInfo } from "@/components/PlayerClubInfo";
import { PlayerReports } from "@/components/PlayerReports";
import { PrivatePlayerNotesSection } from "./PrivatePlayerNotesSection";
import { PrivatePlayerSourceSection } from "./PrivatePlayerSourceSection";
import { Player } from "@/types/player";
import { ReportWithPlayer } from "@/types/report";

interface PrivatePlayerMainContentProps {
  player: Player;
  playerReports: ReportWithPlayer[];
  reportsLoading: boolean;
  onViewReport: (reportId: string) => void;
  calculateAge: (dateOfBirth: string) => number | null;
  formatDateLocal: (dateString: string) => string;
  getContractStatusColor: (status: string) => string;
  getPositionColor: (position: string) => string;
}

export const PrivatePlayerMainContent = ({
  player,
  playerReports,
  reportsLoading,
  onViewReport,
  calculateAge,
  formatDateLocal,
  getContractStatusColor,
  getPositionColor
}: PrivatePlayerMainContentProps) => {
  return (
    <div className="xl:col-span-3 space-y-6">
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
      </div>
      
      {/* Player Reports Section */}
      <PlayerReports 
        playerReports={playerReports || []}
        reportsLoading={reportsLoading}
        onViewReport={onViewReport}
        playerId={player.id}
        playerName={player.name}
      />
      
      {/* Notes Section */}
      <PrivatePlayerNotesSection player={player} />

      {/* Source Context */}
      <PrivatePlayerSourceSection player={player} />
    </div>
  );
};