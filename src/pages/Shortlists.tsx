import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, Plus, Search, UserPlus, FileText, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Shortlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>("premier-league-targets");

  // Mock data - this would come from your data source
  const shortlists = [
    {
      id: "premier-league-targets",
      name: "Premier League Targets",
      description: "Top prospects from Premier League clubs",
      playerCount: 12,
      lastUpdated: "2 days ago",
      color: "bg-blue-500"
    },
    {
      id: "young-talents",
      name: "Young Talents U23",
      description: "Promising players under 23 years old",
      playerCount: 8,
      lastUpdated: "1 week ago",
      color: "bg-green-500"
    },
    {
      id: "midfield-options",
      name: "Midfield Options",
      description: "Central midfield reinforcements",
      playerCount: 15,
      lastUpdated: "3 days ago",
      color: "bg-purple-500"
    }
  ];

  const players = [
    {
      id: "1",
      name: "Mason Mount",
      club: "Chelsea",
      position: "Attacking Midfielder",
      age: 25,
      nationality: "England",
      rating: 8.2,
      status: "Available"
    },
    {
      id: "2",
      name: "Declan Rice",
      club: "West Ham United",
      position: "Defensive Midfielder",
      age: 24,
      nationality: "England",
      rating: 8.5,
      status: "Monitored"
    },
    {
      id: "3",
      name: "Bukayo Saka",
      club: "Arsenal",
      position: "Right Winger",
      age: 22,
      nationality: "England",
      rating: 8.8,
      status: "Priority"
    }
  ];

  const currentList = shortlists.find(list => list.id === selectedList);
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'secondary';
      case 'Monitored': return 'default';
      case 'Priority': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shortlists</h1>
        <p className="text-muted-foreground mt-2">
          Manage your player shortlists and take quick actions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Shortlists Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  My Lists
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Shortlist</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="List name" />
                      <Input placeholder="Description (optional)" />
                      <Button className="w-full">Create List</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {shortlists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedList(list.id)}
                    className={cn(
                      "w-full p-3 text-left hover:bg-muted/50 transition-colors",
                      selectedList === list.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", list.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{list.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {list.playerCount} players • {list.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentList?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentList?.description}
                  </p>
                </div>
                <Badge variant="outline">
                  {currentList?.playerCount} players
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face`} />
                      <AvatarFallback>
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{player.name}</h3>
                        <Badge variant={getStatusBadgeVariant(player.status)}>
                          {player.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {player.position} • {player.club} • {player.age} years • {player.nationality}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        Rating: {player.rating}/10
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Bookmark className="h-4 w-4 mr-2" />
                            Move to list
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove from list
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No players found in this shortlist
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shortlists;
