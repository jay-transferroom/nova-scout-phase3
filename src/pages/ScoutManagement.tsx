import { useState, useEffect } from "react";
import { useScoutingAssignments } from "@/hooks/useScoutingAssignments";
import { useScoutUsers } from "@/hooks/useScoutUsers";
import { usePlayersData } from "@/hooks/usePlayersData";
import { useReports } from "@/hooks/useReports";
import AssignScoutDialog from "@/components/AssignScoutDialog";
import ScoutManagementHeader from "@/components/scout-management/ScoutManagementHeader";
import ScoutManagementFilters from "@/components/scout-management/ScoutManagementFilters";
import ScoutPerformanceGrid from "@/components/scout-management/ScoutPerformanceGrid";
import KanbanColumn from "@/components/scout-management/KanbanColumn";

const ScoutManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScout, setSelectedScout] = useState("all");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [kanbanData, setKanbanData] = useState({
    shortlisted: [] as any[],
    assigned: [] as any[],
    completed: [] as any[]
  });

  const { data: assignments = [], refetch: refetchAssignments } = useScoutingAssignments();
  const { data: scouts = [] } = useScoutUsers();
  const { data: allPlayers = [] } = usePlayersData();
  const { reports = [] } = useReports();

  // Transform assignments and shortlisted players into kanban format
  useEffect(() => {
    console.log('Scout Management - Assignments:', assignments.length);  
    console.log('Scout Management - Scouts:', scouts.length);
    console.log('Scout Management - All Players:', allPlayers.length);
    console.log('Scout Management - Reports:', reports.length);

    const newKanbanData = {
      shortlisted: [] as any[],
      assigned: [] as any[],
      completed: [] as any[]
    };

    // Get assigned player IDs
    const assignedPlayerIds = new Set(assignments.map(a => a.player_id));

    // Create a map of player reports for quick lookup
    const playerReportsMap = new Map();
    reports.forEach(report => {
      if (report.playerId) {
        playerReportsMap.set(report.playerId, report);
      }
    });

    // Show ONLY unassigned shortlisted players (using first 25 players as shortlist, filtered to unassigned only)
    const unassignedShortlistedPlayers = allPlayers
      .slice(0, 25)
      .filter(player => !assignedPlayerIds.has(player.id.toString())) // Only unassigned players
      .map(player => ({
        id: `shortlisted-${player.id}`,
        playerName: player.name,
        club: player.club,
        position: player.positions?.[0] || 'Unknown',
        rating: player.transferroomRating?.toFixed(1) || 'N/A',
        assignedTo: 'Unassigned',
        updatedAt: 'Available for assignment',
        lastStatusChange: 'Available for assignment',
        avatar: player.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&auto=format`,
        priority: null,
        deadline: null,
        scoutId: null,
        status: 'shortlisted',
        playerId: player.id.toString()
      }));

    // Apply search filter to shortlisted players
    const filteredShortlisted = searchTerm 
      ? unassignedShortlistedPlayers.filter(player => 
          player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.club.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : unassignedShortlistedPlayers;

    newKanbanData.shortlisted = filteredShortlisted;

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

      // Check if there's a report for this player - if so, mark as completed
      const hasReport = playerReportsMap.has(assignment.player_id);
      const effectiveStatus = hasReport ? 'completed' : assignment.status;

      const playerData = {
        id: assignment.id,
        playerName,
        club,
        position: assignment.players?.positions?.[0] || 'Unknown',
        rating: (Math.random() * 20 + 70).toFixed(1), // Mock rating for now
        assignedTo: scoutName,
        updatedAt: getUpdatedTime(effectiveStatus),
        lastStatusChange: getLastStatusChange(effectiveStatus, assignment.updated_at),
        avatar: assignment.players?.imageUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&auto=format`,
        priority: assignment.priority,
        deadline: assignment.deadline,
        scoutId: assignment.assigned_to_scout_id,
        status: effectiveStatus,
        playerId: assignment.player_id
      };

      if (effectiveStatus === 'completed') {
        newKanbanData.completed.push(playerData);
      } else {
        // All non-completed assignments go to 'assigned'
        newKanbanData.assigned.push(playerData);
      }
    });

    setKanbanData(newKanbanData);
  }, [assignments, scouts, allPlayers, reports, selectedScout, searchTerm]);

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

  const columns = [
    { id: 'shortlisted', title: 'Shortlisted Players', color: 'bg-blue-500', count: kanbanData.shortlisted.length },
    { id: 'assigned', title: 'Assigned', color: 'bg-orange-500', count: kanbanData.assigned.length },
    { id: 'completed', title: 'Completed', color: 'bg-green-500', count: kanbanData.completed.length },
  ];

  const handleAssignmentCreated = () => {
    refetchAssignments();
    setIsAssignDialogOpen(false);
    setSelectedPlayer(null);
  };

  const handleAssignScout = (player: any) => {
    // Find the original player data from allPlayers to get the full player object
    const originalPlayer = allPlayers.find(p => p.id.toString() === player.playerId);
    if (originalPlayer) {
      setSelectedPlayer({
        id: originalPlayer.id.toString(),
        name: originalPlayer.name,
        club: originalPlayer.club,
        positions: originalPlayer.positions
      });
      setIsAssignDialogOpen(true);
    }
  };

  const handleAssignDialogClose = () => {
    setIsAssignDialogOpen(false);
    setSelectedPlayer(null);
    refetchAssignments();
  };

  const handleScoutClick = (scoutId: string) => {
    setSelectedScout(scoutId);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <ScoutManagementHeader />

      <ScoutManagementFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedScout={selectedScout}
        setSelectedScout={setSelectedScout}
        scouts={scouts}
      />

      <ScoutPerformanceGrid
        scouts={scouts}
        assignments={assignments}
        selectedScout={selectedScout}
        onScoutClick={handleScoutClick}
      />

      {/* Status Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            players={kanbanData[column.id as keyof typeof kanbanData]}
            searchTerm={searchTerm}
            selectedScout={selectedScout}
            onAssignScout={column.id === 'shortlisted' ? handleAssignScout : undefined}
          />
        ))}
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

export default ScoutManagement;
