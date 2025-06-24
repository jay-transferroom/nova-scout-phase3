
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Player } from "@/types/player";
import PlayerItem from "./PlayerItem";

interface PlayerSearchResultsProps {
  players: Player[];
  totalCount: number;
  maxDisplayResults: number;
  getTeamLogo: (clubName: string) => string | undefined;
  onSelectPlayer: (player: Player) => void;
  onViewMore: () => void;
}

const PlayerSearchResults = ({
  players,
  totalCount,
  maxDisplayResults,
  getTeamLogo,
  onSelectPlayer,
  onViewMore
}: PlayerSearchResultsProps) => {
  const displayedResults = players.slice(0, maxDisplayResults);
  const hasMoreResults = players.length > maxDisplayResults;

  return (
    <div className="rounded-md border">
      <h3 className="px-4 py-2 text-sm font-medium border-b">Search Results ({totalCount})</h3>
      {displayedResults.length > 0 ? (
        <>
          <ul className="divide-y">
            {displayedResults.map((player) => (
              <PlayerItem 
                key={player.id} 
                player={player} 
                teamLogo={getTeamLogo(player.club)}
                onSelect={onSelectPlayer}
              />
            ))}
          </ul>
          {hasMoreResults && (
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onViewMore}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                View all {totalCount} results
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="p-4 text-center text-muted-foreground">No players found</p>
      )}
    </div>
  );
};

export default PlayerSearchResults;
