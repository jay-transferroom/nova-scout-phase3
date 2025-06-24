
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Player } from "@/types/player";

interface SquadListViewProps {
  players: Player[];
}

const SquadListView = ({ players }: SquadListViewProps) => {
  // Group players by position
  const positionGroups = {
    'Goalkeepers': players.filter(p => p.positions.includes('GK')),
    'Defenders': players.filter(p => 
      p.positions.some(pos => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos))
    ),
    'Midfielders': players.filter(p => 
      p.positions.some(pos => ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos))
    ),
    'Wingers': players.filter(p => 
      p.positions.some(pos => ['LW', 'RW'].includes(pos))
    ),
    'Forwards': players.filter(p => 
      p.positions.some(pos => ['ST', 'CF'].includes(pos))
    )
  };

  const getPositionColor = (position: string) => {
    if (position.includes('GK')) return 'bg-yellow-100 text-yellow-800';
    if (['CB', 'LB', 'RB', 'LWB', 'RWB'].some(pos => position.includes(pos))) return 'bg-blue-100 text-blue-800';
    if (['CDM', 'CM', 'CAM', 'LM', 'RM'].some(pos => position.includes(pos))) return 'bg-green-100 text-green-800';
    if (['LW', 'RW'].some(pos => position.includes(pos))) return 'bg-purple-100 text-purple-800';
    if (['ST', 'CF'].some(pos => position.includes(pos))) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const PlayerCard = ({ player }: { player: Player }) => (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-blue-100 text-blue-700">
          {player.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{player.name}</h4>
          <Badge variant="outline" className="text-xs">
            {player.age}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{player.club}</p>
        <div className="flex flex-wrap gap-1">
          {player.positions.map((position, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className={`text-xs ${getPositionColor(position)}`}
            >
              {position}
            </Badge>
          ))}
        </div>
      </div>

      <div className="text-right">
        {player.recentForm?.rating && (
          <>
            <div className="font-bold text-lg text-primary">
              {player.recentForm.rating.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {Object.entries(positionGroups).map(([groupName, groupPlayers]) => {
        if (groupPlayers.length === 0) return null;
        
        return (
          <Card key={groupName}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>{groupName}</span>
                <Badge variant="secondary">{groupPlayers.length} players</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupPlayers.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SquadListView;
