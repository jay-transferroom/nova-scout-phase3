
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Trophy } from "lucide-react";
import { Player } from "@/types/player";

interface SquadSelectorProps {
  selectedSquad: string;
  onSquadSelect: (squad: string) => void;
  club?: string;
  players: Player[];
}

const SQUAD_TYPES = [
  { id: 'first-xi', label: 'First XI', icon: Trophy, color: 'bg-yellow-600' },
  { id: 'shadow-squad', label: 'Shadow Squad', icon: Shield, color: 'bg-gray-600' },
];

const SquadSelector = ({ selectedSquad, onSquadSelect, club, players }: SquadSelectorProps) => {
  const getSquadPlayerCount = (squadType: string) => {
    // Sort players by rating to get the best ones first
    const sortedPlayers = [...players].sort((a, b) => {
      const ratingA = a.transferroomRating || a.xtvScore || 0;
      const ratingB = b.transferroomRating || b.xtvScore || 0;
      return ratingB - ratingA;
    });

    switch (squadType) {
      case 'first-xi':
        return Math.min(sortedPlayers.length, 11);
      case 'shadow-squad':
        return Math.min(Math.max(0, sortedPlayers.length - 11), 17);
      default:
        return 0;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Squad Selection {club && `- ${club}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {SQUAD_TYPES.map((squad) => {
            const Icon = squad.icon;
            const isSelected = selectedSquad === squad.id;
            const playerCount = getSquadPlayerCount(squad.id);
            
            return (
              <Button
                key={squad.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSquadSelect(squad.id)}
                className={`flex items-center gap-2 ${
                  isSelected 
                    ? `${squad.color} text-white hover:${squad.color}/90` 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {squad.label}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 text-xs ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-100'
                  }`}
                >
                  {playerCount}
                </Badge>
              </Button>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {selectedSquad === 'shadow-squad' 
            ? 'Reserve players and squad depth (up to 17 players)'
            : selectedSquad === 'first-xi'
            ? 'Starting eleven - best rated players (11 players)'
            : 'Select squad to analyze formation and player assignments'
          }
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          Total squad size: {players.length} players
        </div>
      </CardContent>
    </Card>
  );
};

export default SquadSelector;
