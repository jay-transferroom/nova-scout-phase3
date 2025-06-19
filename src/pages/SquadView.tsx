import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, Star, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockPlayers } from "@/data/mockPlayers";
import EnhancedFootballPitch from "@/components/EnhancedFootballPitch";
import SquadSelector from "@/components/SquadSelector";
import SquadRecommendations from "@/components/SquadRecommendations";
import ProspectComparison from "@/components/ProspectComparison";

const SquadView = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedSquad, setSelectedSquad] = useState<string>('first-xi');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Redirect if not recruitment role
  if (profile?.role !== 'recruitment') {
    navigate('/');
    return null;
  }

  // For now, we'll use a mock club affiliation - in a real app this would come from the user profile
  const userClub = "Manchester United"; // This should come from profile.club or similar

  // Filter players based on user's club affiliation
  const clubPlayers = useMemo(() => {
    return mockPlayers.filter(player => player.club === userClub);
  }, [userClub]);

  // Filter players based on selected squad type with no duplicates
  const squadPlayers = useMemo(() => {
    const firstTeamIds = clubPlayers
      .filter(p => !p.id.includes('23_') && !p.id.includes('21_') && !p.id.includes('18_'))
      .slice(0, 28)
      .map(p => p.id);

    const shadowSquadIds = firstTeamIds.slice(0, 14);

    const u23Players = clubPlayers.filter(p => 
      p.age <= 23 && !firstTeamIds.includes(p.id)
    ).slice(0, 21);

    const u21Players = clubPlayers.filter(p => 
      p.age <= 21 && !firstTeamIds.includes(p.id) && !u23Players.find(u23 => u23.id === p.id)
    ).slice(0, 30);

    const u18Players = clubPlayers.filter(p => 
      p.age <= 18 && 
      !firstTeamIds.includes(p.id) && 
      !u23Players.find(u23 => u23.id === p.id) &&
      !u21Players.find(u21 => u21.id === p.id)
    ).slice(0, 30);

    switch (selectedSquad) {
      case 'first-xi':
        return clubPlayers.filter(p => firstTeamIds.includes(p.id));
      case 'shadow-squad':
        return clubPlayers.filter(p => shadowSquadIds.includes(p.id));
      case 'u23':
        return u23Players;
      case 'u21':
        return u21Players;
      case 'u18':
        return u18Players;
      default:
        return clubPlayers.filter(p => firstTeamIds.includes(p.id));
    }
  }, [clubPlayers, selectedSquad]);

  // Calculate squad metrics with realistic values based on squad type
  const squadMetrics = useMemo(() => {
    if (squadPlayers.length === 0) {
      return { totalValue: 0, avgAge: 0, contractsExpiring: 0 };
    }

    // Different base values for different squad types
    let baseValueMultiplier = 1;
    switch (selectedSquad) {
      case 'first-xi':
        baseValueMultiplier = 2.5; // Most valuable
        break;
      case 'shadow-squad':
        baseValueMultiplier = 2.0; // High value subset
        break;
      case 'u23':
        baseValueMultiplier = 0.8; // Developing players
        break;
      case 'u21':
        baseValueMultiplier = 0.4; // Youth prospects
        break;
      case 'u18':
        baseValueMultiplier = 0.2; // Academy players
        break;
    }

    // Calculate total value based on player ages and positions
    const totalValue = squadPlayers.reduce((sum, player) => {
      let baseValue = 15 * baseValueMultiplier; // Base value in millions
      
      // Adjust value based on age
      if (player.age < 20) baseValue *= 1.5; // Young prospects
      else if (player.age < 25) baseValue *= 1.8; // Prime development age
      else if (player.age < 30) baseValue *= 1.2; // Peak years
      else baseValue *= 0.7; // Veteran players
      
      // Adjust based on position
      if (player.positions.includes('ST') || player.positions.includes('CF')) baseValue *= 1.4;
      else if (player.positions.includes('CAM') || player.positions.includes('CM')) baseValue *= 1.2;
      else if (player.positions.includes('GK')) baseValue *= 0.8;
      
      return sum + baseValue;
    }, 0);

    const avgAge = squadPlayers.reduce((sum, p) => sum + p.age, 0) / squadPlayers.length;
    
    const contractsExpiring = squadPlayers.filter(p => 
      p.contractExpiry && new Date(p.contractExpiry) < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalValue, avgAge, contractsExpiring };
  }, [squadPlayers, selectedSquad]);

  const getSquadDisplayName = (squadType: string) => {
    switch (squadType) {
      case 'first-xi': return 'First XI';
      case 'shadow-squad': return 'Shadow Squad';
      case 'u23': return 'Under 23s';
      case 'u21': return 'Under 21s';
      case 'u18': return 'Under 18s';
      default: return 'Squad';
    }
  };

  const displayTitle = `${userClub} ${getSquadDisplayName(selectedSquad)} Analysis`;

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
              Manage squad formations, analyze depth, and identify recruitment opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Squad Selector */}
      <SquadSelector 
        selectedSquad={selectedSquad}
        onSquadSelect={setSelectedSquad}
        club={userClub}
        players={clubPlayers}
      />

      {/* Squad Value Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            {getSquadDisplayName(selectedSquad)} Value Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">£{squadMetrics.totalValue.toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground">Total Squad Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{squadPlayers.length}</div>
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

      {/* Enhanced Football Pitch Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Squad Formation & Depth Analysis
            {selectedSquad === 'shadow-squad' && (
              <Badge variant="secondary" className="ml-2">
                Full Depth View
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedFootballPitch 
            players={squadPlayers} 
            squadType={selectedSquad}
            onPositionClick={setSelectedPosition}
            selectedPosition={selectedPosition}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Squad Recommendations */}
        <SquadRecommendations 
          players={squadPlayers}
          selectedPosition={selectedPosition}
          onPositionSelect={setSelectedPosition}
        />

        {/* Prospect Comparison */}
        {selectedPosition && (
          <ProspectComparison 
            position={selectedPosition}
            currentPlayers={squadPlayers.filter(p => 
              p.positions.some(pos => pos.toLowerCase().includes(selectedPosition.toLowerCase()))
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SquadView;
