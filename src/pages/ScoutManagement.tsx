
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for kanban board
const mockKanbanData = {
  assigned: [
    {
      id: "1",
      playerName: "Marcus Johnson",
      club: "Brighton & Hove Albion",
      position: "Right Back",
      rating: 76.8,
      assignedTo: "Sarah Williams",
      updatedAt: "2 days ago",
      avatar: "/placeholder.svg"
    },
    {
      id: "2",
      playerName: "Ahmed Hassan",
      club: "Al Ahly",
      position: "Winger",
      rating: 75.6,
      assignedTo: "Sarah Williams",
      updatedAt: "3 days ago",
      avatar: "/placeholder.svg"
    }
  ],
  in_progress: [
    {
      id: "3",
      playerName: "Luis Rodriguez",
      club: "Real Sociedad",
      position: "Central Midfielder",
      rating: 82.3,
      assignedTo: "James Mitchell",
      updatedAt: "5 hours ago",
      avatar: "/placeholder.svg"
    }
  ],
  under_review: [],
  completed: [
    {
      id: "4",
      playerName: "Viktor Petrov",
      club: "Dynamo Kiev",
      position: "Centre Forward",
      rating: null,
      assignedTo: "Emma Thompson",
      updatedAt: "1 week ago",
      avatar: "/placeholder.svg"
    }
  ]
};

const ScoutManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScout, setSelectedScout] = useState("all");
  const [kanbanData, setKanbanData] = useState(mockKanbanData);

  const columns = [
    { id: 'assigned', title: 'Assigned', color: 'bg-red-500', count: kanbanData.assigned.length },
    { id: 'in_progress', title: 'In Progress', color: 'bg-orange-500', count: kanbanData.in_progress.length },
    { id: 'under_review', title: 'Under Review', color: 'bg-blue-500', count: kanbanData.under_review.length },
    { id: 'completed', title: 'Completed', color: 'bg-green-500', count: kanbanData.completed.length },
  ];

  const handleMoveForward = (playerId: string, currentColumn: string) => {
    const columnOrder = ['assigned', 'in_progress', 'under_review', 'completed'];
    const currentIndex = columnOrder.indexOf(currentColumn);
    const nextColumn = columnOrder[currentIndex + 1];
    
    if (nextColumn) {
      setKanbanData(prev => {
        const newData = { ...prev };
        const playerIndex = newData[currentColumn as keyof typeof newData].findIndex(p => p.id === playerId);
        const player = newData[currentColumn as keyof typeof newData][playerIndex];
        
        // Remove from current column
        newData[currentColumn as keyof typeof newData] = newData[currentColumn as keyof typeof newData].filter(p => p.id !== playerId);
        
        // Add to next column
        newData[nextColumn as keyof typeof newData] = [...newData[nextColumn as keyof typeof newData], player];
        
        return newData;
      });
    }
  };

  const PlayerCard = ({ player, columnId }: { player: any, columnId: string }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
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
                <span className="text-lg font-bold text-purple-600">{player.rating}</span>
              </div>
            )}
            
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground">Assigned to {player.assignedTo}</p>
              <p className="text-xs text-muted-foreground">Updated {player.updatedAt}</p>
            </div>
            
            {columnId !== 'completed' && (
              <Button 
                size="sm" 
                className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                onClick={() => handleMoveForward(player.id, columnId)}
              >
                Move Forward
              </Button>
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
              Manage player assignments and track scouting progress
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
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
            <div className="flex-1 min-h-[400px] bg-gray-50 rounded-lg p-3">
              {kanbanData[column.id as keyof typeof kanbanData].length > 0 ? (
                kanbanData[column.id as keyof typeof kanbanData].map((player) => (
                  <PlayerCard key={player.id} player={player} columnId={column.id} />
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No players in this stage
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
