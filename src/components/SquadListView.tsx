import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { Users, Calendar, MapPin, TrendingUp } from "lucide-react";

interface SquadListViewProps {
  players: Player[];
  squadType: string;
  formation?: string;
  positionAssignments?: Array<{
    position: string;
    player_id: string;
  }>;
  onPlayerClick?: (player: Player) => void;
  selectedPlayer?: Player | null;
}

const SquadListView = ({ 
  players, 
  squadType, 
  formation = '4-3-3', 
  positionAssignments = [],
  onPlayerClick,
  selectedPlayer
}: SquadListViewProps) => {
  
  // Group players by position category
  const groupPlayersByCategory = () => {
    const categories = {
      Goalkeepers: [] as Player[],
      Defenders: [] as Player[],
      Midfielders: [] as Player[],
      Forwards: [] as Player[]
    };

    players.forEach(player => {
      const mainPosition = player.positions[0];
      
      if (mainPosition === 'GK') {
        categories.Goalkeepers.push(player);
      } else if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(mainPosition)) {
        categories.Defenders.push(player);
      } else if (['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(mainPosition)) {
        categories.Midfielders.push(player);
      } else if (['W', 'LW', 'RW', 'F', 'FW', 'ST', 'CF'].includes(mainPosition)) {
        categories.Forwards.push(player);
      } else {
        // Default to midfielders for unknown positions
        categories.Midfielders.push(player);
      }
    });

    // Sort each category by rating
    Object.values(categories).forEach(category => {
      category.sort((a, b) => {
        const ratingA = a.transferroomRating || a.xtvScore || 0;
        const ratingB = b.transferroomRating || b.xtvScore || 0;
        return ratingB - ratingA;
      });
    });

    return categories;
  };

  const getPlayerAssignment = (playerId: string) => {
    return positionAssignments.find(assignment => assignment.player_id === playerId);
  };

  const formatValue = (rating?: number) => {
    return rating ? Math.round(rating) : 'N/A';
  };

  const getContractStatus = (player: Player) => {
    if (!player.contractExpiry) return null;
    
    const expiryDate = new Date(player.contractExpiry);
    const now = new Date();
    const monthsUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsUntilExpiry <= 6) {
      return { status: 'Expires Soon', variant: 'destructive' as const };
    } else if (monthsUntilExpiry <= 12) {
      return { status: `${monthsUntilExpiry}mo left`, variant: 'secondary' as const };
    }
    return null;
  };

  const categorizedPlayers = groupPlayersByCategory();

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {Object.entries(categorizedPlayers).map(([category, categoryPlayers]) => {
        if (categoryPlayers.length === 0) return null;
        
        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">{category}</h3>
              <Badge variant="outline" className="text-xs">
                {categoryPlayers.length}
              </Badge>
            </div>
            
            <div className="space-y-1">
              {categoryPlayers.map((player) => {
                const assignment = getPlayerAssignment(player.id);
                const contractStatus = getContractStatus(player);
                const isSelected = selectedPlayer?.id === player.id;
                
                return (
                  <Card 
                    key={player.id} 
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => onPlayerClick?.(player)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        {/* Player Avatar */}
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={player.image} 
                            alt={player.name}
                          />
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{player.name}</h4>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {formatValue(player.transferroomRating || player.xtvScore)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{player.age}y</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{player.nationality}</span>
                            </div>
                          </div>

                          {/* Position badges and assignment */}
                          <div className="flex items-center gap-1 mt-2">
                            {player.positions.slice(0, 3).map((position, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                {position}
                              </Badge>
                            ))}
                            
                            {assignment && (
                              <Badge variant="default" className="text-xs px-1 py-0 bg-green-600">
                                {assignment.position}
                              </Badge>
                            )}
                            
                            {contractStatus && (
                              <Badge variant={contractStatus.variant} className="text-xs px-1 py-0">
                                {contractStatus.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {players.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No players available</p>
        </div>
      )}
    </div>
  );
};

export default SquadListView;