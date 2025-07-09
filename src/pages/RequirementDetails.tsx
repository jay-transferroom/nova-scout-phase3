import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, FileText, Users, MessageSquare } from "lucide-react";
import { useShortlists } from "@/hooks/useShortlists";
import { usePlayersData } from "@/hooks/usePlayersData";
import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import { useReports } from "@/hooks/useReports";

const RequirementDetails = () => {
  const { requirementName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("shortlists");
  
  const { shortlists } = useShortlists();
  const { data: allPlayers = [] } = usePlayersData();
  const { privatePlayers } = usePrivatePlayers();
  const { reports } = useReports();

  // Find the shortlist that matches the requirement name
  const currentShortlist = shortlists.find(
    shortlist => shortlist.name.toLowerCase() === requirementName?.toLowerCase()
  );

  // Get players from both public and private sources
  const shortlistPlayers = currentShortlist ? [
    ...allPlayers.filter(player => 
      currentShortlist.playerIds.includes(player.id.toString())
    ),
    ...privatePlayers.filter(player => 
      currentShortlist.playerIds.includes(player.id)
    )
  ] : [];

  // Get reports for players in this shortlist
  const shortlistReports = reports.filter(report => 
    currentShortlist?.playerIds.includes(report.playerId)
  );

  if (!currentShortlist) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Requirement Not Found</h1>
          <p className="text-muted-foreground">The requirement "{requirementName}" could not be found.</p>
          <Button onClick={() => navigate("/transfers-in")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transfers In
          </Button>
        </div>
      </div>
    );
  }

  const calculateTransferFee = (rating: number, age: number) => {
    let baseValue = rating * 0.5;
    if (age < 23) baseValue *= 1.5;
    else if (age < 27) baseValue *= 1.2;
    else if (age > 30) baseValue *= 0.8;
    return `£${Math.round(baseValue)}M`;
  };

  const calculateSalary = (rating: number) => {
    const baseSalary = rating * 1000;
    return `£${Math.round(baseSalary / 1000)}K`;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/transfers-in")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold capitalize">{requirementName} Requirement</h1>
            <p className="text-muted-foreground">
              {shortlistPlayers.length} players • {shortlistReports.length} reports
            </p>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shortlists" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Shortlists ({shortlistPlayers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="pitches" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Pitches (12)</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages (3)</span>
          </TabsTrigger>
        </TabsList>

        {/* Shortlists Tab */}
        <TabsContent value="shortlists" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shortlistPlayers.map((player) => {
              const playerReports = reports.filter(report => report.playerId === player.id.toString());
              const rating = (player as any).transferroom_rating || (player as any).transferroomRating || (player as any).rating || 75;
              
              return (
                <Card key={player.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Player Header */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={(player as any).image_url || (player as any).imageurl} alt={player.name} />
                          <AvatarFallback>
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{player.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {player.positions?.[0] || (player as any).firstposition || 'ST'}
                            </Badge>
                            <span className="text-lg font-bold text-blue-600">
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Club and Age */}
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline" className="text-xs">
                          {player.club || (player as any).currentteam || 'Free Agent'}
                        </Badge>
                        <span className="text-muted-foreground">Age: {player.age}</span>
                      </div>

                      {/* Transfer Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transfer Fee:</span>
                          <span className="font-medium">
                            {calculateTransferFee(rating, player.age)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross Salary:</span>
                          <span className="font-medium">
                            {calculateSalary(rating)}/week
                          </span>
                        </div>
                      </div>

                      {/* Reports */}
                      {playerReports.length > 0 && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {playerReports.length} report{playerReports.length > 1 ? 's' : ''}
                            </span>
                            <Button variant="ghost" size="sm">
                              View Reports
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {shortlistPlayers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No players found in this shortlist.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pitches Tab */}
        <TabsContent value="pitches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Player Pitches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section will show all pitches received for players in the {requirementName} requirement.
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Recent Pitch: Harry Kane</h4>
                      <p className="text-sm text-muted-foreground">Agency365 • 2 days ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Plus Pitch</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Pitch: Erling Haaland</h4>
                      <p className="text-sm text-muted-foreground">Elite Sports • 5 days ago</p>
                    </div>
                    <Badge variant="secondary">Standard</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Communication history related to the {requirementName} requirement.
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Transfer Director</h4>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm">Please prioritize the striker requirement - we need options by end of month.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Chief Scout</h4>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                  <p className="text-sm">Updated shortlist with 3 new targets identified from recent scouting trips.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequirementDetails;