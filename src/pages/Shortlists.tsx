import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePlayersData } from "@/hooks/usePlayersData";
import { useScoutingAssignments } from "@/hooks/useScoutingAssignments";
import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import { useShortlists } from "@/hooks/useShortlists";
import { useReports } from "@/hooks/useReports";
import AssignScoutDialog from "@/components/AssignScoutDialog";
import { useQueryClient } from "@tanstack/react-query";
import { ShortlistsSidebar } from "@/components/shortlists/ShortlistsSidebar";
import { ShortlistsContent } from "@/components/shortlists/ShortlistsContent";
import { ShortlistsHeader } from "@/components/shortlists/ShortlistsPageHeader";
import { useShortlistsLogic } from "@/hooks/useShortlistsLogic";

const Shortlists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Sorting and filtering states
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [euGbeFilter, setEuGbeFilter] = useState<string>("all");

  const { data: allPlayers = [], isLoading } = usePlayersData();
  const { data: assignments = [], refetch: refetchAssignments } = useScoutingAssignments();
  const { reports = [] } = useReports();
  const { privatePlayers } = usePrivatePlayers();
  const { shortlists, createShortlist, updateShortlist, deleteShortlist, addPlayerToShortlist, removePlayerFromShortlist, getPlayerShortlists, refreshShortlists } = useShortlists();
  const queryClient = useQueryClient();

  const shortlistsLogic = useShortlistsLogic({
    allPlayers,
    assignments,
    reports,
    selectedList,
    searchTerm,
    sortBy,
    sortOrder,
    euGbeFilter,
    shortlists,
    privatePlayers
  });

  // Handle URL parameters for selected shortlist - exclude scouting assignment list
  useEffect(() => {
    const filteredShortlists = shortlists.filter(list => !list.is_scouting_assignment_list);
    const selectedParam = searchParams.get('selected');
    
    if (selectedParam && filteredShortlists.find(list => list.id === selectedParam)) {
      setSelectedList(selectedParam);
    } else if (!selectedList && filteredShortlists.length > 0) {
      setSelectedList(filteredShortlists[0].id);
    } else if (selectedList && !filteredShortlists.find(list => list.id === selectedList)) {
      // If current selection is the scouting list, select first available list
      setSelectedList(filteredShortlists.length > 0 ? filteredShortlists[0].id : null);
    }
  }, [searchParams, shortlists, selectedList]);

  const handleExportList = () => {
    console.log("Exporting list:", shortlistsLogic.currentList?.name);
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
      queryClient.invalidateQueries({ queryKey: ['scouting-assignments'] }),
      refetchAssignments(),
      refreshShortlists()
    ]);
    
    // Add a small delay to ensure all data is refreshed
    setTimeout(() => {
      console.log("Assignment dialog closed, comprehensive data refresh completed");
    }, 100);
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (selectedList) {
      await removePlayerFromShortlist(selectedList, playerId);
      // Refresh shortlists data to ensure UI updates
      await refreshShortlists();
    }
  };

  const handleCreateShortlist = async (name: string, playerIds: string[]) => {
    await createShortlist(name, playerIds);
  };

  const handleAddPlayersToShortlist = (playerIds: string[]) => {
    if (selectedList) {
      playerIds.forEach(playerId => {
        addPlayerToShortlist(selectedList, playerId);
      });
    }
  };

  const handleUpdateShortlist = async (id: string, name: string) => {
    updateShortlist(id, { name });
  };

  const handleDeleteShortlist = async (id: string) => {
    deleteShortlist(id);
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
      <ShortlistsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Shortlists Sidebar */}
        <div className="lg:col-span-1">
          <ShortlistsSidebar
            shortlists={shortlists}
            selectedList={selectedList}
            onSelectList={setSelectedList}
            allPlayers={allPlayers}
            privatePlayers={privatePlayers}
            onCreateShortlist={handleCreateShortlist}
            onUpdateShortlist={handleUpdateShortlist}
            onDeleteShortlist={handleDeleteShortlist}
          />
        </div>

        {/* Players List */}
        <div className="lg:col-span-3">
          <ShortlistsContent
            currentList={shortlistsLogic.currentList}
            sortedPlayers={shortlistsLogic.sortedPlayers}
            allPlayers={allPlayers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            euGbeFilter={euGbeFilter}
            onEuGbeFilterChange={setEuGbeFilter}
            getAssignmentBadge={shortlistsLogic.getAssignmentBadge}
            getEuGbeBadge={shortlistsLogic.getEuGbeBadge}
            getPlayerAssignment={shortlistsLogic.getPlayerAssignment}
            formatXtvScore={shortlistsLogic.formatXtvScore}
            onAssignScout={handleAssignScout}
            onRemovePlayer={handleRemovePlayer}
            onExportList={handleExportList}
            onAddPlayersToShortlist={handleAddPlayersToShortlist}
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
