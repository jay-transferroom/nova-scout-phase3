
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Player } from "@/types/player";
import EnhancedFootballPitch from "@/components/EnhancedFootballPitch";

interface SquadFormationCardProps {
  squadPlayers: Player[];
  selectedSquad: string;
  onPositionClick: (position: string) => void;
  selectedPosition: string | null;
}

const SquadFormationCard = ({ 
  squadPlayers, 
  selectedSquad, 
  onPositionClick, 
  selectedPosition 
}: SquadFormationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Squad Formation & Depth Analysis
          {selectedSquad === 'shadow-squad' && (
            <Badge variant="secondary" className="ml-2">
              Full Depth View
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedFootballPitch 
          players={squadPlayers} 
          squadType={selectedSquad}
          onPositionClick={onPositionClick}
          selectedPosition={selectedPosition}
        />
      </CardContent>
    </Card>
  );
};

export default SquadFormationCard;
