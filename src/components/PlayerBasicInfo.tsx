
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Full Name</p>
          <p className="font-medium">{player.name}</p>
        </div>
        
        <Separator />
        
        <div>
          <p className="text-sm text-gray-600">Date of Birth</p>
          <p className="font-medium">{formatDateLocal(player.dateOfBirth)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Age</p>
          <p className="font-medium">{calculateAge(player.dateOfBirth)} years old</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Nationality</p>
          <p className="font-medium">{player.nationality}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Region</p>
          <p className="font-medium">{player.region}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Dominant Foot</p>
          <p className="font-medium">{player.dominantFoot}</p>
        </div>
      </CardContent>
    </Card>
  );
};
