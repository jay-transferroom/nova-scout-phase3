
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

interface HeaderSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  placeholder: string;
  filteredPlayers: Player[];
  recentPlayers: Player[];
  maxDisplayResults: number;
  getTeamLogo: (clubName: string) => string | undefined;
  onSelectPlayer: (player: Player) => void;
  onViewMore: () => void;
}

const HeaderSearchDialog = ({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  placeholder,
  filteredPlayers,
  recentPlayers,
  maxDisplayResults,
  getTeamLogo,
  onSelectPlayer,
  onViewMore
}: HeaderSearchDialogProps) => {
  console.log('HeaderSearchDialog - Rendering with:', {
    searchQuery,
    filteredPlayersCount: filteredPlayers.length,
    recentPlayersCount: recentPlayers.length
  });

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
            <CommandGroup heading={`Players (${filteredPlayers.length})`}>
              {filteredPlayers.map((player) => (
                <PlayerCommandItem
                  key={player.id}
                  player={player}
                  teamLogo={getTeamLogo(player.club)}
                  onSelect={() => onSelectPlayer(player)}
                />
              ))}
              
              {filteredPlayers.length === maxDisplayResults && (
                <CommandItem onSelect={onViewMore} className="flex items-center justify-center gap-2 p-3 text-sm">
                  <ArrowRight className="h-4 w-4" />
                  View all results
                </CommandItem>
              )}
            </CommandGroup>
          ) : (
            <CommandEmpty>No players found for "{searchQuery}"</CommandEmpty>
          )
        ) : (
          recentPlayers.length > 0 && (
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
          )
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default HeaderSearchDialog;
