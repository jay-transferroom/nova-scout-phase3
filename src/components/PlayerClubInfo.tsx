
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Player } from "@/types/player";

interface PlayerClubInfoProps {
  player: Player;
  getContractStatusColor: (status: string) => string;
  getPositionColor: (position: string) => string;
  formatDateLocal: (dateString: string) => string;
}

export const PlayerClubInfo = ({ player, getContractStatusColor, getPositionColor, formatDateLocal }: PlayerClubInfoProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Club & Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p className="text-xs text-gray-600">Current Club</p>
          <p className="font-medium">{player.club}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-600">Contract Status</p>
          <Badge className={`text-xs ${getContractStatusColor(player.contractStatus)}`}>
            {player.contractStatus}
          </Badge>
        </div>
        
        {player.contractExpiry && (
          <div>
            <p className="text-xs text-gray-600">Contract Expires</p>
            <p className="text-xs font-medium">{formatDateLocal(player.contractExpiry)}</p>
          </div>
        )}
        
        <div>
          <p className="text-xs text-gray-600">Positions</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {player.positions.map((position) => (
              <span
                key={position}
                className={`inline-flex items-center justify-center text-xs font-bold rounded px-2 py-1 text-white ${getPositionColor(position)}`}
              >
                {position}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
