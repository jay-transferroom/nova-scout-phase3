
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Users, Calendar, Target, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReports } from "@/hooks/useReports";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, loading } = useReports();

  const myReports = reports.filter(report => report.scoutId === user?.id);
  const draftReports = myReports.filter(report => report.status === 'draft');
  const submittedReports = myReports.filter(report => report.status === 'submitted');

  const quickActions = [
    {
      title: "Create New Report",
      description: "Start a new scouting report",
      icon: Plus,
      action: () => navigate("/report-builder"),
      variant: "default" as const,
    },
    {
      title: "View All Reports",
      description: "Browse existing reports",
      icon: FileText,
      action: () => navigate("/reports"),
      variant: "outline" as const,
    },
    {
      title: "Player Search",
      description: "Find players to scout",
      icon: Users,
      action: () => navigate("/search"),
      variant: "outline" as const,
    },
    {
      title: "Calendar",
      description: "View upcoming matches",
      icon: Calendar,
      action: () => navigate("/calendar"),
      variant: "outline" as const,
    },
  ];

  const stats = [
    {
      title: "Total Reports",
      value: myReports.length,
      description: "Reports created by you",
      icon: FileText,
      trend: "+2 this week",
    },
    {
      title: "Draft Reports",
      value: draftReports.length,
      description: "Pending completion",
      icon: AlertCircle,
      trend: loading ? "Loading..." : `${draftReports.length} pending`,
    },
    {
      title: "Submitted Reports",
      value: submittedReports.length,
      description: "Completed reports",
      icon: TrendingUp,
      trend: loading ? "Loading..." : `${submittedReports.length} completed`,
    },
    {
      title: "Players Scouted",
      value: new Set(myReports.map(r => r.playerId)).size,
      description: "Unique players",
      icon: Users,
      trend: loading ? "Loading..." : "Across all reports",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scout Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}. Here's your scouting overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={action.action}
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Your most recent scouting activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading reports...</p>
          ) : myReports.length > 0 ? (
            <div className="space-y-4">
              {myReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/report/${report.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{report.player?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.player?.club} • {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={report.status === 'submitted' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/reports")}
              >
                View All Reports
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
  );
};

export default Index;
