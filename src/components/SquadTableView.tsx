import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlayerAvatar } from "@/components/ui/player-avatar";
import { ClubBadge } from "@/components/ui/club-badge";
import { Player } from "@/types/player";

interface SquadTableViewProps {
  players: Player[];
}

const SquadTableView = ({ players }: SquadTableViewProps) => {
  const formatValue = (value: number | undefined) => {
    if (!value) return '-';
    return `£${(value / 1000000).toFixed(1)}M`;
  };

  const formatRating = (rating: number | undefined) => {
    if (!rating) return '-';
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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-sm">Player</TableHead>
              <TableHead className="text-sm">Club</TableHead>
              <TableHead className="text-sm">Age</TableHead>
              <TableHead className="text-sm">Positions</TableHead>
              <TableHead className="text-sm">Rating</TableHead>
              <TableHead className="text-sm">Value</TableHead>
              <TableHead className="text-sm">Contract</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PlayerAvatar 
                      playerName={player.name}
                      avatarUrl={player.image}
                      size="sm"
                    />
                    <span className="font-medium text-grey-900 text-sm">{player.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ClubBadge clubName={player.club} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-grey-600">{player.age}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {player.positions.slice(0, 2).map((position, idx) => (
                      <Badge 
                        key={idx} 
                        variant="neutral" 
                        className="text-sm"
                      >
                        {position}
                      </Badge>
                    ))}
                    {player.positions.length > 2 && (
                      <Badge variant="neutral" className="text-sm opacity-60">
                        +{player.positions.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-grey-700 font-medium">
                    {formatRating(player.transferroomRating)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-grey-700">
                    {formatValue(player.xtvScore)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm text-grey-600">
                      {player.contractExpiry ? 
                        new Date(player.contractExpiry).getFullYear() : 
                        'Unknown'
                      }
                    </div>
                    <Badge 
                      variant={player.contractStatus === 'Under Contract' ? 'success' : 'neutral'}
                      className="text-sm"
                    >
                      {player.contractStatus}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {players.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-grey-500">
                  No players found in this squad.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SquadTableView;