
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, Star, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayersData } from "@/hooks/usePlayersData";
import EnhancedFootballPitch from "@/components/EnhancedFootballPitch";
import SquadSelector from "@/components/SquadSelector";
import SquadRecommendations from "@/components/SquadRecommendations";
import ProspectComparison from "@/components/ProspectComparison";

const SquadView = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: allPlayers = [], isLoading } = usePlayersData();
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
    return allPlayers.filter(player => player.club === userClub);
  }, [allPlayers, userClub]);

  // Filter players based on selected squad type
  const squadPlayers = useMemo(() => {
    switch (selectedSquad) {
      case 'first-xi':
        return clubPlayers.slice(0, 11); // First choice 11
      case 'shadow-squad':
        return clubPlayers.slice(0, 25); // Full squad
      case 'u23':
        return clubPlayers.filter(p => p.age <= 23);
      case 'u21':
        return clubPlayers.filter(p => p.age <= 21);
      case 'u18':
        return clubPlayers.filter(p => p.age <= 18);
      default:
        return clubPlayers.slice(0, 11);
    }
  }, [clubPlayers, selectedSquad]);

  // Calculate squad metrics
  const squadMetrics = useMemo(() => {
    const totalValue = squadPlayers.length * 15.5; // Mock xTV calculation
    const avgAge = squadPlayers.length > 0 
      ? squadPlayers.reduce((sum, p) => sum + p.age, 0) / squadPlayers.length 
      : 0;
    const contractsExpiring = squadPlayers.filter(p => 
      p.contractExpiry && new Date(p.contractExpiry) < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalValue, avgAge, contractsExpiring };
  }, [squadPlayers]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading squad data...</div>
      </div>
    );
  }

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
              <div className="text-sm text-muted-foreground">Total xTV</div>
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
