
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Users, Eye } from "lucide-react";
import { useTrackedPlayers } from "@/hooks/usePlayerTracking";
import { useNavigate } from "react-router-dom";
import { usePlayersData } from "@/hooks/usePlayersData";
import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";

export const TrackedPlayersSection = () => {
  const { data: trackedPlayers = [], isLoading } = useTrackedPlayers();
  const { data: allPlayers = [] } = usePlayersData();
  const { privatePlayers } = usePrivatePlayers();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Players You're Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading tracked players...</p>
        </CardContent>
      </Card>
    );
  }

  if (trackedPlayers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Players You're Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You're not tracking any players yet</p>
            <Button variant="outline" onClick={() => navigate("/search")}>
              Find Players to Track
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPlayerDetails = (playerId: string) => {
    // Check if it's a private player
    if (playerId.startsWith('private-')) {
      const privatePlayerId = playerId.replace('private-', '');
      const privatePlayer = privatePlayers.find(p => p.id === privatePlayerId);
      if (privatePlayer) {
        return {
          id: playerId,
          name: privatePlayer.name,
          club: privatePlayer.club || 'Unknown Club',
          positions: privatePlayer.positions || [],
          isPrivate: true,
          profilePath: `/private-player/${privatePlayerId}`
        };
      }
    }
    
    // Check public players
    const publicPlayer = allPlayers.find(p => p.id === playerId);
    if (publicPlayer) {
      return {
        id: playerId,
        name: publicPlayer.name,
        club: publicPlayer.club,
        positions: publicPlayer.positions,
        isPrivate: false,
        profilePath: `/player/${playerId}`
      };
    }
    
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Players You're Tracking ({trackedPlayers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trackedPlayers.slice(0, 5).map((tracking) => {
            const playerDetails = getPlayerDetails(tracking.player_id);
            
            if (!playerDetails) {
              return (
                <div key={tracking.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Unknown Player</p>
                    <p className="text-sm text-muted-foreground">Player data not found</p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={tracking.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(playerDetails.profilePath)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{playerDetails.name}</p>
                    {playerDetails.isPrivate && (
                      <Badge variant="secondary" className="text-xs">Private</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{playerDetails.club}</p>
                  <div className="flex gap-1 mt-1">
                    {playerDetails.positions.slice(0, 3).map((position, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {position}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          
          {trackedPlayers.length > 5 && (
            <Button variant="outline" className="w-full" onClick={() => navigate("/search")}>
              View All Tracked Players ({trackedPlayers.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
