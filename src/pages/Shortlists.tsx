
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { usePlayersData } from "@/hooks/usePlayersData";
import { usePlayerAssignments } from "@/hooks/usePlayerAssignments";
import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import AssignScoutDialog from "@/components/AssignScoutDialog";
import { useQueryClient } from "@tanstack/react-query";
import { ShortlistsSidebar } from "@/components/shortlists/ShortlistsSidebar";
import { ShortlistsContent } from "@/components/shortlists/ShortlistsContent";

const Shortlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>("striker-targets");
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

  const handleExportList = () => {
    console.log("Exporting list:", currentList?.name);
  };

  const handleAssignScout = (player: any) => {
    console.log("Assigning scout to player:", player);
    setSelectedPlayer({
      id: player.id.toString(),
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
          <ShortlistsSidebar
            shortlists={shortlists}
            selectedList={selectedList}
            onSelectList={setSelectedList}
            allPlayers={allPlayers}
            getPrivatePlayersForShortlist={getPrivatePlayersForShortlist}
          />
        </div>

        {/* Players List */}
        <div className="lg:col-span-3">
          <ShortlistsContent
            currentList={currentList}
            sortedPlayers={sortedPlayers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            euGbeFilter={euGbeFilter}
            onEuGbeFilterChange={setEuGbeFilter}
            getAssignmentBadge={getAssignmentBadge}
            getEuGbeBadge={getEuGbeBadge}
            getPlayerAssignment={getPlayerAssignment}
            formatXtvScore={formatXtvScore}
            onAssignScout={handleAssignScout}
            onRemovePlayer={handleRemovePlayer}
            onExportList={handleExportList}
          />
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
