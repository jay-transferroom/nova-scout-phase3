
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

    // Always show 2 slots per position for proper depth visualization
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

  const getPositionRiskFactors = (positionPlayers: Player[]) => {
    const risks = [];
    
    // Depth risk
    if (positionPlayers.length === 0) {
      risks.push({ type: 'critical', message: 'No players available' });
    } else if (positionPlayers.length === 1) {
      risks.push({ type: 'high', message: 'Limited depth - only 1 player' });
    }
    
    // Contract risks
    const contractRisks = positionPlayers.filter(p => {
      const risk = getContractRiskLevel(p);
      return risk === 'high' || risk === 'medium';
    });
    
    if (contractRisks.length > 0) {
      risks.push({ 
        type: 'medium', 
        message: `${contractRisks.length} contract${contractRisks.length > 1 ? 's' : ''} expiring soon` 
      });
    }
    
    // Age risk (for this example, players over 32)
    const agingPlayers = positionPlayers.filter(p => p.age > 32);
    if (agingPlayers.length > 0) {
      risks.push({ 
        type: 'low', 
        message: `${agingPlayers.length} aging player${agingPlayers.length > 1 ? 's' : ''}` 
      });
    }
    
    return risks;
  };

  const renderPlayerSlot = (player: Player | null, index: number, positionPlayers: Player[]) => {
    if (!player) {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center mb-1 shadow-md">
          <Plus className="h-4 w-4 text-gray-500" />
        </div>
      );
    }

    const contractRisk = getContractRiskLevel(player);
    const isInjured = Math.random() < 0.1; // Mock injury status for demo

    return (
      <div className="relative mb-1">
        <Avatar className="w-12 h-12 border-2 border-white shadow-md">
          <AvatarImage src={player.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&crop=face&fit=crop`} />
          <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
            {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        {/* Risk indicators */}
        <div className="absolute -top-1 -right-1 flex flex-col gap-1">
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
        
        {/* Player name badge */}
        <Badge variant="secondary" className="text-xs mt-1 px-1 py-0 max-w-20 truncate">
          {player.name.split(' ')[0]}
        </Badge>
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
          const riskFactors = getPositionRiskFactors(positionPlayers);
          const hasHighRisk = riskFactors.some(r => r.type === 'critical' || r.type === 'high');
          
          return (
            <div
              key={position}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-105 ${
                isSelected ? 'scale-105 z-10' : ''
              }`}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
              onClick={() => handlePositionClick(position, coords.label)}
            >
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                  {/* First choice player */}
                  {renderPlayerSlot(positionPlayers[0] || null, 0, positionPlayers)}
                  
                  {/* Second choice player */}
                  {renderPlayerSlot(positionPlayers[1] || null, 1, positionPlayers)}
                </div>
                
                <Badge 
                  variant={isSelected ? "default" : "secondary"} 
                  className={`text-xs mt-1 px-1 py-0 ${
                    isSelected ? 'bg-yellow-500' : hasHighRisk ? 'bg-red-100 border-red-300' : ''
                  }`}
                >
                  {coords.label}
                </Badge>
                
                {/* Risk indicator */}
                {hasHighRisk && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Risk</span>
                  </div>
                )}
                
                {/* Depth indicator */}
                <div className="text-xs text-white bg-black bg-opacity-50 px-1 rounded mt-1">
                  {positionPlayers.length}/2
                </div>
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
