
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
import { Users, FileText, Star, Clock, Calendar, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useReports } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

// Mock data for upcoming fixtures
const mockUpcomingFixtures = [
  {
    id: "1",
    homeTeam: "Brighton",
    awayTeam: "Liverpool",
    playerToWatch: "Marcus Johnson",
    date: new Date(),
    time: "15:00",
    competition: "Premier League"
  },
  {
    id: "2",
    homeTeam: "Real Sociedad",
    awayTeam: "Barcelona", 
    playerToWatch: "Luis Rodriguez",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: "21:00",
    competition: "La Liga"
  },
  {
    id: "3",
    homeTeam: "Dynamo Kiev",
    awayTeam: "Shakhtar",
    playerToWatch: "Viktor Petrov",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "17:30",
    competition: "Ukrainian Premier League"
  }
];

// Mock recent activity data
const mockRecentActivity = [
  {
    id: "1",
    action: "Viktor Petrov report approved",
    time: "2 hours ago"
  },
  {
    id: "2", 
    action: "Marcus Johnson assigned to Sarah Williams",
    time: "4 hours ago"
  },
  {
    id: "3",
    action: "Ahmed Hassan added to Young Prospects",
    time: "1 day ago"
  },
  {
    id: "4",
    action: "Brighton vs Liverpool - Marcus Johnson playing",
    time: "2 days ago"
  }
];

const ScoutingDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
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
    { 
      title: "Total Players", 
      value: "4", 
      subtitle: "Assigned for scouting", 
      color: "bg-purple-100", 
      icon: Users,
      iconColor: "text-purple-600"
    },
    { 
      title: "Completed Reports", 
      value: "1", 
      subtitle: "This month", 
      color: "bg-green-100", 
      icon: FileText,
      iconColor: "text-green-600"
    },
    { 
      title: "Shortlisted Players", 
      value: "5", 
      subtitle: "Across 2 lists", 
      color: "bg-yellow-100", 
      icon: Star,
      iconColor: "text-yellow-600"
    },
    { 
      title: "Pending Actions", 
      value: "3", 
      subtitle: "Require attention", 
      color: "bg-red-100", 
      icon: Clock,
      iconColor: "text-red-600"
    },
  ];

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return 'Scout';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {getDisplayName()}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your scouting activities today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Fixtures */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Upcoming Fixtures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockUpcomingFixtures.map((fixture) => (
                <div key={fixture.id} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {fixture.homeTeam} vs {fixture.awayTeam}
                    </h4>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(fixture.date, 'MMM d') === format(new Date(), 'MMM d') 
                          ? 'Today' 
                          : format(fixture.date, 'MMM d') === format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'MMM d')
                          ? 'Tomorrow'
                          : format(fixture.date, 'MMM d, yyyy')
                        } {fixture.time}
                      </p>
                      <p className="text-xs text-gray-500">{fixture.competition}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{fixture.playerToWatch} playing</p>
                </div>
              ))}
            </CardContent>
          </Card>
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
