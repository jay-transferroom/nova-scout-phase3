
import { useState } from "react";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerProfilePreview from "@/components/PlayerProfilePreview";
import TemplateSelection from "@/components/TemplateSelection";
import { Player } from "@/types/player";
import { ReportTemplate } from "@/types/report";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkCheck, File, FileText, Star, Users, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ScoutingDashboard = () => {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleClosePlayerProfile = () => {
    setSelectedPlayer(null);
  };

  const handleCreateReport = (player: Player) => {
    setIsTemplateDialogOpen(true);
  };

  const handleSelectTemplate = (player: Player, template: ReportTemplate) => {
    setIsTemplateDialogOpen(false);
    toast({
      title: "Report Started",
      description: `New ${template.name} for ${player.name} created.`,
    });
    console.log("Creating report for", player.name, "using template", template.name);
    setSelectedPlayer(null);
  };

  const statsCards = [
    { title: "Received Pitches", value: "29", subtitle: "New Pitches", color: "text-green-600", icon: FileText },
    { title: "Saved Pitches", value: "22", subtitle: "Players", color: "text-blue-600", icon: BookmarkCheck },
    { title: "Shortlist", value: "30", subtitle: "Players", color: "text-purple-600", icon: Star },
  ];

  const requirementItems = [
    { position: "Goalkeeper", count: "20 new pitches", active: true },
    { position: "Left Back", count: "10 new pitches", active: false },
    { position: "Right Back", count: "Inactive", active: false },
    { position: "Centre Back (all)", count: "Inactive", active: false },
    { position: "Centre Back (left footed)", count: "Inactive", active: false },
    { position: "Defensive Midfielder", count: "Inactive", active: false },
    { position: "Central Midfielder", count: "Inactive", active: false },
    { position: "Attacking Midfielder", count: "Inactive", active: false },
    { position: "Winger", count: "5 new pitches", active: true },
    { position: "Forward", count: "Inactive", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Transfers In Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Transfers In</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <card.icon className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">{card.title}</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <p className={`text-sm ${card.color}`}>{card.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Your Requirements Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Your Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {requirementItems.map((item, index) => (
              <Card key={index} className={`bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${item.active ? 'ring-2 ring-green-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{item.position}</h3>
                      <p className={`text-xs ${item.active ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        {item.count}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Latest Scouting Reports Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Latest Scouting Reports</h2>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Player</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Rating</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Recommend</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Scouts</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Reports</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Notes</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Shortlists</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Ad Relevancy</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">Potential Role</th>
                      <th className="text-left p-4 font-medium text-gray-700 text-sm">TR Pathways</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm text-gray-600">No reports available</td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                      <td className="p-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explore and Browse Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-gray-900">Explore and browse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Browse All</h3>
                    <p className="text-sm text-gray-500">Discover your next signing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Available Players</h3>
                    <p className="text-sm text-gray-500">Players who are transfer or loan listed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Expiring Contracts</h3>
                    <p className="text-sm text-gray-500">Contracts expiring in the next 12 months</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Mobile view for player profile */}
      <Sheet open={!!selectedPlayer && window.innerWidth < 768} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <SheetContent className="w-full sm:max-w-md p-0">
          {selectedPlayer && (
            <PlayerProfilePreview 
              player={selectedPlayer} 
              onCreateReport={handleCreateReport} 
              onClose={handleClosePlayerProfile} 
            />
          )}
        </SheetContent>
      </Sheet>
      
      {/* Template selection dialog */}
      {selectedPlayer && (
        <TemplateSelection 
          player={selectedPlayer}
          isOpen={isTemplateDialogOpen}
          onClose={() => setIsTemplateDialogOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
    </div>
  );
};

export default ScoutingDashboard;
