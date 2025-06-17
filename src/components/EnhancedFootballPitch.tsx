
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Player } from "@/types/player";
import { MoreHorizontal, Plus, AlertTriangle, Clock } from "lucide-react";

interface EnhancedFootballPitchProps {
  players: Player[];
  squadType: string;
  onPositionClick?: (position: string) => void;
  selectedPosition?: string | null;
}

const FORMATION_POSITIONS = {
  GK: { x: 50, y: 5, label: 'Goalkeeper' },
  LB: { x: 20, y: 25, label: 'Full Back' },
  CB1: { x: 40, y: 25, label: 'Centre Back' },
  CB2: { x: 60, y: 25, label: 'Centre Back' },
  RB: { x: 80, y: 25, label: 'Full Back' },
  CDM: { x: 50, y: 45, label: 'Central Midfield' },
  CM1: { x: 35, y: 55, label: 'Central Midfield' },
  CM2: { x: 65, y: 55, label: 'Central Midfield' },
  LW: { x: 25, y: 75, label: 'Winger' },
  ST: { x: 50, y: 85, label: 'Striker' },
  RW: { x: 75, y: 75, label: 'Winger' },
};

const EnhancedFootballPitch = ({ players, squadType, onPositionClick, selectedPosition }: EnhancedFootballPitchProps) => {
  const getPlayersForPosition = (position: string) => {
    const positionPlayers = players.filter(player => 
      player.positions.some(pos => {
        switch (position) {
          case 'GK': return pos === 'GK';
          case 'LB': return pos === 'LB' || pos === 'LWB';
          case 'CB1': case 'CB2': return pos === 'CB';
          case 'RB': return pos === 'RB' || pos === 'RWB';
          case 'CDM': return pos === 'CDM';
          case 'CM1': case 'CM2': return pos === 'CM' || pos === 'CAM';
          case 'LW': return pos === 'LW';
          case 'ST': return pos === 'ST' || pos === 'CF';
          case 'RW': return pos === 'RW';
          default: return false;
        }
      })
    );

    return positionPlayers.slice(0, 2);
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

  const renderPlayerCard = (player: Player, index: number, x: number, y: number) => {
    const contractRisk = getContractRiskLevel(player);
    const isInjured = Math.random() < 0.1; // Mock injury status
    const mockValue = Math.floor(Math.random() * 80) + 5; // Mock transfer value
    const mockHeight = Math.floor(Math.random() * 20) + 170; // Mock height

    // Position the card based on formation position and index
    const cardX = index === 0 ? x - 8 : x + 8;
    const cardY = y;

    return (
      <div
        key={player.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          left: `${Math.max(12, Math.min(88, cardX))}%`,
          top: `${Math.max(8, Math.min(92, cardY))}%`,
        }}
      >
        <div className="bg-white rounded-lg shadow-lg p-3 min-w-36 border hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={player.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&crop=face&fit=crop`} 
                alt={player.name}
              />
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{player.name}</div>
              <div className="text-xs text-gray-500">Age {player.age} • {mockHeight}cm</div>
            </div>
          </div>
          
          <div className="text-sm font-bold text-center mb-2 text-green-600">€{mockValue}M</div>
          
          {/* Risk indicators */}
          <div className="flex gap-1 justify-center">
            {contractRisk === 'high' && (
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <Clock className="h-2 w-2 text-white" />
              </div>
            )}
            {contractRisk === 'medium' && (
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <Clock className="h-2 w-2 text-white" />
              </div>
            )}
            {isInjured && (
              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-2 w-2 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 bg-green-50">
      <div className="relative w-full h-[600px] bg-green-600 rounded-lg overflow-hidden">
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
        {Object.entries(FORMATION_POSITIONS).map(([position, coords]) => {
          const positionPlayers = getPlayersForPosition(position);
          const isSelected = selectedPosition === coords.label;
          
          return (
            <div key={position}>
              {/* Player cards */}
              {positionPlayers.map((player, index) => 
                renderPlayerCard(player, index, coords.x, coords.y)
              )}
              
              {/* Position labels and empty slots */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-0"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y + 15}%`,
                }}
              >
                <Badge 
                  variant={isSelected ? "default" : "secondary"} 
                  className={`text-xs px-2 py-1 cursor-pointer ${
                    isSelected ? 'bg-yellow-500' : 'bg-white/80'
                  }`}
                  onClick={() => handlePositionClick(position, coords.label)}
                >
                  {coords.label}
                </Badge>
                
                <div className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded mt-1 text-center">
                  {positionPlayers.length}/2 players
                </div>

                {positionPlayers.length === 0 && (
                  <div className="flex items-center gap-1 mt-1 justify-center">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-medium bg-white px-1 rounded">No Players</span>
                  </div>
                )}

                {positionPlayers.length === 1 && (
                  <div className="flex items-center gap-1 mt-1 justify-center">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span className="text-xs text-amber-600 font-medium bg-white px-1 rounded">Low Depth</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Formation: 4-3-3 • {players.length} players in squad • 
          Click positions to analyze depth and risks
        </p>
      </div>
    </Card>
  );
};

export default EnhancedFootballPitch;
