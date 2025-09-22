
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ArrowRight } from "lucide-react";
import { Player } from "@/types/player";
import PlayerCommandItem from "./PlayerCommandItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  placeholder: string;
  filteredPlayers: Player[];
  totalResults: number;
  recentPlayers: Player[];
  maxDisplayResults: number;
  getTeamLogo: (clubName: string) => string | undefined;
  onSelectPlayer: (player: Player) => void;
  onViewMore: () => void;
  onFilterSearch: (filterType: string, filterValue: string) => void;
}

const HeaderSearchDialog = ({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  placeholder,
  filteredPlayers,
  totalResults,
  recentPlayers,
  maxDisplayResults,
  getTeamLogo,
  onSelectPlayer,
  onViewMore,
  onFilterSearch,
}: HeaderSearchDialogProps) => {
  // HeaderSearchDialog render

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={placeholder}
        value={searchQuery}
        onValueChange={onSearchQueryChange}
      />
      <CommandList>
        {searchQuery.trim() ? (
          filteredPlayers.length > 0 ? (
            <CommandGroup heading={`Players (${totalResults})`}>
              {filteredPlayers.slice(0, maxDisplayResults).map((player) => (
                <PlayerCommandItem
                  key={player.id}
                  player={player}
                  teamLogo={getTeamLogo(player.club)}
                  onSelect={() => onSelectPlayer(player)}
                />
              ))}
              
              {totalResults > 0 && (
                <CommandItem 
                  value={`view all ${totalResults} results for ${searchQuery}`}
                  onSelect={onViewMore} 
                  className="flex items-center justify-center gap-2 p-3 text-sm"
                >
                  <ArrowRight className="h-4 w-4" />
                  View all {totalResults} results
                </CommandItem>
              )}
            </CommandGroup>
          ) : (
            <CommandEmpty>No players found for "{searchQuery}"</CommandEmpty>
          )
        ) : (
          <>
            {recentPlayers.length > 0 && (
              <CommandGroup heading="Recently Viewed">
                {recentPlayers.map((player) => (
                  <PlayerCommandItem
                    key={player.id}
                    player={player}
                    teamLogo={getTeamLogo(player.club)}
                    onSelect={() => onSelectPlayer(player)}
                  />
                ))}
              </CommandGroup>
            )}
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Featured</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('all', '')}
                    className="h-8"
                  >
                    All Players
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('contractFilter', 'Free Agent')}
                    className="h-8"
                  >
                    Free Agents
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('contractFilter', 'Expiring')}
                    className="h-8"
                  >
                    Contract expiring
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('contractFilter', 'Under Contract')}
                    className="h-8"
                  >
                    Available
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Positions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'gk')}
                    className="h-8"
                  >
                    Goalkeeper
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'def')}
                    className="h-8"
                  >
                    Defender
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'mid')}
                    className="h-8"
                  >
                    Midfielder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'att')}
                    className="h-8"
                  >
                    Forward
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Age Groups</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('ageFilter', 'u21')}
                    className="h-8"
                  >
                    Under 21
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('ageFilter', '21-25')}
                    className="h-8"
                  >
                    21-25 years
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterSearch('ageFilter', '26+')}
                    className="h-8"
                  >
                    26+ years
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default HeaderSearchDialog;
