import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types/player";

interface SquadTableViewProps {
  players: Player[];
}

const SquadTableView = ({ players }: SquadTableViewProps) => {
  const getPositionColor = (position: string) => {
    if (position.includes('GK')) return 'bg-yellow-100 text-yellow-800';
    if (['CB', 'LB', 'RB', 'LWB', 'RWB'].some(pos => position.includes(pos))) return 'bg-blue-100 text-blue-800';
    if (['CDM', 'CM', 'CAM', 'LM', 'RM'].some(pos => position.includes(pos))) return 'bg-green-100 text-green-800';
    if (['LW', 'RW'].some(pos => position.includes(pos))) return 'bg-purple-100 text-purple-800';
    if (['ST', 'CF'].some(pos => position.includes(pos))) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatValue = (value: number | undefined) => {
    if (!value) return 'N/A';
    return `£${(value / 1000000).toFixed(1)}M`;
  };

  const formatRating = (rating: number | undefined) => {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Squad Players</span>
          <Badge variant="secondary">{players.length} players</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium">Player</th>
                <th className="text-left py-3 px-2 font-medium">Age</th>
                <th className="text-left py-3 px-2 font-medium">Positions</th>
                <th className="text-left py-3 px-2 font-medium">Rating</th>
                <th className="text-left py-3 px-2 font-medium">Value</th>
                <th className="text-left py-3 px-2 font-medium">Contract</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.club}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm">{player.age}</td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {player.positions.slice(0, 2).map((position, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className={`text-xs ${getPositionColor(position)}`}
                        >
                          {position}
                        </Badge>
                      ))}
                      {player.positions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{player.positions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-sm font-medium">
                      {formatRating(player.transferroomRating)}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {formatValue(player.xtvScore)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-xs">
                      {player.contractExpiry ? 
                        new Date(player.contractExpiry).getFullYear() : 
                        'Unknown'
                      }
                    </div>
                    <Badge 
                      variant={player.contractStatus === 'Under Contract' ? 'default' : 'secondary'}
                      className="text-xs mt-1"
                    >
                      {player.contractStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquadTableView;