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
import { usePlayersData } from "@/hooks/usePlayersData";
import AssignScoutDialog from "@/components/AssignScoutDialog";

const Shortlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>("striker-targets");
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isAddPlayersOpen, setIsAddPlayersOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { data: allPlayers = [], isLoading } = usePlayersData();

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

  const currentList = shortlists.find(list => list.id === selectedList);
  const currentPlayers = currentList ? allPlayers.filter(currentList.filter).slice(0, 15) : []; // Limit to 15 players per list
  
  const filteredPlayers = currentPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.positions.some((pos: string) => pos?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    setSelectedPlayer({
      id: player.id,
      name: player.name,
      club: player.club,
      positions: player.positions
    });
    setIsAssignDialogOpen(true);
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
                  const playerCount = Math.min(allPlayers.filter(list.filter).length, 15);
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
                            {playerCount} players
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
                    {filteredPlayers.length} players
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleExportList}>
                    <Download className="h-4 w-4 mr-1" />
                    Export List
                  </Button>
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
                          {player.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{player.name}</h3>
                              <Badge variant="secondary">Unassigned</Badge>
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
                              {player.contractExpiry && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Contract: {new Date(player.contractExpiry).getFullYear()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAssignScout(player)}
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
                    No players found matching your criteria
                  </div>
                  <Button onClick={() => setSearchTerm("")}>
                    Clear Search
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
        onClose={() => setIsAssignDialogOpen(false)}
        player={selectedPlayer}
      />
    </div>
  );
};

export default Shortlists;
