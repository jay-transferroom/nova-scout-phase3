
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Club & Contract</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-600 mb-1">Current Club</p>
            <p className="font-medium">{player.club}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Contract Status</p>
            <Badge className={`text-xs ${getContractStatusColor(player.contractStatus)}`}>
              {player.contractStatus}
            </Badge>
          </div>
        </div>
        
        {player.contractExpiry && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Contract Expires</p>
            <p className="text-xs font-medium">{formatDateLocal(player.contractExpiry)}</p>
          </div>
        )}
        
        <div>
          <p className="text-xs text-gray-600 mb-2">Positions</p>
          <div className="flex flex-wrap gap-1">
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
