import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, Plus, Search, UserPlus, FileText, Trash2, MoreHorizontal, Download, Eye, Star, MapPin, Calendar, ArrowUpDown, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePlayersData } from "@/hooks/usePlayersData";
import { usePlayerAssignments } from "@/hooks/usePlayerAssignments";
import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import AssignScoutDialog from "@/components/AssignScoutDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Shortlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>("striker-targets");
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isAddPlayersOpen, setIsAddPlayersOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  // Sorting and filtering states
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [euGbeFilter, setEuGbeFilter] = useState<string>("all");

  const { data: allPlayers = [], isLoading } = usePlayersData();
  const { data: playerAssignments = [], refetch: refetchAssignments } = usePlayerAssignments();
  const { privatePlayers } = usePrivatePlayers();
  const queryClient = useQueryClient();

  // Create 4 focused shortlists for Chelsea's specific recruitment needs
  const shortlists = [
    {
      id: "striker-targets",
      name: "Striker Targets",
      description: "Center forwards to strengthen attack",
      color: "bg-blue-500",
      filter: (player: any) => 
        (player.positions.some((pos: string) => 
          pos?.toLowerCase().includes('st') || 
          pos?.toLowerCase().includes('cf') ||
          pos?.toLowerCase().includes('striker') ||
          pos?.toLowerCase().includes('forward')
        ) && 
        player.transferroomRating && player.transferroomRating >= 75 &&
        player.age && player.age <= 28)
    },
    {
      id: "cb-reinforcements",
      name: "Centre-Back Options",
      description: "Defensive reinforcements for back line",
      color: "bg-red-500",
      filter: (player: any) => 
        (player.positions.some((pos: string) => 
          pos?.toLowerCase().includes('cb') || 
          pos?.toLowerCase().includes('centre') ||
          pos?.toLowerCase().includes('center')
        ) && 
        player.transferroomRating && player.transferroomRating >= 70 &&
        player.age && player.age >= 22 && player.age <= 30)
    },
    {
      id: "loan-prospects",
      name: "Loan Prospects",
      description: "Young talents for loan opportunities",
      color: "bg-green-500",
      filter: (player: any) => 
        (player.age && player.age <= 22 &&
        player.futureRating && player.futureRating >= 75 &&
        player.transferroomRating && player.transferroomRating >= 60)
    },
    {
      id: "bargain-deals",
      name: "Contract Expiry Watch",  
      description: "Players with expiring contracts",
      color: "bg-purple-500",
      filter: (player: any) => {
        if (!player.contractExpiry) return false;
        const contractYear = new Date(player.contractExpiry).getFullYear();
        const currentYear = new Date().getFullYear();
        return (contractYear <= currentYear + 1 && 
                player.transferroomRating && player.transferroomRating >= 70);
      }
    }
  ];

  // Mock private players on shortlists - including Herbie Hughes
  const getPrivatePlayersForShortlist = (shortlistId: string) => {
    const mockPrivatePlayersOnShortlists = {
      "striker-targets": [
        {
          id: "private-herbie-hughes",
          name: "Herbie Hughes",
          club: "Manchester United U21",
          age: 19,
          positions: ["ST", "CF"],
          nationality: "England",
          isPrivate: true,
          profilePath: "/private-player/1f4c01f4-9548-4cbc-a10f-951eaa41aa56"
        }
      ],
      "loan-prospects": [
        {
          id: "private-herbie-hughes",
          name: "Herbie Hughes", 
          club: "Manchester United U21",
          age: 19,
          positions: ["ST", "CF"],
          nationality: "England",
          isPrivate: true,
          profilePath: "/private-player/1f4c01f4-9548-4cbc-a10f-951eaa41aa56"
        }
      ]
    };
    return mockPrivatePlayersOnShortlists[shortlistId] || [];
  };

  const currentList = shortlists.find(list => list.id === selectedList);
  const currentPublicPlayers = currentList ? allPlayers.filter(currentList.filter).slice(0, 15) : [];
  const currentPrivatePlayers = currentList ? getPrivatePlayersForShortlist(currentList.id) : [];
  
  // Combine public and private players
  const allCurrentPlayers = [
    ...currentPublicPlayers.map(p => ({ ...p, isPrivate: false, profilePath: `/player/${p.id}` })),
    ...currentPrivatePlayers
  ];
  
  // Apply search filter
  const searchFilteredPlayers = allCurrentPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.positions.some((pos: string) => pos?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Apply EU/GBE filter (only for public players)
  const euGbeFilteredPlayers = euGbeFilter === "all" 
    ? searchFilteredPlayers 
    : searchFilteredPlayers.filter(player => 
        player.isPrivate || (player.euGbeStatus || 'Pass').toLowerCase() === euGbeFilter.toLowerCase()
      );

  // Apply sorting
  const sortedPlayers = [...euGbeFilteredPlayers].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case "age":
        aValue = a.age || 0;
        bValue = b.age || 0;
        break;
      case "xtv":
        aValue = a.xtvScore || 0;
        bValue = b.xtvScore || 0;
        break;
      case "rating":
        aValue = a.transferroomRating || 0;
        bValue = b.transferroomRating || 0;
        break;
      case "potential":
        aValue = a.futureRating || 0;
        bValue = b.futureRating || 0;
        break;
      case "contract":
        aValue = a.contractExpiry ? new Date(a.contractExpiry).getTime() : 0;
        bValue = b.contractExpiry ? new Date(b.contractExpiry).getTime() : 0;
        break;
      case "name":
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatXtvScore = (score: number) => {
    return (score / 1000000).toFixed(1);
  };

  const getPlayerAssignment = (playerId: string) => {
    // Match assignment by player_id (string) with players_new.id (converted to string)
    const assignment = playerAssignments.find(assignment => assignment.player_id === playerId);
    console.log(`Looking for assignment for player ${playerId}:`, assignment);
    return assignment;
  };

  const getAssignmentBadge = (playerId: string) => {
    const assignment = getPlayerAssignment(playerId);
    if (!assignment) {
      return <Badge variant="secondary">Unassigned</Badge>;
    }

    const scoutName = assignment.assigned_to_scout ? 
      `${assignment.assigned_to_scout.first_name || ''} ${assignment.assigned_to_scout.last_name || ''}`.trim() || 
      assignment.assigned_to_scout.email : 
      'Unknown Scout';

    const statusColors = {
      'assigned': 'bg-red-100 text-red-800',
      'in_progress': 'bg-orange-100 text-orange-800', 
      'completed': 'bg-green-100 text-green-800',
      'reviewed': 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge 
        variant="outline" 
        className={`${statusColors[assignment.status]} border-0`}
      >
        {scoutName} ({assignment.status.replace('_', ' ')})
      </Badge>
    );
  };

  const getEuGbeBadge = (status: string) => {
    const colors = {
      'Pass': 'bg-green-100 text-green-800',
      'Fail': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge variant="outline" className={`${colors[status]} border-0`}>
        {status}
      </Badge>
    );
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

  const handleAssignScout = (player: any) => {
    console.log("Assigning scout to player:", player);
    setSelectedPlayer({
      id: player.id.toString(), // Convert bigint to string
      name: player.name,
      club: player.club,
      positions: player.positions
    });
    setIsAssignDialogOpen(true);
  };

  const handleAssignDialogClose = async () => {
    setIsAssignDialogOpen(false);
    setSelectedPlayer(null);
    
    // Force comprehensive refresh of all assignment-related data
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['player-assignments'] }),
      queryClient.invalidateQueries({ queryKey: ['scouting-assignments'] }),
      queryClient.invalidateQueries({ queryKey: ['my-scouting-tasks'] }),
      queryClient.refetchQueries({ queryKey: ['player-assignments'] }),
      refetchAssignments()
    ]);
    
    // Add a small delay to ensure all data is refreshed
    setTimeout(() => {
      console.log("Assignment dialog closed, comprehensive data refresh completed");
    }, 100);
  };

  const handleViewProfile = (playerId: string) => {
    console.log("Viewing profile for player:", playerId);
  };

  const handleRemovePlayer = (playerId: string) => {
    console.log("Removing player from list:", playerId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="text-center">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Chelsea FC - Recruitment Shortlists</h1>
        <p className="text-muted-foreground mt-2">
          Targeted player lists for upcoming transfer windows
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
                  Recruitment Lists
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
                {shortlists.map((list) => {
                  const publicPlayerCount = Math.min(allPlayers.filter(list.filter).length, 15);
                  const privatePlayerCount = getPrivatePlayersForShortlist(list.id).length;
                  const totalCount = publicPlayerCount + privatePlayerCount;
                  return (
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
                            {totalCount} players
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players List */}
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
                    {sortedPlayers.length} players
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleExportList}>
                    <Download className="h-4 w-4 mr-1" />
                    Export List
                  </Button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sorting and Filtering Controls */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="text-sm font-medium">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="xtv">xTV Score</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="potential">Potential</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">EU/GBE:</span>
                  <Select value={euGbeFilter} onValueChange={setEuGbeFilter}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pass">Pass</SelectItem>
                      <SelectItem value="fail">Fail</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedPlayers.map((player) => (
                  <div key={player.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Player Avatar */}
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={player.image} alt={player.name} />
                        <AvatarFallback>
                          {player.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{player.name}</h3>
                              {player.isPrivate && (
                                <Badge variant="secondary">Private Player</Badge>
                              )}
                              {!player.isPrivate && getAssignmentBadge(player.id.toString())}
                              {!player.isPrivate && getEuGbeBadge(player.euGbeStatus || 'Pass')}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {player.club}
                              </span>
                              <span>{player.positions.join(', ')}</span>
                              {player.age && <span>{player.age} years</span>}
                              <span>{player.nationality}</span>
                            </div>
                            {!player.isPrivate && (
                              <div className="flex items-center gap-4 text-sm">
                                {player.transferroomRating && (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    Rating: {player.transferroomRating}/100
                                  </span>
                                )}
                                {player.futureRating && (
                                  <span className="text-green-600">
                                    Potential: {player.futureRating}
                                  </span>
                                )}
                                {player.xtvScore && (
                                  <span className="text-blue-600">
                                    xTV: £{formatXtvScore(player.xtvScore)}M
                                  </span>
                                )}
                                {player.contractExpiry && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Contract: {new Date(player.contractExpiry).getFullYear()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {!player.isPrivate && !getPlayerAssignment(player.id.toString()) ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAssignScout(player)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Assign Scout
                            </Button>
                          ) : !player.isPrivate && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAssignScout(player)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Reassign Scout
                            </Button>
                          )}
                          <Link to={player.profilePath}>
                            <Button 
                              size="sm" 
                              variant="outline"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                          </Link>
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
                                onClick={() => handleRemovePlayer(player.id.toString())}
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

              {sortedPlayers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    No players found matching your criteria
                  </div>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setEuGbeFilter("all");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Scout Dialog */}
      <AssignScoutDialog
        isOpen={isAssignDialogOpen}
        onClose={handleAssignDialogClose}
        player={selectedPlayer}
      />
    </div>
  );
};

export default Shortlists;
