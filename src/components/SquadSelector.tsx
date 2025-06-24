
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
    const firstTeamIds = players
      .filter(p => !p.id.includes('23_') && !p.id.includes('21_') && !p.id.includes('18_'))
      .slice(0, 25)
      .map(p => p.id);

    const shadowSquadIds = firstTeamIds.slice(0, 11);

    switch (squadType) {
      case 'first-xi':
        return Math.min(players.filter(p => firstTeamIds.includes(p.id)).length, 25);
      case 'shadow-squad':
        return Math.min(players.filter(p => shadowSquadIds.includes(p.id)).length, 11);
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
