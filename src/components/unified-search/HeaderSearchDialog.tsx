
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
      <CommandList className="max-h-[600px]">
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
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4 text-foreground">Featured</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('all', '')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    All Players
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('contractFilter', 'Free Agent')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Free Agents
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('contractFilter', 'Expiring')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Contract expiring
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('contractFilter', 'Under Contract')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Available
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4 text-foreground">Positions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'gk')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Goalkeeper
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'def')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Defender
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'mid')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Midfielder
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('positionFilter', 'att')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Forward
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4 text-foreground">Age Groups</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('ageFilter', 'u21')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    Under 21
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('ageFilter', '21-25')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
                  >
                    21-25 years
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterSearch('ageFilter', '26+')}
                    className="h-9 px-4 text-sm bg-muted hover:bg-muted/80 text-muted-foreground border-0"
                    style={{ fontSize: '14px' }}
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
