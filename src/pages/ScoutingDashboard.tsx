
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, FileText, Search, Filter, Plus, TrendingUp, Target, Clock, CheckCircle } from "lucide-react";
import { useMyScoutingTasks } from "@/hooks/useMyScoutingTasks";
import { Link } from "react-router-dom";

const ScoutingDashboard = () => {
  const { data: assignments = [], isLoading } = useMyScoutingTasks();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    totalAssignments: assignments.length,
    pendingReports: assignments.filter(a => a.status === 'assigned').length,
    completedReports: assignments.filter(a => a.status === 'completed').length,
    upcomingMatches: 12,
  };

  const recentActivity = [
    { type: 'report', player: 'Marcus Johnson', club: 'Arsenal', time: '2 hours ago' },
    { type: 'assignment', player: 'David Silva', club: 'Chelsea', time: '5 hours ago' },
    { type: 'match', event: 'Liverpool vs Manchester City', time: '1 day ago' },
  ];

  const upcomingTasks = assignments.slice(0, 3);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl bg-background">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Scout Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your scouting overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Link to="/reports/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">Active scouting tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-warning-600">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Reports to submit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Reports</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-success-600">{stats.completedReports}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Matches</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{stats.upcomingMatches}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-success-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.type === 'report' && `Report submitted for ${activity.player}`}
                      {activity.type === 'assignment' && `New assignment: ${activity.player}`}
                      {activity.type === 'match' && `Match watched: ${activity.event}`}
                    </p>
                    {activity.club && (
                      <p className="text-xs text-muted-foreground">{activity.club}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.players?.name}</p>
                      <p className="text-xs text-muted-foreground">{task.players?.club}</p>
                    </div>
                    <Badge 
                      variant={task.status === 'assigned' ? 'destructive' : 'secondary'}
                      className={task.status === 'assigned' ? 'bg-warning-100 text-warning-800 border-0' : ''}
                    >
                      {task.status === 'assigned' ? 'Pending' : task.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No upcoming tasks</p>
              )}
            </div>
            <div className="mt-4">
              <Link to="/assigned-players">
                <Button variant="outline" className="w-full">
                  View All Assignments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/reports/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Create Report
                </Button>
              </Link>
              <Link to="/assigned-players">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  View Assignments
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  Match Schedule
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoutingDashboard;
