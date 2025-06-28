import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Player } from "@/types/player";
import { MoreHorizontal, Plus, AlertTriangle, Clock } from "lucide-react";

interface EnhancedFootballPitchProps {
  players: Player[];
  squadType: string;
  onPositionClick?: (position: string) => void;
  selectedPosition?: string | null;
}

const FORMATION_POSITIONS = {
  GK: { x: 50, y: 8, label: 'Goalkeeper' },
  LB: { x: 15, y: 22, label: 'Full Back' },
  CB1: { x: 35, y: 22, label: 'Centre Back' },
  CB2: { x: 65, y: 22, label: 'Centre Back' },
  RB: { x: 85, y: 22, label: 'Full Back' },
  CDM: { x: 50, y: 40, label: 'Central Midfield' },
  CM1: { x: 30, y: 52, label: 'Central Midfield' },
  CM2: { x: 70, y: 52, label: 'Central Midfield' },
  LW: { x: 20, y: 72, label: 'Winger' },
  ST: { x: 50, y: 82, label: 'Striker' },
  RW: { x: 80, y: 72, label: 'Winger' },
};

const EnhancedFootballPitch = ({ players, squadType, onPositionClick, selectedPosition }: EnhancedFootballPitchProps) => {
  // Track used players to avoid duplicates across positions
  const usedPlayerIds = new Set<string>();

  const getPlayersForPosition = (position: string) => {
    // Create a more comprehensive position mapping with multiple fallback levels
    const getPositionPriorities = (pos: string) => {
      switch (pos) {
        case 'GK': 
          return [['GK'], ['CB'], ['CDM']]; // Goalkeepers first, then defensive players as emergency
        case 'LB': 
          return [['LB', 'LWB'], ['LM', 'LW'], ['CB'], ['CM']];
        case 'CB1': 
        case 'CB2': 
          return [['CB'], ['CDM'], ['LB', 'RB', 'LWB', 'RWB'], ['CM']];
        case 'RB': 
          return [['RB', 'RWB'], ['RM', 'RW'], ['CB'], ['CM']];
        case 'CDM': 
          return [['CDM'], ['CM'], ['CB'], ['CAM']];
        case 'CM1': 
        case 'CM2': 
          return [['CM'], ['CAM', 'CDM'], ['LM', 'RM'], ['LW', 'RW']];
        case 'LW': 
          return [['LW'], ['LM'], ['LB', 'LWB'], ['ST', 'CF'], ['CAM']];
        case 'ST': 
          return [['ST', 'CF'], ['CAM'], ['LW', 'RW'], ['CM']];
        case 'RW': 
          return [['RW'], ['RM'], ['RB', 'RWB'], ['ST', 'CF'], ['CAM']];
        default: 
          return [[]];
      }
    };

    const priorities = getPositionPriorities(position);
    
    // Try each priority level until we find available players
    for (const priorityGroup of priorities) {
      const availablePlayers = players.filter(player => 
        !usedPlayerIds.has(player.id) &&
        player.positions.some(playerPos => priorityGroup.includes(playerPos))
      );
      
      if (availablePlayers.length > 0) {
        // Sort by rating and take the best available
        const sortedPlayers = availablePlayers.sort((a, b) => {
          const ratingA = a.transferroomRating || a.xtvScore || 0;
          const ratingB = b.transferroomRating || b.xtvScore || 0;
          return ratingB - ratingA;
        });
        
        // Mark the best player as used
        const selectedPlayer = sortedPlayers[0];
        usedPlayerIds.add(selectedPlayer.id);
        return [selectedPlayer];
      }
    }

    // Ultimate fallback: if no players found with position matching, 
    // just take any available player (this ensures every position gets filled)
    const anyAvailablePlayer = players.find(player => !usedPlayerIds.has(player.id));
    if (anyAvailablePlayer) {
      usedPlayerIds.add(anyAvailablePlayer.id);
      return [anyAvailablePlayer];
    }

    // If we somehow run out of players entirely, return empty array
    return [];
  };

  const handlePositionClick = (position: string, label: string) => {
    if (onPositionClick) {
      onPositionClick(label);
    }
  };

  const getContractRiskLevel = (player: Player) => {
    if (!player.contractExpiry) return 'none';
    const expiryDate = new Date(player.contractExpiry);
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const sixMonthsFromNow = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
    
    if (expiryDate < sixMonthsFromNow) return 'high';
    if (expiryDate < oneYearFromNow) return 'medium';
    return 'low';
  };

  const renderPlayerTooltipContent = (positionPlayers: Player[]) => {
    if (positionPlayers.length === 0) {
      return (
        <div className="p-2">
          <p className="text-sm text-red-500 font-medium">No players available</p>
        </div>
      );
    }

    return (
      <div className="p-2 max-w-xs">
        <div className="space-y-2">
          {positionPlayers.map((player, index) => {
            const contractRisk = getContractRiskLevel(player);
            const isInjured = Math.random() < 0.1; // Mock injury status
            const mockValue = Math.floor(Math.random() * 80) + 5; // Mock transfer value
            const mockHeight = Math.floor(Math.random() * 20) + 170; // Mock height

            return (
              <div key={player.id} className="flex items-center gap-2 text-sm">
                <Avatar className="w-6 h-6">
                  <AvatarImage 
                    src={player.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&crop=face&fit=crop`} 
                    alt={player.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{player.name}</div>
                  <div className="text-xs text-gray-500">
                    Age {player.age} • {mockHeight}cm • €{mockValue}M
                  </div>
                  <div className="flex gap-1 mt-1">
                    {contractRisk === 'high' && (
                      <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <Clock className="h-1.5 w-1.5 text-white" />
                      </div>
                    )}
                    {contractRisk === 'medium' && (
                      <div className="w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                        <Clock className="h-1.5 w-1.5 text-white" />
                      </div>
                    )}
                    {isInjured && (
                      <div className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-1.5 w-1.5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPositionCard = (position: string, coords: { x: number; y: number; label: string }) => {
    const positionPlayers = getPlayersForPosition(position);
    const isSelected = selectedPosition === coords.label;
    const primaryPlayer = positionPlayers[0];
    
    return (
      <TooltipProvider key={position}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-10 ${
                isSelected ? 'scale-110' : 'hover:scale-105'
              }`}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
              onClick={() => handlePositionClick(position, coords.label)}
            >
              {primaryPlayer ? (
                <div className="bg-white rounded-lg shadow-lg p-2 min-w-28 border hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-1 mb-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage 
                        src={primaryPlayer.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&crop=face&fit=crop`} 
                        alt={primaryPlayer.name}
                      />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {primaryPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{primaryPlayer.name}</div>
                      <div className="text-xs text-gray-500">Age {primaryPlayer.age}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs font-bold text-center text-green-600 mb-1">
                    {primaryPlayer.transferroomRating || primaryPlayer.xtvScore || 'N/A'}
                  </div>
                  
                  {positionPlayers.length > 1 && (
                    <div className="text-xs text-center text-blue-600 font-medium">
                      +{positionPlayers.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-2 min-w-28 border border-dashed border-gray-300">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                      <Plus className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-500 text-center">No Player</div>
                  </div>
                </div>
              )}

              {/* Position label */}
              <div className="mt-1 text-center">
                <Badge 
                  variant={isSelected ? "default" : "secondary"} 
                  className={`text-xs px-1 py-0 ${
                    isSelected ? 'bg-yellow-500' : 'bg-white/80'
                  }`}
                >
                  {position}
                </Badge>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-0">
            {renderPlayerTooltipContent(positionPlayers)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className="p-6 bg-green-50">
      <div className="relative w-full h-[700px] bg-green-600 rounded-lg overflow-hidden">
        {/* Pitch markings */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>
          <div className="absolute top-0 left-1/3 right-1/3 h-8 border-2 border-white border-t-0"></div>
          <div className="absolute bottom-0 left-1/3 right-1/3 h-8 border-2 border-white border-b-0"></div>
          <div className="absolute top-0 left-1/4 right-1/4 h-16 border-2 border-white border-t-0"></div>
          <div className="absolute bottom-0 left-1/4 right-1/4 h-16 border-2 border-white border-b-0"></div>
        </div>

        {/* Players positioned around the pitch */}
        {Object.entries(FORMATION_POSITIONS).map(([position, coords]) => 
          renderPositionCard(position, coords)
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Formation: 4-3-3 • {players.length} players in squad • 
          Hover over positions to see all available players
        </p>
      </div>
    </Card>
  );
};

export default EnhancedFootballPitch;
