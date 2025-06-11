
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlayersData } from "@/hooks/usePlayersData";
import { useMyScoutingTasks } from "@/hooks/useMyScoutingTasks";

const ScoutManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScout, setSelectedScout] = useState("all");
  const [kanbanData, setKanbanData] = useState({
    assigned: [] as any[],
    in_progress: [] as any[],
    under_review: [] as any[],
    completed: [] as any[]
  });
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const { data: players = [] } = usePlayersData();
  const { data: assignments = [] } = useMyScoutingTasks();

  // Transform assignments and players into kanban format
  useEffect(() => {
    console.log('Scout Management - Players:', players.length);
    console.log('Scout Management - Assignments:', assignments.length);

    const newKanbanData = {
      assigned: [] as any[],
      in_progress: [] as any[],
      under_review: [] as any[],
      completed: [] as any[]
    };

    // Add real assignments to appropriate columns
    assignments.forEach((assignment) => {
      const playerData = {
        id: assignment.id,
        playerName: assignment.players?.name || 'Unknown Player',
        club: assignment.players?.club || 'Unknown Club',
        position: assignment.players?.positions?.[0] || 'Unknown',
        rating: (Math.random() * 20 + 70).toFixed(1), // Mock rating for now
        assignedTo: assignment.assigned_to_scout?.first_name 
          ? `${assignment.assigned_to_scout.first_name} ${assignment.assigned_to_scout.last_name || ''}`.trim()
          : assignment.assigned_to_scout?.email || 'Unknown Scout',
        updatedAt: getUpdatedTime(assignment.status),
        avatar: assignment.players?.name 
          ? `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&auto=format`
          : "/placeholder.svg",
        priority: assignment.priority,
        deadline: assignment.deadline
      };

      if (assignment.status === 'assigned') {
        newKanbanData.assigned.push(playerData);
      } else if (assignment.status === 'in_progress') {
        newKanbanData.in_progress.push(playerData);
      } else if (assignment.status === 'reviewed') {
        newKanbanData.under_review.push(playerData);
      } else if (assignment.status === 'completed') {
        newKanbanData.completed.push(playerData);
      }
    });

    // If we have fewer than 8 total assignments, add some mock ones using real players
    const totalAssignments = Object.values(newKanbanData).flat().length;
    if (totalAssignments < 8 && players.length > 0) {
      const mockStatuses = ['assigned', 'in_progress', 'under_review', 'completed'] as const;
      const mockScouts = ['Sarah Williams', 'James Mitchell', 'Emma Thompson', 'David Johnson'];
      
      const availablePlayers = players.slice(0, 8 - totalAssignments);
      
      availablePlayers.forEach((player, index) => {
        const status = mockStatuses[index % 4];
        const mockPlayer = {
          id: `mock-${player.id}`,
          playerName: player.name,
          club: player.club,
          position: player.positions[0] || 'Unknown',
          rating: player.recentForm?.rating?.toFixed(1) || (Math.random() * 20 + 70).toFixed(1),
          assignedTo: mockScouts[index % mockScouts.length],
          updatedAt: getUpdatedTime(status),
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&auto=format`,
          priority: ['High', 'Medium', 'Low'][index % 3],
          deadline: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        newKanbanData[status].push(mockPlayer);
      });
    }

    setKanbanData(newKanbanData);
  }, [players, assignments]);

  const getUpdatedTime = (status: string) => {
    const times = {
      'assigned': '2 days ago',
      'in_progress': '5 hours ago', 
      'completed': '1 week ago',
      'reviewed': '3 days ago'
    };
    return times[status as keyof typeof times] || '1 day ago';
  };

  const columns = [
    { id: 'assigned', title: 'Assigned', color: 'bg-red-500', count: kanbanData.assigned.length },
    { id: 'in_progress', title: 'In Progress', color: 'bg-orange-500', count: kanbanData.in_progress.length },
    { id: 'under_review', title: 'Under Review', color: 'bg-blue-500', count: kanbanData.under_review.length },
    { id: 'completed', title: 'Completed', color: 'bg-green-500', count: kanbanData.completed.length },
  ];

  const movePlayer = (playerId: string, fromColumn: string, toColumn: string) => {
    setKanbanData(prev => {
      const newData = { ...prev };
      const playerIndex = newData[fromColumn as keyof typeof newData].findIndex(p => p.id === playerId);
      const player = newData[fromColumn as keyof typeof newData][playerIndex];
      
      // Remove from current column
      newData[fromColumn as keyof typeof newData] = newData[fromColumn as keyof typeof newData].filter(p => p.id !== playerId);
      
      // Add to new column
      newData[toColumn as keyof typeof newData] = [...newData[toColumn as keyof typeof newData], player];
      
      return newData;
    });
  };

  const handleDragStart = (e: React.DragEvent, playerId: string, columnId: string) => {
    setDraggedPlayer(playerId);
    e.dataTransfer.setData('text/plain', JSON.stringify({ playerId, sourceColumn: columnId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { playerId, sourceColumn } = data;
    
    if (sourceColumn !== targetColumn) {
      movePlayer(playerId, sourceColumn, targetColumn);
    }
    setDraggedPlayer(null);
    setDragOverColumn(null);
  };

  const PlayerCard = ({ player, columnId }: { player: any, columnId: string }) => (
    <Card 
      className={`mb-3 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-2 ${
        draggedPlayer === player.id 
          ? 'opacity-50 border-success-400 scale-105' 
          : 'border-transparent hover:border-success-200'
      }`}
      draggable
      onDragStart={(e) => handleDragStart(e, player.id, columnId)}
    >
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
            
            {player.rating && (
              <div className="flex items-center justify-end mt-2">
                <span className="text-lg font-bold text-success-600">{player.rating}</span>
              </div>
            )}
            
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground">Assigned to {player.assignedTo}</p>
              <p className="text-xs text-muted-foreground">Updated {player.updatedAt}</p>
            </div>
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
              Manage player assignments and track scouting progress. Drag cards between columns to update status.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Assign Player
          </Button>
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Scouts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scouts</SelectItem>
            <SelectItem value="sarah">Sarah Williams</SelectItem>
            <SelectItem value="james">James Mitchell</SelectItem>
            <SelectItem value="emma">Emma Thompson</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
            <div 
              className={`flex-1 min-h-[400px] rounded-lg p-3 transition-all duration-200 ${
                dragOverColumn === column.id 
                  ? 'bg-success-50 border-2 border-success-300 border-dashed' 
                  : 'bg-gray-50 border-2 border-transparent'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {kanbanData[column.id as keyof typeof kanbanData].length > 0 ? (
                kanbanData[column.id as keyof typeof kanbanData].map((player) => (
                  <PlayerCard key={player.id} player={player} columnId={column.id} />
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-gray-300 rounded-lg">
                  Drag players here
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
