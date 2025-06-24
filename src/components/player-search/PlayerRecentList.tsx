
import { Player } from "@/types/player";
import PlayerItem from "./PlayerItem";

interface PlayerRecentListProps {
  players: Player[];
  getTeamLogo: (clubName: string) => string | undefined;
  onSelectPlayer: (player: Player) => void;
}

const PlayerRecentList = ({ players, getTeamLogo, onSelectPlayer }: PlayerRecentListProps) => {
  if (players.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <h3 className="px-4 py-2 text-sm font-medium border-b">Recently Viewed</h3>
      <ul className="divide-y">
        {players.map((player) => (
          <PlayerItem 
            key={player.id} 
            player={player} 
            teamLogo={getTeamLogo(player.club)}
            onSelect={onSelectPlayer}
          />
        ))}
      </ul>
    </div>
  );
};

export default PlayerRecentList;
