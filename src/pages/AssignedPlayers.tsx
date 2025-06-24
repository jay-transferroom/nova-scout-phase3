
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, FileText, Eye, Edit } from "lucide-react";
import { useMyScoutingTasks } from "@/hooks/useMyScoutingTasks";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const AssignedPlayers = () => {
  const { data: assignments = [], isLoading } = useMyScoutingTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.players?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.players?.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'assigned': return 'destructive';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'reviewed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPlayerRating = (playerId: string) => {
    // Generate consistent rating based on player ID for mock data
    const hash = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((hash % 20) + 70).toFixed(1);
  };

  const getUpdatedTime = (status: string) => {
    const times = {
      'assigned': '2 days ago',
      'in_progress': '5 hours ago', 
      'completed': '1 week ago',
      'reviewed': '3 days ago'
    };
    return times[status as keyof typeof times] || '1 day ago';
  };

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'assigned').length,
    inProgress: assignments.filter(a => a.status === 'in_progress').length,
    completed: assignments.filter(a => ['completed', 'reviewed'].includes(a.status)).length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">Loading assigned players...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Assigned Players</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all player assignments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Bulk Actions
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submit Reports
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-red-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-orange-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face`} />
                  <AvatarFallback>
                    {assignment.players?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{assignment.players?.name}</h3>
                  <p className="text-muted-foreground">{assignment.players?.club}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.players?.positions.join(', ')} • {assignment.players?.age} yrs
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{getPlayerRating(assignment.player_id)}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant={getStatusBadgeVariant(assignment.status)}
                  className={`${assignment.status === 'assigned' ? 'bg-red-100 text-red-800' : 
                    assignment.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                    assignment.status === 'completed' ? 'bg-green-100 text-green-800' : ''} border-0`}
                >
                  {assignment.status === 'assigned' ? 'Assigned' :
                   assignment.status === 'in_progress' ? 'In Progress' :
                   assignment.status === 'completed' ? 'Completed' :
                   'Reviewed'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Updated {getUpdatedTime(assignment.status)}
                </span>
              </div>

              <div className="flex gap-2">
                {assignment.status !== 'completed' && assignment.status !== 'reviewed' ? (
                  <Link to={`/reports/new?playerId=${assignment.player_id}&assignmentId=${assignment.id}`} className="flex-1">
                    <Button className="w-full">
                      Write Report
                    </Button>
                  </Link>
                ) : (
                  <Button variant="default" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                )}
                <Button variant="outline">
                  View Profile
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No assignments found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedPlayers;
