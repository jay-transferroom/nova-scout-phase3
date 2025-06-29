
import { CommandItem } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Player } from "@/types/player";

interface PlayerCommandItemProps {
  player: Player;
  teamLogo?: string;
  onSelect: () => void;
}

const PlayerCommandItem = ({ player, teamLogo, onSelect }: PlayerCommandItemProps) => {
  return (
    <CommandItem
      onSelect={onSelect}
      className="flex items-center gap-3 p-3"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage 
          src={player.image} 
          alt={player.name}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
          {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <p className="font-medium">{player.name}</p>
        <p className="text-sm text-muted-foreground">
          {player.club} • {player.positions.join(", ")}
          {player.isPrivatePlayer && (
            <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-1 rounded">Private</span>
          )}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-sm text-right">
          <p>{player.age} yrs</p>
          <p className="text-muted-foreground">{player.nationality}</p>
        </div>
        
        {teamLogo && (
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={teamLogo} 
              alt={`${player.club} logo`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs font-semibold">
              {player.club.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </CommandItem>
  );
};

export default PlayerCommandItem;
