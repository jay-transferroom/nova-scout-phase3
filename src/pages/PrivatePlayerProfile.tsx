
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, UserPlus, MessageSquare, Bookmark } from "lucide-react";
import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import { useToast } from "@/hooks/use-toast";
import { PlayerNotes } from "@/components/PlayerNotes";
import TrackPlayerButton from "@/components/TrackPlayerButton";
import AddToShortlistButton from "@/components/AddToShortlistButton";

const PrivatePlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { privatePlayers, loading } = usePrivatePlayers();
  const { toast } = useToast();
  const [showNotes, setShowNotes] = useState(false);

  const player = privatePlayers.find(p => p.id === id);

  // Mock function to get shortlists for private players
  const getPrivatePlayerShortlists = (playerId: string) => {
    // Mock data - Herbie Hughes is on striker targets
    const mockShortlists = {
      [id]: ["Striker Targets", "Loan Prospects"]
    };
    return mockShortlists[playerId] || [];
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">Loading player...</div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Player Not Found</h1>
            <p className="text-muted-foreground">The private player you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const playerShortlists = getPrivatePlayerShortlists(player.id);

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{player.name}</h1>
            <Badge variant="secondary">Private Player</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {player.club && `${player.club} • `}
            {player.age && `${player.age} years old • `}
            {player.nationality}
          </p>
          
          {/* Shortlist information */}
          {playerShortlists.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bookmark className="h-3 w-3" />
                <span>On shortlists:</span>
              </div>
              {playerShortlists.map((shortlist) => (
                <Badge key={shortlist} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {shortlist}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline"
            onClick={() => setShowNotes(true)}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Notes
          </Button>
          <TrackPlayerButton 
            playerId={`private-${player.id}`}
            playerName={player.name}
          />
          <AddToShortlistButton 
            playerId={player.id}
            playerName={player.name}
            isPrivatePlayer={true}
          />
          <Button 
            onClick={() => navigate('/report-builder', { 
              state: { selectedPrivatePlayer: player } 
            })}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{player.name}</p>
              </div>
              {player.club && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Club</p>
                  <p className="font-medium">{player.club}</p>
                </div>
              )}
              {player.age && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Age</p>
                  <p className="font-medium">{player.age} years</p>
                </div>
              )}
              {player.nationality && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                  <p className="font-medium">{player.nationality}</p>
                </div>
              )}
              {player.dominant_foot && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dominant Foot</p>
                  <p className="font-medium">{player.dominant_foot}</p>
                </div>
              )}
              {player.region && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Region</p>
                  <p className="font-medium">{player.region}</p>
                </div>
              )}
            </div>
            
            {player.positions && player.positions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Positions</p>
                <div className="flex flex-wrap gap-1">
                  {player.positions.map((position, index) => (
                    <Badge key={index} variant="outline">
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {player.source_context && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Source/Context</p>
                <p className="text-sm">{player.source_context}</p>
              </div>
            )}
            {player.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{player.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Added</p>
              <p className="text-sm">{new Date(player.created_at).toLocaleDateString()}</p>
            </div>
            {player.updated_at !== player.created_at && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{new Date(player.updated_at).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PlayerNotes
        playerId={`private-${player.id}`}
        playerName={player.name}
        open={showNotes}
        onOpenChange={setShowNotes}
      />
    </div>
  );
};

export default PrivatePlayerProfile;
