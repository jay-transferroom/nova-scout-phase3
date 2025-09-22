import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player } from "@/types/player";
import { MoreHorizontal, Plus, AlertTriangle, Clock, ChevronDown } from "lucide-react";

interface EnhancedFootballPitchProps {
  players: Player[];
  squadType: string;
  formation?: string;
  onPositionClick?: (position: string) => void;
  selectedPosition?: string | null;
  onPlayerChange?: (position: string, playerId: string) => void;
}

// Formation configurations
const FORMATION_CONFIGS: Record<string, Record<string, { x: number; y: number; label: string }>> = {
  '4-3-3': {
    GK: { x: 50, y: 8, label: 'Goalkeeper' },
    LB: { x: 85, y: 22, label: 'Full Back' },
    CB1: { x: 35, y: 22, label: 'Centre Back' },
    CB2: { x: 65, y: 22, label: 'Centre Back' },
    RB: { x: 15, y: 22, label: 'Full Back' },
    CDM: { x: 50, y: 40, label: 'Central Midfield' },
    CM1: { x: 30, y: 52, label: 'Central Midfield' },
    CM2: { x: 70, y: 52, label: 'Central Midfield' },
    LW: { x: 80, y: 72, label: 'Winger' },
    ST: { x: 50, y: 82, label: 'Striker' },
    RW: { x: 20, y: 72, label: 'Winger' },
  },
  '4-2-3-1': {
    GK: { x: 50, y: 8, label: 'Goalkeeper' },
    LB: { x: 85, y: 22, label: 'Full Back' },
    CB1: { x: 35, y: 22, label: 'Centre Back' },
    CB2: { x: 65, y: 22, label: 'Centre Back' },
    RB: { x: 15, y: 22, label: 'Full Back' },
    CDM1: { x: 35, y: 40, label: 'Defensive Midfield' },
    CDM2: { x: 65, y: 40, label: 'Defensive Midfield' },
    LW: { x: 80, y: 60, label: 'Winger' },
    CAM: { x: 50, y: 60, label: 'Attacking Midfield' },
    RW: { x: 20, y: 60, label: 'Winger' },
    ST: { x: 50, y: 82, label: 'Striker' },
  },
  '3-5-2': {
    GK: { x: 50, y: 8, label: 'Goalkeeper' },
    CB1: { x: 25, y: 22, label: 'Centre Back' },
    CB2: { x: 50, y: 22, label: 'Centre Back' },
    CB3: { x: 75, y: 22, label: 'Centre Back' },
    LWB: { x: 85, y: 45, label: 'Wing Back' },
    CM1: { x: 35, y: 45, label: 'Central Midfield' },
    CM2: { x: 50, y: 45, label: 'Central Midfield' },
    CM3: { x: 65, y: 45, label: 'Central Midfield' },
    RWB: { x: 15, y: 45, label: 'Wing Back' },
    ST1: { x: 40, y: 82, label: 'Striker' },
    ST2: { x: 60, y: 82, label: 'Striker' },
  },
  '4-4-2': {
    GK: { x: 50, y: 8, label: 'Goalkeeper' },
    LB: { x: 85, y: 22, label: 'Full Back' },
    CB1: { x: 35, y: 22, label: 'Centre Back' },
    CB2: { x: 65, y: 22, label: 'Centre Back' },
    RB: { x: 15, y: 22, label: 'Full Back' },
    LM: { x: 85, y: 52, label: 'Left Midfield' },
    CM1: { x: 35, y: 52, label: 'Central Midfield' },
    CM2: { x: 65, y: 52, label: 'Central Midfield' },
    RM: { x: 15, y: 52, label: 'Right Midfield' },
    ST1: { x: 40, y: 82, label: 'Striker' },
    ST2: { x: 60, y: 82, label: 'Striker' },
  },
};

const EnhancedFootballPitch = ({ players, squadType, formation = '4-3-3', onPositionClick, selectedPosition, onPlayerChange }: EnhancedFootballPitchProps) => {
  // Get current formation positions
  const currentFormation = FORMATION_CONFIGS[formation] || FORMATION_CONFIGS['4-3-3'];
  
  // Track assigned players to prevent duplicates across positions
  const assignedPlayers = new Set<string>();

  // Get all eligible players for a position (not just assigned ones)
  const getAllPlayersForPosition = (position: string) => {
    const getPositionMapping = (pos: string) => {
      switch (pos) {
        case 'GK': 
          return ['GK'];
        case 'LB': 
          return ['LB', 'LWB'];
        case 'CB1': 
        case 'CB2': 
        case 'CB3': 
          return ['CB'];
        case 'RB': 
          return ['RB', 'RWB'];
        case 'CDM': 
        case 'CDM1': 
        case 'CDM2': 
          return ['CM', 'CDM'];
        case 'CM1': 
        case 'CM2': 
        case 'CM3':
          return ['CM', 'CAM'];
        case 'CAM':
          return ['CAM', 'CM'];
        case 'LM': 
          return ['LM', 'W', 'LW'];
        case 'RM': 
          return ['RM', 'W', 'RW'];
        case 'LWB': 
          return ['LWB', 'LB'];
        case 'RWB': 
          return ['RWB', 'RB'];
        case 'LW': 
          return ['W', 'LW', 'LM'];
        case 'ST': 
        case 'ST1': 
        case 'ST2': 
          return ['F', 'FW', 'ST', 'CF'];
        case 'RW': 
          return ['W', 'RW', 'RM'];
        default: 
          return [];
      }
    };

    const allowedPositions = getPositionMapping(position);
    
    // Return all players that can play this position
    return players.filter(player => 
      player.positions.some(pos => allowedPositions.includes(pos))
    ).sort((a, b) => {
      const ratingA = a.transferroomRating || a.xtvScore || 0;
      const ratingB = b.transferroomRating || b.xtvScore || 0;
      return ratingB - ratingA;
    });
  };
    // Map formation positions to player position names
    const getPositionMapping = (pos: string) => {
      switch (pos) {
        case 'GK': 
          return ['GK'];
        case 'LB': 
          return ['LB', 'LWB'];
        case 'CB1': 
        case 'CB2': 
          return ['CB'];
        case 'RB': 
          return ['RB', 'RWB'];
        case 'CDM1': 
        case 'CDM2': 
          return ['CM', 'CDM'];
        case 'CM1': 
        case 'CM2': 
        case 'CM3':
          return ['CM', 'CAM'];
        case 'CAM':
          return ['CAM', 'CM'];
        case 'LM': 
          return ['LM', 'W', 'LW'];
        case 'RM': 
          return ['RM', 'W', 'RW'];
        case 'LWB': 
          return ['LWB', 'LB'];
        case 'RWB': 
          return ['RWB', 'RB'];
        case 'CB3': 
          return ['CB'];
        case 'ST1': 
        case 'ST2': 
          return ['F', 'FW', 'ST', 'CF'];
        case 'LW': 
          return ['W', 'LW', 'LM'];
        case 'ST': 
          return ['F', 'FW', 'ST', 'CF'];
        case 'RW': 
          return ['W', 'RW', 'RM'];
        default: 
          return [];
      }
    };

  const getPlayersForPosition = (position: string) => {
    const getPositionMapping = (pos: string) => {
      switch (pos) {
        case 'GK': 
          return ['GK'];
        case 'LB': 
          return ['LB', 'LWB'];
        case 'CB1': 
        case 'CB2': 
        case 'CB3': 
          return ['CB'];
        case 'RB': 
          return ['RB', 'RWB'];
        case 'CDM': 
        case 'CDM1': 
        case 'CDM2': 
          return ['CM', 'CDM'];
        case 'CM1': 
        case 'CM2': 
        case 'CM3':
          return ['CM', 'CAM'];
        case 'CAM':
          return ['CAM', 'CM'];
        case 'LM': 
          return ['LM', 'W', 'LW'];
        case 'RM': 
          return ['RM', 'W', 'RW'];
        case 'LWB': 
          return ['LWB', 'LB'];
        case 'RWB': 
          return ['RWB', 'RB'];
        case 'LW': 
          return ['W', 'LW', 'LM'];
        case 'ST': 
        case 'ST1': 
        case 'ST2': 
          return ['F', 'FW', 'ST', 'CF'];
        case 'RW': 
          return ['W', 'RW', 'RM'];
        default: 
          return [];
      }
    };

    const allowedPositions = getPositionMapping(position);
    
    // Filter players who have this position in their positions array and aren't already assigned
    const positionPlayers = players.filter(player => 
      player.positions.some(pos => allowedPositions.includes(pos)) && 
      !assignedPlayers.has(player.id)
    );
    
    // Sort by rating
    const sortedPlayers = positionPlayers.sort((a, b) => {
      const ratingA = a.transferroomRating || a.xtvScore || 0;
      const ratingB = b.transferroomRating || b.xtvScore || 0;
      return ratingB - ratingA;
    });
    
    // For first-team squad, only show the leading player per position
    if (squadType === 'first-team') {
      const selectedPlayer = sortedPlayers.slice(0, 1);
      // Mark this player as assigned
      if (selectedPlayer.length > 0) {
        assignedPlayers.add(selectedPlayer[0].id);
      }
      return selectedPlayer;
    }
    
    return sortedPlayers;
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
      <div className="p-2 max-w-sm max-h-96 overflow-y-auto">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-700 mb-2">
            {positionPlayers.length} player{positionPlayers.length > 1 ? 's' : ''} available
          </div>
          {positionPlayers.map((player, index) => {
            const contractRisk = getContractRiskLevel(player);
            const isPrimary = index === 0;
            const yearsLeft = player.contractExpiry ? Math.max(0, Math.floor((new Date(player.contractExpiry).getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000))) : null;

            return (
              <div key={player.id} className={`flex items-center gap-2 text-sm p-2 rounded ${isPrimary ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
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
                  <div className="font-medium truncate flex items-center gap-1">
                    {player.name}
                    {isPrimary && <Badge variant="default" className="text-xs px-1 py-0">1st</Badge>}
                  </div>
                  <div className="text-xs text-gray-500">
                    Age {player.age} • Rating: {player.transferroomRating || player.xtvScore || 'N/A'}
                    {yearsLeft !== null && ` • +${yearsLeft}`}
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
    const allEligiblePlayers = getAllPlayersForPosition(position);
    const isSelected = selectedPosition === coords.label;
    const currentPlayer = positionPlayers[0]; // The assigned player
    
    return (
      <div
        key={position}
        className={`absolute transform -translate-x-1/2 cursor-pointer transition-all z-10 ${
          isSelected ? 'scale-105' : 'hover:scale-102'
        }`}
        style={{
          left: `${coords.x}%`,
          top: `${coords.y}%`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        {/* Position label */}
        <div className="mb-3 text-center">
          <Badge 
            variant={isSelected ? "default" : "secondary"} 
            className={`text-sm px-3 py-1 font-semibold ${
              isSelected ? 'bg-yellow-500 text-yellow-900' : 'bg-white/90 text-gray-700'
            }`}
          >
            {position}
          </Badge>
        </div>

        {/* Player Card - Made Bigger */}
        <div className="flex flex-col gap-2 items-center min-w-48">
          {currentPlayer ? (
            <div className="bg-white rounded-xl shadow-lg p-4 w-full border-2 border-blue-300 bg-blue-50 transition-all hover:shadow-xl">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage 
                    src={currentPlayer.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&crop=face&fit=crop`} 
                    alt={currentPlayer.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {currentPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center w-full">
                  <div className="text-sm font-bold truncate mb-1">{currentPlayer.name}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Age {currentPlayer.age} • Rating: {currentPlayer.transferroomRating?.toFixed(1) || currentPlayer.xtvScore || 'N/A'}
                  </div>
                  
                  {/* Player Selection Dropdown */}
                  {onPlayerChange && allEligiblePlayers.length > 1 && (
                    <Select 
                      value={currentPlayer.id} 
                      onValueChange={(playerId) => onPlayerChange(position, playerId)}
                    >
                      <SelectTrigger className="w-full text-xs h-8 bg-white border-gray-300 hover:bg-gray-50">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className="truncate">Change Player</span>
                            <ChevronDown className="h-3 w-3" />
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                        {allEligiblePlayers.map((player) => (
                          <SelectItem 
                            key={player.id} 
                            value={player.id}
                            className="text-sm hover:bg-gray-100 focus:bg-gray-100"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Avatar className="w-6 h-6">
                                <AvatarImage 
                                  src={player.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&crop=face&fit=crop`} 
                                  alt={player.name}
                                />
                                <AvatarFallback className="bg-blue-600 text-white text-xs">
                                  {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">{player.name}</span>
                                <span className="text-xs text-gray-500">
                                  Rating: {player.transferroomRating?.toFixed(1) || player.xtvScore || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                {/* Contract risk indicator */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const contractRisk = getContractRiskLevel(currentPlayer);
                    if (contractRisk === 'high') {
                      return <div className="w-3 h-3 bg-red-500 rounded-full" title="Contract expires soon" />;
                    }
                    if (contractRisk === 'medium') {
                      return <div className="w-3 h-3 bg-amber-500 rounded-full" title="Contract expires within a year" />;
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-4 w-full border border-dashed border-gray-300 transition-all hover:shadow-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-sm text-gray-500 text-center">No Player Assigned</div>
                
                {/* Player Selection Dropdown for Empty Position */}
                {onPlayerChange && allEligiblePlayers.length > 0 && (
                  <Select onValueChange={(playerId) => onPlayerChange(position, playerId)}>
                    <SelectTrigger className="w-full text-xs h-8 bg-white border-gray-300 hover:bg-gray-50">
                      <SelectValue placeholder="Select Player">
                        <div className="flex items-center gap-2">
                          <span className="truncate">Select Player</span>
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                      {allEligiblePlayers.map((player) => (
                        <SelectItem 
                          key={player.id} 
                          value={player.id}
                          className="text-sm hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Avatar className="w-6 h-6">
                              <AvatarImage 
                                src={player.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&crop=face&fit=crop`} 
                                alt={player.name}
                              />
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{player.name}</span>
                              <span className="text-xs text-gray-500">
                                Rating: {player.transferroomRating?.toFixed(1) || player.xtvScore || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 bg-green-50">
      <div className="relative w-full h-[1000px] bg-green-600 rounded-lg overflow-hidden">
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
        {Object.entries(currentFormation).map(([position, coords]) => {
          // Reset assigned players for each render to ensure proper assignment order
          if (position === 'GK') assignedPlayers.clear();
          return renderPositionCard(position, coords);
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Formation: {formation} • {players.length} players in squad • 
          Players stacked by position depth
        </p>
      </div>
    </Card>
  );
};

export default EnhancedFootballPitch;
