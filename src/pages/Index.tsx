import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Users, Calendar, Target, Plus, TrendingUp, AlertCircle, UserPlus, Search, List, User, Eye, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReports } from "@/hooks/useReports";
import DirectorDashboard from "./DirectorDashboard";
import { Badge } from "@/components/ui/badge";
import AddPrivatePlayerDialog from "@/components/AddPrivatePlayerDialog";
import { TrackedPlayersSection } from "@/components/TrackedPlayersSection";
import { getOverallRating, getRecommendation } from "@/utils/reportDataExtraction";
import VerdictBadge from "@/components/VerdictBadge";
import { useReportPlayerData } from "@/hooks/useReportPlayerData";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { reports, loading } = useReports();

  // Route to appropriate dashboard based on user role
  if (profile?.role === 'director') {
    return <DirectorDashboard />;
  }

  const myReports = reports.filter(report => report.scoutId === user?.id);
  const draftReports = myReports.filter(report => report.status === 'draft');
  const submittedReports = myReports.filter(report => report.status === 'submitted');

  // For Recent Reports section, show different data based on user role
  const recentReportsToShow = profile?.role === 'recruitment' 
    ? reports.filter(r => r.status === 'submitted').slice(0, 5) // Show all submitted reports for managers
    : myReports.slice(0, 5); // Show user's own reports for scouts

  const quickActions = [
    {
      title: "Create Report",
      description: "New scouting report",
      icon: Plus,
      action: () => navigate("/report-builder"),
      variant: "default" as const,
      primary: true,
    },
    {
      title: "Add Private Player",
      description: "Player not in database",
      icon: UserPlus,
      action: null,
      variant: "outline" as const,
      isDialog: true,
    },
    {
      title: "Player Search",
      description: "Find players to scout",
      icon: Search,
      action: () => navigate("/search"),
      variant: "outline" as const,
    },
    {
      title: "View Reports",
      description: "Browse all reports",
      icon: FileText,
      action: () => navigate("/reports"),
      variant: "outline" as const,
    },
    {
      title: "Shortlists",
      description: "Recruitment targets",
      icon: List,
      action: () => navigate("/shortlists"),
      variant: "outline" as const,
    },
    {
      title: "Calendar",
      description: "Upcoming matches",
      icon: Calendar,
      action: () => navigate("/calendar"),
      variant: "outline" as const,
    },
  ];

  const recommendForSigningReports = (profile?.role === 'recruitment' ? reports : myReports)
    .filter(report => {
      const verdict = getRecommendation(report);
      return verdict === 'recommend-signing' || verdict === 'Recommend for signing';
    });

  const stats = [
    {
      title: "Total Reports",
      value: loading ? 0 : (profile?.role === 'recruitment' ? reports.length : myReports.length),
      description: profile?.role === 'recruitment' ? "All reports in system" : "Reports created by you",
      icon: FileText,
      trend: loading ? "Loading..." : `${profile?.role === 'recruitment' ? reports.length : myReports.length} total`,
    },
    {
      title: "Draft Reports",
      value: loading ? 0 : (profile?.role === 'recruitment' ? reports.filter(r => r.status === 'draft').length : draftReports.length),
      description: "Pending completion",
      icon: AlertCircle,
      trend: loading ? "Loading..." : `${profile?.role === 'recruitment' ? reports.filter(r => r.status === 'draft').length : draftReports.length} pending`,
    },
    {
      title: "Submitted Reports", 
      value: loading ? 0 : (profile?.role === 'recruitment' ? reports.filter(r => r.status === 'submitted').length : submittedReports.length),
      description: "Completed reports",
      icon: TrendingUp,
      trend: loading ? "Loading..." : `${profile?.role === 'recruitment' ? reports.filter(r => r.status === 'submitted').length : submittedReports.length} completed`,
    },
    {
      title: "Recommend for Signing",
      value: loading ? 0 : recommendForSigningReports.length,
      description: "Players to sign",
      icon: Star,
      trend: loading ? "Loading..." : `${recommendForSigningReports.length} recommended players`,
    },
  ];

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email || 'Scout';
  };

  const getScoutName = (report: any) => {
    if (report.scoutProfile?.first_name && report.scoutProfile?.last_name) {
      return `${report.scoutProfile.first_name} ${report.scoutProfile.last_name}`;
    }
    if (report.scoutProfile?.first_name) {
      return report.scoutProfile.first_name;
    }
    return report.scoutProfile?.email || 'Unknown Scout';
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {profile?.role === 'recruitment' ? 'Scout Management Dashboard' : 'Scout Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {getUserDisplayName()}. Here's your scouting overview.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const getReportsRoute = () => {
              switch (stat.title) {
                case "Total Reports":
                  return "/reports?tab=all-reports";
                case "Draft Reports":
                  return "/reports?tab=my-drafts";
                case "Submitted Reports":
                  return "/reports?tab=my-reports";
                case "Recommend for Signing":
                  return "/reports?tab=all-reports&verdict=recommend-signing";
                default:
                  return "/reports";
              }
            };
            
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => navigate(getReportsRoute())}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tracked Players Section */}
          <TrackedPlayersSection />

          {/* Recent Activity - Now shows real reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Reports</span>
                <Badge variant="secondary">{recentReportsToShow.length} of {profile?.role === 'recruitment' ? reports.length : myReports.length}</Badge>
              </CardTitle>
              <CardDescription>
                {profile?.role === 'recruitment' 
                  ? 'Latest submitted reports from all scouts'
                  : 'Your most recent scouting activity'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground">Loading reports...</p>
              ) : recentReportsToShow.length > 0 ? (
                <div className="space-y-3">
                  {recentReportsToShow.map((report) => (
                    <RecentReportItem 
                      key={report.id} 
                      report={report} 
                      profile={profile}
                      getScoutName={getScoutName}
                      navigate={navigate}
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/reports")}
                  >
                    View All Reports ({profile?.role === 'recruitment' ? reports.length : myReports.length})
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No reports yet</p>
                  <Button onClick={() => navigate("/report-builder")}>
                    Create Your First Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Component to display individual report items with real player data
const RecentReportItem = ({ report, profile, getScoutName, navigate }) => {
  const { data: playerData, isLoading: playerLoading } = useReportPlayerData(report.playerId);
  const rating = getOverallRating(report);
  const verdict = getRecommendation(report);

  const playerName = playerLoading ? 'Loading...' : 
                     playerData?.name || `Player ID: ${report.playerId}`;
  const playerClub = playerLoading ? 'Loading...' : 
                     playerData?.club || 'Unknown Club';

  return (
    <div
      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
      onClick={() => navigate(`/report/${report.id}`)}
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{playerName}</span>
          </div>
          <Badge variant={report.status === 'submitted' ? 'default' : 'secondary'}>
            {report.status}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{playerClub}</span>
            <span>•</span>
            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {profile?.role === 'recruitment' ? getScoutName(report) : 'You'}
            </span>
          </div>
          
          {rating !== null && rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="font-medium">{rating}</span>
            </div>
          )}
          
          {verdict && (
            <VerdictBadge verdict={verdict} />
          )}
        </div>
      </div>
      
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Index;
