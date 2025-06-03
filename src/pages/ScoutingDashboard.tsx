
import { useState } from "react";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerProfilePreview from "@/components/PlayerProfilePreview";
import TemplateSelection from "@/components/TemplateSelection";
import RequirementCard from "@/components/RequirementCard";
import PlayerPitchModal from "@/components/PlayerPitchModal";
import NewRequirementDialog from "@/components/NewRequirementDialog";
import { Player } from "@/types/player";
import { ReportTemplate, RequirementProfile } from "@/types/report";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkCheck, File, FileText, Star, Users, Plus, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useReports } from "@/hooks/useReports";
import ReportsTable from "@/components/reports/ReportsTable";

// Mock requirement profiles (matching the data from RequirementsList)
const mockRequirementProfiles: RequirementProfile[] = [
  {
    id: "req-1",
    name: "Central Defender",
    description: "Experienced central defender with good aerial ability and leadership",
    requiredPositions: ["CB"],
    ageRange: { min: 24, max: 29 },
    preferredRegions: ["Europe", "South America"],
    requiredAttributes: [
      { attributeName: "Aerial Ability", minRating: 8 },
      { attributeName: "Leadership", minRating: 7 },
      { attributeName: "Positioning", minRating: 8 },
    ],
  },
  {
    id: "req-2",
    name: "Creative Midfielder",
    description: "Technical attacking midfielder with vision and creativity",
    requiredPositions: ["CAM", "CM"],
    ageRange: { min: 20, max: 26 },
    preferredRegions: ["Europe", "South America"],
    requiredAttributes: [
      { attributeName: "Technical", minRating: 8 },
      { attributeName: "Vision", minRating: 8 },
      { attributeName: "Creativity", minRating: 7 },
    ],
  },
  {
    id: "req-3",
    name: "Promising Goalkeeper",
    description: "Young goalkeeper with good reflexes and distribution",
    requiredPositions: ["GK"],
    ageRange: { min: 18, max: 23 },
    preferredRegions: ["Europe", "South America", "North America"],
    requiredAttributes: [
      { attributeName: "Reflexes", minRating: 7 },
      { attributeName: "Distribution", minRating: 7 },
    ],
  },
];

const ScoutingDashboard = () => {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedPitchPosition, setSelectedPitchPosition] = useState<string | null>(null);
  const [isNewRequirementOpen, setIsNewRequirementOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState<string | undefined>();
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

  const handleCreateRequirement = () => {
    setIsNewRequirementOpen(true);
  };

  const handleViewRequirement = (requirementId: string) => {
    navigate(`/transfers/requirements/${requirementId}`);
  };

  const handleCreateAd = (position: string) => {
    setInitialPosition(position);
    setIsNewRequirementOpen(true);
  };

  const handleViewPitches = (position: string) => {
    setSelectedPitchPosition(position);
  };

  const statsCards = [
    { title: "Received Pitches", value: "29", subtitle: "New Pitches", color: "text-green-600", icon: FileText },
    { title: "Saved Pitches", value: "22", subtitle: "Players", color: "text-blue-600", icon: BookmarkCheck },
    { title: "Shortlist", value: "30", subtitle: "Players", color: "text-purple-600", icon: Star },
  ];

  // Map requirements to card format
  const requirementCards = mockRequirementProfiles.map(req => ({
    id: req.id,
    position: req.name,
    status: 'active' as const,
    count: `${Math.floor(Math.random() * 20) + 5} new pitches`,
    description: req.description,
    requirement: req
  }));

  // Add some inactive requirements for display
  const inactiveRequirements = [
    { id: "inactive-1", position: "Right Back", status: 'inactive' as const },
    { id: "inactive-2", position: "Left Winger", status: 'inactive' as const },
    { id: "inactive-3", position: "Striker", status: 'inactive' as const },
  ];

  const allRequirements = [...requirementCards, ...inactiveRequirements];

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

        {/* Your Club Requirements Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Club Requirements</h2>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/transfers/requirements")}
                className="text-sm"
              >
                View All Requirements
              </Button>
              <Button 
                onClick={handleCreateRequirement}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Requirement
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {allRequirements.slice(0, 10).map((item) => (
              <RequirementCard
                key={item.id}
                position={item.position}
                status={item.status}
                count={'count' in item ? item.count : undefined}
                onCreateAd={() => handleCreateAd(item.position)}
                onViewPitches={item.status === 'active' && 'requirement' in item ? 
                  () => handleViewRequirement(item.requirement.id) : 
                  () => handleViewPitches(item.position)
                }
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

      {/* New Requirement Dialog */}
      <NewRequirementDialog 
        isOpen={isNewRequirementOpen}
        onClose={() => {
          setIsNewRequirementOpen(false);
          setInitialPosition(undefined);
        }}
        initialPosition={initialPosition}
      />
    </div>
  );
};

export default ScoutingDashboard;
