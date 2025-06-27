
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Calendar, Star, UserPlus, Eye, FileText, MoreHorizontal, Bookmark, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface PlayerCardProps {
  player: any;
  getAssignmentBadge: (playerId: string) => JSX.Element;
  getEuGbeBadge: (status: string) => JSX.Element;
  getPlayerAssignment: (playerId: string) => any;
  formatXtvScore: (score: number) => string;
  onAssignScout: (player: any) => void;
  onRemovePlayer: (playerId: string) => void;
}

export const PlayerCard = ({
  player,
  getAssignmentBadge,
  getEuGbeBadge,
  getPlayerAssignment,
  formatXtvScore,
  onAssignScout,
  onRemovePlayer
}: PlayerCardProps) => {
  const navigate = useNavigate();

  const handleCreateReport = () => {
    if (player.isPrivate) {
      // For private players, navigate with the private player data
      navigate('/report-builder', { 
        state: { selectedPrivatePlayer: player } 
      });
    } else {
      // For public players, navigate with the public player data
      navigate('/report-builder', { 
        state: { selectedPlayer: player } 
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Player Avatar */}
        <Avatar className="h-16 w-16">
          <AvatarImage src={player.image} alt={player.name} />
          <AvatarFallback>
            {player.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        {/* Player Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{player.name}</h3>
                {player.isPrivate && (
                  <Badge variant="secondary">Private Player</Badge>
                )}
                {!player.isPrivate && getAssignmentBadge(player.id.toString())}
                {!player.isPrivate && getEuGbeBadge(player.euGbeStatus || 'Pass')}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {player.club}
                </span>
                <span>{player.positions.join(', ')}</span>
                {player.age && <span>{player.age} years</span>}
                <span>{player.nationality}</span>
              </div>
              {!player.isPrivate && (
                <div className="flex items-center gap-4 text-sm">
                  {player.transferroomRating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      Rating: {player.transferroomRating}
                    </span>
                  )}
                  {player.futureRating && (
                    <span className="text-green-600">
                      Potential: {player.futureRating}
                    </span>
                  )}
                  {player.xtvScore && (
                    <span className="text-blue-600">
                      xTV: £{formatXtvScore(player.xtvScore)}M
                    </span>
                  )}
                  {player.contractExpiry && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Contract: {new Date(player.contractExpiry).getFullYear()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!player.isPrivate && !getPlayerAssignment(player.id.toString()) ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAssignScout(player)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Assign Scout
              </Button>
            ) : !player.isPrivate && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAssignScout(player)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Reassign Scout
              </Button>
            )}
            <Link to={player.profilePath}>
              <Button 
                size="sm" 
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleCreateReport}
            >
              <FileText className="h-4 w-4 mr-1" />
              Report
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Move to list
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onRemovePlayer(player.id.toString())}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from list
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
