
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
  { id: 'u23', label: 'Under 23s', icon: Users, color: 'bg-blue-600' },
  { id: 'u21', label: 'Under 21s', icon: Users, color: 'bg-green-600' },
  { id: 'u18', label: 'Under 18s', icon: Users, color: 'bg-purple-600' },
];

const SquadSelector = ({ selectedSquad, onSquadSelect, club, players }: SquadSelectorProps) => {
  const getSquadPlayerCount = (squadType: string) => {
    const firstTeamIds = players
      .filter(p => !p.id.includes('23_') && !p.id.includes('21_') && !p.id.includes('18_'))
      .slice(0, 25)
      .map(p => p.id);

    const shadowSquadIds = firstTeamIds.slice(0, 11);

    const u23Players = players.filter(p => 
      p.age <= 23 && !firstTeamIds.includes(p.id)
    ).slice(0, 20);

    const u21Players = players.filter(p => 
      p.age <= 21 && 
      !firstTeamIds.includes(p.id) && 
      !u23Players.find(u23 => u23.id === p.id)
    ).slice(0, 20);

    const u18Players = players.filter(p => 
      p.age <= 18 && 
      !firstTeamIds.includes(p.id) && 
      !u23Players.find(u23 => u23.id === p.id) &&
      !u21Players.find(u21 => u21.id === p.id)
    ).slice(0, 20);

    switch (squadType) {
      case 'first-xi':
        return Math.min(players.filter(p => firstTeamIds.includes(p.id)).length, 25);
      case 'shadow-squad':
        return Math.min(players.filter(p => shadowSquadIds.includes(p.id)).length, 11);
      case 'u23':
        return u23Players.length;
      case 'u21':
        return u21Players.length;
      case 'u18':
        return u18Players.length;
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
            ? 'View core starting XI players with tactical depth'
            : 'Select squad to analyze formation and player assignments'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default SquadSelector;
