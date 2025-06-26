
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Player } from "@/types/player";

interface PlayerBasicInfoProps {
  player: Player;
  calculateAge: (dateOfBirth: string) => number;
  formatDateLocal: (dateString: string) => string;
}

export const PlayerBasicInfo = ({ player, calculateAge, formatDateLocal }: PlayerBasicInfoProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Award className="h-4 w-4" />
          Basic Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-xs text-gray-600">Date of Birth</p>
          <p className="font-medium">{formatDateLocal(player.dateOfBirth)}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-600">Age</p>
          <p className="font-medium">{calculateAge(player.dateOfBirth)} years</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-600">Nationality</p>
          <p className="font-medium">{player.nationality}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-600">Dominant Foot</p>
          <p className="font-medium">{player.dominantFoot}</p>
        </div>
      </CardContent>
    </Card>
  );
};
