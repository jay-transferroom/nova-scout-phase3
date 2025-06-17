
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/player";

interface FootballPitchProps {
  players: Player[];
  onPositionClick?: (position: string) => void;
  selectedPosition?: string | null;
}

// Formation layout for 4-3-3
const FORMATION_POSITIONS = {
  GK: { x: 50, y: 5, label: 'Goalkeeper' },
  // Defense
  LB: { x: 20, y: 25, label: 'Full Back' },
  CB1: { x: 40, y: 25, label: 'Centre Back' },
  CB2: { x: 60, y: 25, label: 'Centre Back' },
  RB: { x: 80, y: 25, label: 'Full Back' },
  // Midfield
  CDM: { x: 50, y: 45, label: 'Central Midfield' },
  CM1: { x: 35, y: 55, label: 'Central Midfield' },
  CM2: { x: 65, y: 55, label: 'Central Midfield' },
  // Attack
  LW: { x: 25, y: 75, label: 'Winger' },
  ST: { x: 50, y: 85, label: 'Striker' },
  RW: { x: 75, y: 75, label: 'Winger' },
};

const FootballPitch = ({ players, onPositionClick, selectedPosition }: FootballPitchProps) => {
  // Simple position mapping - in a real app you'd want more sophisticated logic
  const getPlayersForPosition = (position: string) => {
    return players.filter(player => 
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
    ).slice(0, 1); // Take first player for each position
  };

  const handlePositionClick = (position: string, label: string) => {
    if (onPositionClick) {
      onPositionClick(label);
    }
  };

  return (
    <Card className="p-6 bg-green-50">
      <div className="relative w-full h-96 bg-green-600 rounded-lg overflow-hidden">
        {/* Pitch markings */}
        <div className="absolute inset-0">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
          
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>
          
          {/* Goal areas */}
          <div className="absolute top-0 left-1/3 right-1/3 h-8 border-2 border-white border-t-0"></div>
          <div className="absolute bottom-0 left-1/3 right-1/3 h-8 border-2 border-white border-b-0"></div>
          
          {/* Penalty areas */}
          <div className="absolute top-0 left-1/4 right-1/4 h-16 border-2 border-white border-t-0"></div>
          <div className="absolute bottom-0 left-1/4 right-1/4 h-16 border-2 border-white border-b-0"></div>
        </div>

        {/* Players */}
        {Object.entries(FORMATION_POSITIONS).map(([position, coords]) => {
          const positionPlayers = getPlayersForPosition(position);
          const player = positionPlayers[0];
          const isSelected = selectedPosition === coords.label;
          
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
              {player ? (
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg transition-colors ${
                    isSelected ? 'bg-yellow-500' : 'bg-blue-600'
                  }`}>
                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1 px-1 py-0">
                    {player.name.split(' ').pop()}
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs border-2 border-white transition-colors ${
                    isSelected ? 'bg-yellow-400 opacity-75' : 'bg-gray-400 opacity-50'
                  }`}>
                    ?
                  </div>
                  <Badge variant="outline" className={`text-xs mt-1 px-1 py-0 ${
                    isSelected ? 'border-yellow-500' : 'opacity-50'
                  }`}>
                    {position}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Formation: 4-3-3 • {players.length} players available • Click positions for analysis
        </p>
      </div>
    </Card>
  );
};

export default FootballPitch;
