
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, Plus, Search, UserPlus, FileText, Trash2, MoreHorizontal, Download, Eye, Star, MapPin, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Shortlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>("premier-league-targets");
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isAddPlayersOpen, setIsAddPlayersOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  // Enhanced mock data with more detailed player information
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
    },
    {
      id: "defensive-targets",
      name: "Defensive Targets",
      description: "Centre-back and full-back options",
      playerCount: 6,
      lastUpdated: "5 days ago",
      color: "bg-red-500"
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
      marketValue: "€65M",
      status: "Available",
      contractExpiry: "2025",
      appearances: "28 apps",
      goals: 7,
      assists: 4,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "2",
      name: "Declan Rice",
      club: "West Ham United",
      position: "Defensive Midfielder",
      age: 24,
      nationality: "England",
      rating: 8.5,
      marketValue: "€80M",
      status: "Monitored",
      contractExpiry: "2024",
      appearances: "32 apps",
      goals: 3,
      assists: 2,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "Bukayo Saka",
      club: "Arsenal",
      position: "Right Winger",
      age: 22,
      nationality: "England",
      rating: 8.8,
      marketValue: "€90M",
      status: "Priority",
      contractExpiry: "2027",
      appearances: "35 apps",
      goals: 12,
      assists: 8,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "4",
      name: "Jamal Musiala",
      club: "Bayern Munich",
      position: "Attacking Midfielder",
      age: 21,
      nationality: "Germany",
      rating: 8.6,
      marketValue: "€100M",
      status: "Available",
      contractExpiry: "2026",
      appearances: "29 apps",
      goals: 9,
      assists: 6,
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const currentList = shortlists.find(list => list.id === selectedList);
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'secondary';
      case 'Monitored': return 'default';
      case 'Priority': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      console.log("Creating new list:", newListName, newListDescription);
      setIsCreateListOpen(false);
      setNewListName("");
      setNewListDescription("");
    }
  };

  const handleExportList = () => {
    console.log("Exporting list:", currentList?.name);
  };

  const handleAssignScout = (playerId: string) => {
    console.log("Assigning scout to player:", playerId);
  };

  const handleViewProfile = (playerId: string) => {
    console.log("Viewing profile for player:", playerId);
  };

  const handleRemovePlayer = (playerId: string) => {
    console.log("Removing player from list:", playerId);
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
        {/* Enhanced Shortlists Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  My Lists
                </CardTitle>
                <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
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
                      <Input 
                        placeholder="List name" 
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                      />
                      <Input 
                        placeholder="Description (optional)" 
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                      />
                      <Button className="w-full" onClick={handleCreateList}>
                        Create List
                      </Button>
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

        {/* Enhanced Players List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>{currentList?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentList?.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {currentList?.playerCount} players
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleExportList}>
                    <Download className="h-4 w-4 mr-1" />
                    Export List
                  </Button>
                  <Dialog open={isAddPlayersOpen} onOpenChange={setIsAddPlayersOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Players
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Players to {currentList?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Search players to add..." />
                        <p className="text-sm text-muted-foreground">
                          Search and select players to add to this shortlist
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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
                  <div key={player.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Player Avatar */}
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={player.image} alt={player.name} />
                        <AvatarFallback>
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{player.name}</h3>
                              <Badge variant={getStatusBadgeVariant(player.status)}>
                                {player.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {player.club}
                              </span>
                              <span>{player.position}</span>
                              <span>{player.age} years</span>
                              <span>{player.nationality}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                Rating: {player.rating}/10
                              </span>
                              <span className="font-medium text-green-600">
                                {player.marketValue}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Contract: {player.contractExpiry}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                          <span>{player.appearances}</span>
                          <span>{player.goals} goals</span>
                          <span>{player.assists} assists</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAssignScout(player.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Assign Scout
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewProfile(player.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
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
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleRemovePlayer(player.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from list
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPlayers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    No players found in this shortlist
                  </div>
                  <Button onClick={() => setIsAddPlayersOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Players
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

export default Shortlists;
