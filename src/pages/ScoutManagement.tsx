import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, MoreHorizontal, Clock, TrendingUp, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScoutingAssignments } from "@/hooks/useScoutingAssignments";
import { useScoutUsers } from "@/hooks/useScoutUsers";
import { usePlayersData } from "@/hooks/usePlayersData";
import { AssignPlayerDialog } from "@/components/AssignPlayerDialog";

const ScoutManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScout, setSelectedScout] = useState("all");
  const [kanbanData, setKanbanData] = useState({
    unassigned: [] as any[],
    assigned: [] as any[],
    completed: [] as any[]
  });

  const { data: assignments = [], refetch: refetchAssignments } = useScoutingAssignments();
  const { data: scouts = [] } = useScoutUsers();
  const { data: allPlayers = [] } = usePlayersData();

  // Transform assignments and unassigned players into kanban format
  useEffect(() => {
    console.log('Scout Management - Assignments:', assignments.length);  
    console.log('Scout Management - Scouts:', scouts.length);
    console.log('Scout Management - All Players:', allPlayers.length);

    const newKanbanData = {
      unassigned: [] as any[],
      assigned: [] as any[],
      completed: [] as any[]
    };

    // Get assigned player IDs
    const assignedPlayerIds = new Set(assignments.map(a => a.player_id));

    // Add unassigned players from shortlists (using first 20 players as mock shortlist)
    const unassignedPlayers = allPlayers
      .filter(player => !assignedPlayerIds.has(player.id.toString()))
      .slice(0, 20)
      .map(player => ({
        id: `unassigned-${player.id}`,
        playerName: player.name,
        club: player.club, // Use the transformed 'club' property from usePlayersData
        position: player.positions?.[0] || 'Unknown', // Use the transformed 'positions' array
        rating: player.transferroomRating?.toFixed(1) || 'N/A', // Use transferroomRating from Player interface
        assignedTo: 'Unassigned',
        updatedAt: 'Available for assignment',
        lastStatusChange: 'Available for assignment',
        avatar: player.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&auto=format`, // Use 'image' from Player interface
        priority: null,
        deadline: null,
        scoutId: null,
        status: 'unassigned',
        playerId: player.id.toString()
      }));

    // Apply search filter to unassigned players
    const filteredUnassigned = searchTerm 
      ? unassignedPlayers.filter(player => 
          player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.club.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : unassignedPlayers;

    newKanbanData.unassigned = filteredUnassigned;

    // Process assigned players
    assignments.forEach((assignment) => {
      const scoutName = assignment.assigned_to_scout?.first_name 
        ? `${assignment.assigned_to_scout.first_name} ${assignment.assigned_to_scout.last_name || ''}`.trim()
        : assignment.assigned_to_scout?.email || 'Unknown Scout';

      // Apply scout filter
      if (selectedScout !== "all" && assignment.assigned_to_scout_id !== selectedScout) {
        return;
      }

      // Apply search filter
      const playerName = assignment.players?.name || 'Unknown Player';
      const club = assignment.players?.club || 'Unknown Club';
      if (searchTerm && !playerName.toLowerCase().includes(searchTerm.toLowerCase()) && !club.toLowerCase().includes(searchTerm.toLowerCase())) {
        return;
      }

      const playerData = {
        id: assignment.id,
        playerName,
        club,
        position: assignment.players?.positions?.[0] || 'Unknown',
        rating: (Math.random() * 20 + 70).toFixed(1), // Mock rating for now
        assignedTo: scoutName,
        updatedAt: getUpdatedTime(assignment.status),
        lastStatusChange: getLastStatusChange(assignment.status, assignment.updated_at),
        avatar: assignment.players?.imageUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&auto=format`,
        priority: assignment.priority,
        deadline: assignment.deadline,
        scoutId: assignment.assigned_to_scout_id,
        status: assignment.status,
        playerId: assignment.player_id
      };

      if (assignment.status === 'completed') {
        newKanbanData.completed.push(playerData);
      } else {
        // All non-completed assignments go to 'assigned'
        newKanbanData.assigned.push(playerData);
      }
    });

    setKanbanData(newKanbanData);
  }, [assignments, scouts, allPlayers, selectedScout, searchTerm]);

  const getUpdatedTime = (status: string) => {
    const times = {
      'assigned': '2 days ago',
      'in_progress': '5 hours ago', 
      'completed': '1 week ago',
      'reviewed': '3 days ago'
    };
    return times[status as keyof typeof times] || '1 day ago';
  };

  const getLastStatusChange = (status: string, updatedAt: string) => {
    const timeDiff = new Date().getTime() - new Date(updatedAt).getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
    
    let timeAgo = '';
    if (daysDiff > 0) {
      timeAgo = `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
    } else if (hoursDiff > 0) {
      timeAgo = `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
    } else {
      timeAgo = 'Just now';
    }

    const statusLabels = {
      'assigned': 'Assigned',
      'in_progress': 'In Progress', 
      'completed': 'Completed',
      'reviewed': 'Under review'
    };
    
    return `${statusLabels[status as keyof typeof statusLabels] || 'Updated'} ${timeAgo}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned': return 'bg-gray-100 border-gray-200';
      case 'assigned': return 'bg-orange-100 border-orange-200';
      case 'in_progress': return 'bg-orange-100 border-orange-200';
      case 'completed': return 'bg-green-100 border-green-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const columns = [
    { id: 'unassigned', title: 'Unassigned Players', color: 'bg-gray-500', count: kanbanData.unassigned.length },
    { id: 'assigned', title: 'Assigned', color: 'bg-orange-500', count: kanbanData.assigned.length },
    { id: 'completed', title: 'Completed', color: 'bg-green-500', count: kanbanData.completed.length },
  ];

  const handleAssignmentCreated = () => {
    refetchAssignments();
  };

  const PlayerCard = ({ player }: { player: any }) => (
    <Card className={`mb-3 hover:shadow-md transition-all duration-200 border-2 ${getStatusColor(player.status)}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={player.avatar} alt={player.playerName} />
            <AvatarFallback>{player.playerName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{player.playerName}</h4>
            <p className="text-xs text-muted-foreground truncate">{player.club}</p>
            <p className="text-xs text-muted-foreground mt-1">{player.position}</p>
            
            {player.rating && player.rating !== 'N/A' && (
              <div className="flex items-center justify-end mt-2">
                <span className="text-lg font-bold text-primary">{player.rating}</span>
              </div>
            )}
            
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground">
                {player.status === 'unassigned' ? 'Available for assignment' : `Assigned to ${player.assignedTo}`}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{player.lastStatusChange}</span>
              </div>
              {player.priority && (
                <Badge 
                  variant={player.priority === 'High' ? 'destructive' : player.priority === 'Medium' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {player.priority}
                </Badge>
              )}
            </div>

            {player.status === 'unassigned' && (
              <div className="mt-3">
                <AssignPlayerDialog 
                  onAssignmentCreated={handleAssignmentCreated}
                  trigger={
                    <Button size="sm" className="w-full">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Assign Scout
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Scout Management</h1>
            <p className="text-muted-foreground mt-2">
              Assign scouts to players and track scouting progress across your team.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedScout} onValueChange={setSelectedScout}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Scouts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scouts</SelectItem>
            {scouts.map((scout) => (
              <SelectItem key={scout.id} value={scout.id}>
                {scout.first_name} {scout.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Scout Stats */}
      {scouts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Scout Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scouts.slice(0, 4).map((scout) => {
              const scoutAssignments = assignments.filter(a => a.assigned_to_scout_id === scout.id);
              const completedCount = scoutAssignments.filter(a => a.status === 'completed').length;
              const completionRate = scoutAssignments.length > 0 ? Math.round((completedCount / scoutAssignments.length) * 100) : 0;
              
              return (
                <Card key={scout.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {scout.first_name?.[0]}{scout.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {scout.first_name} {scout.last_name}
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Active tasks:</span>
                        <span className="font-semibold">{scoutAssignments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completed:</span>
                        <span className="font-semibold text-green-600">{completedCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Success rate:</span>
                        <span className="font-semibold">{completionRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-medium">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.count}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Column Content */}
            <div className="flex-1 min-h-[400px] rounded-lg p-3 bg-muted/20 border-2 border-transparent">
              {kanbanData[column.id as keyof typeof kanbanData].length > 0 ? (
                kanbanData[column.id as keyof typeof kanbanData].map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  {searchTerm || selectedScout !== "all" ? "No matching assignments" : 
                   column.id === 'unassigned' ? "No unassigned players in shortlist" :
                   column.id === 'assigned' ? "No assigned players" : "No completed assignments"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoutManagement;
