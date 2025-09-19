
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Sparkles, 
  Info, 
  TrendingUp, 
  Users, 
  FileText
} from "lucide-react";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { calculateAge } from "@/utils/playerProfileUtils";
import { PlayerCareerTab } from "@/components/player-profile/PlayerCareerTab";
import { PlayerFinancialsTab } from "@/components/player-profile/PlayerFinancialsTab";
import { PlayerImpactTab } from "@/components/player-profile/PlayerImpactTab";
import { PlayerPlayingStyleTab } from "@/components/player-profile/PlayerPlayingStyleTab";
import { PlayerInjuriesTab } from "@/components/player-profile/PlayerInjuriesTab";
import { PlayerMatchHistoryTab } from "@/components/player-profile/PlayerMatchHistoryTab";
import { PlayerAlternativesTab } from "@/components/player-profile/PlayerAlternativesTab";
import PlayerStatusActions from "@/components/PlayerStatusActions";

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("career");

  const { player, isLoading, error, playerReports } = usePlayerProfile(id);

  const handleCreateReport = () => {
    navigate('/report-builder', { state: { selectedPlayerId: id } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Player not found</p>
          <p className="text-muted-foreground mb-4">The player you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Player Header Section */}
        <div className="mb-8">
          {/* Player Basic Info */}
          <div className="flex items-start gap-6 mb-6">
            {/* Player Avatar */}
            <div className="w-24 h-24 rounded-full bg-muted overflow-hidden flex-shrink-0">
              {player.image ? (
                <img 
                  src={player.image} 
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>

            {/* Player Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{player.name}</h1>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">LFC</span>
                    </div>
                    <span className="text-lg font-medium">{player.club}</span>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {player.positions?.join(' / ') || 'Position not specified'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">Rating (Potential)</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600">95.0</span>
                        <span className="text-xl text-muted-foreground">(95.0)</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">xTV</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-3xl font-bold text-blue-600">€87,000,000</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate AI Summary
                    </Button>
                    <Button variant="outline" onClick={handleCreateReport} className="gap-2">
                      <FileText className="w-4 h-4" />
                      Create Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Status and Actions Bar */}
          <PlayerStatusActions 
            playerId={player.id}
            playerName={player.name}
            playerReports={playerReports}
          />

          {/* Info Badges */}
          <div className="flex gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-50 text-blue-700 border-blue-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              93% increase in xTV during the last 12 months
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-50 text-blue-700 border-blue-200">
              <Users className="w-4 h-4 mr-2" />
              Higher rated than Alan Virginius
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-orange-50 text-orange-700 border-orange-200">
              <Info className="w-4 h-4 mr-2" />
              A club has just declared interest in this player
            </Badge>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Player Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Player summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contracted until</span>
                    <span className="font-medium">June 2027</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nationality</span>
                    <span className="font-medium">{player.nationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">International caps</span>
                    <span className="font-medium">90</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">{calculateAge(player.dateOfBirth)} (15/06/1992)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-medium">175cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Foot</span>
                    <span className="font-medium">{player.dominantFoot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GBE Status</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Auto-Pass</span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Available minutes played</span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Squad Role</span>
                    <span className="font-medium">Key Player</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Playing style</span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">Inverted Winger</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Goals + assists / 90</span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">1.1</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">NEW</Badge>
                      <span className="text-muted-foreground">Max speed</span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">34.2 km/h</span>
                      <div className="w-12 h-2 bg-emerald-500 rounded"></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">NEW</Badge>
                      <span className="text-muted-foreground">Distance covered / 90</span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">8.9 km</span>
                      <div className="w-12 h-2 bg-red-500 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span>Physical data provided in partnership with</span>
                    <span className="font-bold">EA FC</span>
                    <Info className="w-3 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="career" className="text-sm">Career</TabsTrigger>
            <TabsTrigger value="financials" className="text-sm">Financials</TabsTrigger>
            <TabsTrigger value="impact" className="text-sm">Impact</TabsTrigger>
            <TabsTrigger value="playing-style" className="text-sm">Playing Style</TabsTrigger>
            <TabsTrigger value="injuries" className="text-sm">Injuries</TabsTrigger>
            <TabsTrigger value="match-history" className="text-sm">Match History</TabsTrigger>
            <TabsTrigger value="alternatives" className="text-sm">Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value="career">
            <PlayerCareerTab player={player} />
          </TabsContent>
          
          <TabsContent value="financials">
            <PlayerFinancialsTab player={player} />
          </TabsContent>
          
          <TabsContent value="impact">
            <PlayerImpactTab player={player} />
          </TabsContent>
          
          <TabsContent value="playing-style">
            <PlayerPlayingStyleTab player={player} />
          </TabsContent>
          
          <TabsContent value="injuries">
            <PlayerInjuriesTab player={player} />
          </TabsContent>
          
          <TabsContent value="match-history">
            <PlayerMatchHistoryTab player={player} />
          </TabsContent>
          
          <TabsContent value="alternatives">
            <PlayerAlternativesTab player={player} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayerProfile;
