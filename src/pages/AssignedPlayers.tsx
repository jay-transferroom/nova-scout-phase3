
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, FileText, Eye, Edit, Calendar, User } from "lucide-react";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'reviewed': return 'Reviewed';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      return `${Math.floor(diffInDays / 30)} months ago`;
    } catch {
      return 'Unknown';
    }
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
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {assignment.players?.positions.join(', ')}
                    </p>
                    {assignment.players?.age && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{assignment.players.age} yrs</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(assignment.status)} border`}>
                    {formatStatusText(assignment.status)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant={assignment.priority === 'High' ? 'destructive' : assignment.priority === 'Medium' ? 'default' : 'secondary'}>
                    {assignment.priority}
                  </Badge>
                </div>
                
                {assignment.deadline && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deadline:</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(assignment.deadline)}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned:</span>
                  <span>{getTimeAgo(assignment.created_at)}</span>
                </div>

                {assignment.assignment_notes && (
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Notes:</p>
                    <p className="text-gray-700 text-xs bg-gray-50 p-2 rounded">
                      {assignment.assignment_notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {assignment.status !== 'completed' && assignment.status !== 'reviewed' ? (
                  <Link to={`/reports/new?playerId=${assignment.player_id}&assignmentId=${assignment.id}`} className="flex-1">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
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
                  <User className="h-4 w-4 mr-2" />
                  Profile
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
