import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { MoreHorizontal, Plus } from "lucide-react";

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

    // For shadow squad, show multiple players; for others, show primary player
    return squadType === 'shadow-squad' ? positionPlayers.slice(0, 4) : positionPlayers.slice(0, 1);
  };

  const handlePositionClick = (position: string, label: string) => {
    if (onPositionClick) {
      onPositionClick(label);
    }
  };

  const renderPlayerSlot = (player: Player | null, index: number, totalPlayers: number) => {
    if (!player) {
      return (
        <div className={`w-6 h-6 rounded-full bg-gray-400 opacity-50 border border-white flex items-center justify-center ${
          totalPlayers > 1 ? 'mb-1' : ''
        }`}>
          <Plus className="h-3 w-3 text-white" />
        </div>
      );
    }

    return (
      <div className={`w-6 h-6 rounded-full bg-blue-600 border border-white text-white text-xs font-bold flex items-center justify-center ${
        totalPlayers > 1 ? 'mb-1' : ''
      }`}>
        {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-green-50">
      <div className="relative w-full h-96 bg-green-600 rounded-lg overflow-hidden">
        {/* Pitch markings - keep existing code */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>
          <div className="absolute top-0 left-1/3 right-1/3 h-8 border-2 border-white border-t-0"></div>
          <div className="absolute bottom-0 left-1/3 right-1/3 h-8 border-2 border-white border-b-0"></div>
          <div className="absolute top-0 left-1/4 right-1/4 h-16 border-2 border-white border-t-0"></div>
          <div className="absolute bottom-0 left-1/4 right-1/4 h-16 border-2 border-white border-b-0"></div>
        </div>

        {/* Players */}
        {Object.entries(FORMATION_POSITIONS).map(([position, coords]) => {
          const positionPlayers = getPlayersForPosition(position);
          const isSelected = selectedPosition === coords.label;
          const maxSlots = squadType === 'shadow-squad' ? 4 : 1;
          
          return (
            <div
              key={position}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                isSelected ? 'scale-110 z-10' : ''
              }`}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
              onClick={() => handlePositionClick(position, coords.label)}
            >
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                  {Array.from({ length: maxSlots }).map((_, index) => {
                    const player = positionPlayers[index] || null;
                    return (
                      <div key={index}>
                        {renderPlayerSlot(player, index, maxSlots)}
                      </div>
                    );
                  })}
                  
                  {squadType === 'shadow-squad' && positionPlayers.length > maxSlots && (
                    <Button 
                      size="sm"
                      variant="secondary"
                      className="h-4 px-2 text-xs mt-1"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <Badge 
                  variant={isSelected ? "default" : "secondary"} 
                  className={`text-xs mt-1 px-1 py-0 ${
                    isSelected ? 'bg-yellow-500' : ''
                  }`}
                >
                  {coords.label}
                </Badge>
                
                {squadType === 'shadow-squad' && (
                  <div className="text-xs text-white bg-black bg-opacity-50 px-1 rounded mt-1">
                    {positionPlayers.length}/{maxSlots}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Formation: 4-3-3 • {players.length} players available • 
          {squadType === 'shadow-squad' 
            ? ' Shadow squad view with depth analysis'
            : ` ${squadType.toUpperCase()} formation`
          }
        </p>
      </div>
    </Card>
  );
};

export default EnhancedFootballPitch;
