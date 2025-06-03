
import { useState } from "react";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerProfilePreview from "@/components/PlayerProfilePreview";
import TemplateSelection from "@/components/TemplateSelection";
import RequirementCard from "@/components/RequirementCard";
import PlayerPitchModal from "@/components/PlayerPitchModal";
import { Player } from "@/types/player";
import { ReportTemplate } from "@/types/report";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkCheck, File, FileText, Star, Users, Plus, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useReports } from "@/hooks/useReports";
import ReportsTable from "@/components/reports/ReportsTable";

const ScoutingDashboard = () => {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedPitchPosition, setSelectedPitchPosition] = useState<string | null>(null);
  const { reports, loading, deleteReport } = useReports();

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

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleDeleteReport = async (reportId: string, playerName: string) => {
    if (window.confirm(`Are you sure you want to delete the report for ${playerName}?`)) {
      try {
        await deleteReport(reportId);
        toast({
          title: "Success",
          description: "Report deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete report",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateAd = (position: string) => {
    navigate('/transfers/requirements', { state: { position, action: 'create' } });
  };

  const handleViewPitches = (position: string) => {
    setSelectedPitchPosition(position);
  };

  const statsCards = [
    { title: "Received Pitches", value: "29", subtitle: "New Pitches", color: "text-green-600", icon: FileText },
    { title: "Saved Pitches", value: "22", subtitle: "Players", color: "text-blue-600", icon: BookmarkCheck },
    { title: "Shortlist", value: "30", subtitle: "Players", color: "text-purple-600", icon: Star },
  ];

  const requirementItems = [
    { position: "Goalkeeper", count: "20 new pitches", active: true },
    { position: "Left Back", count: "10 new pitches", active: false },
    { position: "Right Back", count: undefined, active: false },
    { position: "Centre Back (all)", count: undefined, active: false },
    { position: "Centre Back (left footed)", count: undefined, active: false },
    { position: "Defensive Midfielder", count: undefined, active: false },
    { position: "Central Midfielder", count: undefined, active: false },
    { position: "Attacking Midfielder", count: undefined, active: false },
    { position: "Winger", count: "5 new pitches", active: true },
    { position: "Forward", count: undefined, active: false },
  ];

  // Get the 5 most recent reports for the dashboard
  const recentReports = reports.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Transfers In Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Transfers In</h1>
            <Button 
              onClick={() => navigate('/squad')}
              variant="outline"
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              View Squad Analysis
            </Button>
          </div>
          
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
              <RequirementCard
                key={index}
                position={item.position}
                status={item.active ? 'active' : 'inactive'}
                count={item.count}
                onCreateAd={() => handleCreateAd(item.position)}
                onViewPitches={() => handleViewPitches(item.position)}
              />
            ))}
          </div>
        </div>

        {/* Latest Scouting Reports Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Latest Scouting Reports</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/reports")}
              className="text-sm"
            >
              View All Reports
            </Button>
          </div>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading reports...
                </div>
              ) : (
                <ReportsTable 
                  reports={recentReports}
                  onViewReport={handleViewReport}
                  onDeleteReport={handleDeleteReport}
                />
              )}
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

      {/* Player Pitch Modal */}
      <PlayerPitchModal
        isOpen={!!selectedPitchPosition}
        onClose={() => setSelectedPitchPosition(null)}
        position={selectedPitchPosition || ''}
      />
    </div>
  );
};

export default ScoutingDashboard;
