
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CardContent className="pt-0 pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Date of Birth</p>
            <p className="font-medium text-xs">{formatDateLocal(player.dateOfBirth)}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Age</p>
            <p className="font-medium text-xs">{calculateAge(player.dateOfBirth)} years</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Nationality</p>
            <p className="font-medium text-xs">{player.nationality}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Dominant Foot</p>
            <p className="font-medium text-xs">{player.dominantFoot}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
