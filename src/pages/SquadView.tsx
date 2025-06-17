
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, Star, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayersData } from "@/hooks/usePlayersData";
import FootballPitch from "@/components/FootballPitch";
import TeamSelector from "@/components/TeamSelector";
import SquadRecommendations from "@/components/SquadRecommendations";
import ProspectComparison from "@/components/ProspectComparison";

const SquadView = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: allPlayers = [], isLoading } = usePlayersData();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Redirect if not recruitment role
  if (profile?.role !== 'recruitment') {
    navigate('/');
    return null;
  }

  // Filter players based on selected team
  const players = useMemo(() => {
    if (!selectedTeam) {
      return allPlayers.slice(0, 25); // Show first 25 players as example squad
    }
    return allPlayers.filter(player => player.club === selectedTeam);
  }, [allPlayers, selectedTeam]);

  // Calculate squad metrics
  const squadMetrics = useMemo(() => {
    const totalValue = players.length * 15.5; // Mock xTV calculation
    const avgAge = players.length > 0 
      ? players.reduce((sum, p) => sum + p.age, 0) / players.length 
      : 0;
    const contractsExpiring = players.filter(p => 
      p.contractExpiry && new Date(p.contractExpiry) < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalValue, avgAge, contractsExpiring };
  }, [players]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading squad data...</div>
      </div>
    );
  }

  const displayTitle = selectedTeam ? `${selectedTeam} Squad Analysis` : "Squad Analysis";

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{displayTitle}</h1>
            <p className="text-muted-foreground mt-2">
              Advanced squad analysis with recommendations and prospect insights
            </p>
          </div>
        </div>
        <TeamSelector 
          onTeamSelect={setSelectedTeam}
          selectedTeam={selectedTeam}
        />
      </div>

      {/* Squad Value Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            Squad Value Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">£{squadMetrics.totalValue.toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground">Total xTV</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{players.length}</div>
              <div className="text-sm text-muted-foreground">Squad Size</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{squadMetrics.avgAge.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Average Age</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{squadMetrics.contractsExpiring}</div>
              <div className="text-sm text-muted-foreground">Contracts Expiring</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Football Pitch Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Squad Formation & Positioning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FootballPitch 
            players={players} 
            onPositionClick={setSelectedPosition}
            selectedPosition={selectedPosition}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Squad Recommendations */}
        <SquadRecommendations 
          players={players}
          selectedPosition={selectedPosition}
          onPositionSelect={setSelectedPosition}
        />

        {/* Prospect Comparison */}
        {selectedPosition && (
          <ProspectComparison 
            position={selectedPosition}
            currentPlayers={players.filter(p => 
              p.positions.some(pos => pos.toLowerCase().includes(selectedPosition.toLowerCase()))
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SquadView;
