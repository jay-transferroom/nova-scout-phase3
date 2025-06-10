
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Plus, Eye, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

// Mock data for scouting assignments
const mockAssignments = [
  {
    id: "1",
    player_id: "p1",
    assigned_to_scout_id: "s1",
    priority: "High" as const,
    status: "assigned" as const,
    deadline: "2025-06-15",
    report_type: "Full Report",
    created_at: "2025-06-08T10:00:00Z",
    players: {
      name: "Marcus Johnson",
      club: "Arsenal U21",
      positions: ["CM", "CAM"],
      age: 19
    },
    assigned_to_scout: {
      first_name: "Sarah",
      last_name: "Wilson",
      email: "sarah.wilson@club.com"
    }
  },
  {
    id: "2",
    player_id: "p2",
    assigned_to_scout_id: "s2",
    priority: "Medium" as const,
    status: "in_progress" as const,
    deadline: "2025-06-20",
    report_type: "Match Report",
    created_at: "2025-06-07T14:30:00Z",
    players: {
      name: "Diego Fernandez",
      club: "Valencia CF",
      positions: ["LW", "RW"],
      age: 21
    },
    assigned_to_scout: {
      first_name: "James",
      last_name: "Thompson",
      email: "james.thompson@club.com"
    }
  },
  {
    id: "3",
    player_id: "p3",
    assigned_to_scout_id: "s3",
    priority: "High" as const,
    status: "completed" as const,
    deadline: "2025-06-12",
    report_type: "Technical Analysis",
    created_at: "2025-06-05T09:15:00Z",
    players: {
      name: "Luca Rossi",
      club: "AC Milan Primavera",
      positions: ["ST"],
      age: 18
    },
    assigned_to_scout: {
      first_name: "Emma",
      last_name: "Davies",
      email: "emma.davies@club.com"
    }
  },
  {
    id: "4",
    player_id: "p4",
    assigned_to_scout_id: "s1",
    priority: "Low" as const,
    status: "reviewed" as const,
    deadline: "2025-06-10",
    report_type: "Quick Assessment",
    created_at: "2025-06-03T16:45:00Z",
    players: {
      name: "Kevin O'Connor",
      club: "Celtic FC",
      positions: ["CB", "CDM"],
      age: 20
    },
    assigned_to_scout: {
      first_name: "Sarah",
      last_name: "Wilson",
      email: "sarah.wilson@club.com"
    }
  },
  {
    id: "5",
    player_id: "p5",
    assigned_to_scout_id: "s4",
    priority: "Medium" as const,
    status: "assigned" as const,
    deadline: "2025-06-25",
    report_type: "Full Report",
    created_at: "2025-06-09T11:20:00Z",
    players: {
      name: "Pierre Dubois",
      club: "Olympique Lyon",
      positions: ["GK"],
      age: 22
    },
    assigned_to_scout: {
      first_name: "Michael",
      last_name: "Brown",
      email: "michael.brown@club.com"
    }
  },
  {
    id: "6",
    player_id: "p6",
    assigned_to_scout_id: "s2",
    priority: "High" as const,
    status: "in_progress" as const,
    deadline: "2025-06-18",
    report_type: "Match Report",
    created_at: "2025-06-06T08:30:00Z",
    players: {
      name: "Ahmed Hassan",
      club: "Al Ahly SC",
      positions: ["RB", "RM"],
      age: 19
    },
    assigned_to_scout: {
      first_name: "James",
      last_name: "Thompson",
      email: "james.thompson@club.com"
    }
  }
];

// Mock players for quick assign
const mockPlayers = [
  { id: "p7", name: "Carlos Silva", club: "Benfica B", positions: ["LB"] },
  { id: "p8", name: "Erik Larsson", club: "Malmo FF", positions: ["CM"] },
  { id: "p9", name: "Yuki Tanaka", club: "Yokohama FC", positions: ["CAM"] },
  { id: "p10", name: "Antonio Greco", club: "Napoli Primavera", positions: ["ST"] },
  { id: "p11", name: "João Santos", club: "Porto B", positions: ["CB"] },
  { id: "p12", name: "Tom Mitchell", club: "Brighton U21", positions: ["GK"] },
  { id: "p13", name: "Leon Müller", club: "Borussia Dortmund II", positions: ["RW"] },
  { id: "p14", name: "Rafael Costa", club: "Sporting CP B", positions: ["CDM"] }
];

const ScoutManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.players?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.players?.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'assigned': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'reviewed': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleAssignPlayer = (player: any) => {
    setSelectedPlayer(player);
    setIsAssignDialogOpen(true);
  };

  const stats = {
    totalAssignments: mockAssignments.length,
    pendingAssignments: mockAssignments.filter(a => a.status === 'assigned').length,
    inProgress: mockAssignments.filter(a => a.status === 'in_progress').length,
    completed: mockAssignments.filter(a => ['completed', 'reviewed'].includes(a.status)).length,
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Scout Management</h1>
        <p className="text-muted-foreground mt-2">
          Assign players to scouts and track scouting progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingAssignments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players or clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Assign Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Assign Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockPlayers.slice(0, 8).map((player) => (
              <div key={player.id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{player.name}</h4>
                <p className="text-sm text-muted-foreground">{player.club}</p>
                <p className="text-xs text-muted-foreground">{player.positions.join(', ')}</p>
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => handleAssignPlayer(player)}
                >
                  Assign Scout
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Scouting Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Scout</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assignment.players?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.players?.club} • {assignment.players?.positions.join(', ')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {assignment.assigned_to_scout?.first_name} {assignment.assigned_to_scout?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.assigned_to_scout?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(assignment.status)}>
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.deadline ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(assignment.deadline), 'MMM dd, yyyy')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No deadline</span>
                        )}
                      </TableCell>
                      <TableCell>{assignment.report_type}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No assignments found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoutManagement;
