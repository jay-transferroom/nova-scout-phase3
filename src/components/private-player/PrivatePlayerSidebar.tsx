import PlayerRatingsCard from "@/components/PlayerRatingsCard";
import PlayerAIRecommendation from "@/components/PlayerAIRecommendation";
import { Player } from "@/types/player";

interface PrivatePlayerSidebarProps {
  player: Player;
  aggregatedData?: {
    avgRating: number | null;
    recommendation: string | null;
    reportCount: number;
  };
}

export const PrivatePlayerSidebar = ({ player, aggregatedData }: PrivatePlayerSidebarProps) => {
  return (
    <div className="xl:col-span-1 space-y-6">
      <PlayerRatingsCard player={player} aggregatedData={aggregatedData} />
      <PlayerAIRecommendation player={player} />
    </div>
  );
};