import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScoutingAssignments } from "@/hooks/useScoutingAssignments";
import { useScoutUsers } from "@/hooks/useScoutUsers";
import { useShortlists } from "@/hooks/useShortlists";
import { useUnifiedPlayersData } from "@/hooks/useUnifiedPlayersData";
import { useReports } from "@/hooks/useReports";
import AssignScoutDialog from "@/components/AssignScoutDialog";
import { Button } from "@/components/ui/button";
import ScoutManagementHeader from "@/components/scout-management/ScoutManagementHeader";
import ScoutManagementFilters from "@/components/scout-management/ScoutManagementFilters";
import ScoutPerformanceGrid from "@/components/scout-management/ScoutPerformanceGrid";
import KanbanColumn from "@/components/scout-management/KanbanColumn";
import ReviewedAssignmentsModal from "@/components/scout-management/ReviewedAssignmentsModal";
import ScoutManagementViewToggle from "@/components/scout-management/ScoutManagementViewToggle";
import ScoutManagementTableView from "@/components/scout-management/ScoutManagementTableView";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ScoutManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScout, setSelectedScout] = useState("all");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isReviewedModalOpen, setIsReviewedModalOpen] = useState(false);
  const [reviewedAssignments, setReviewedAssignments] = useState<any[]>([]);
  const [kanbanData, setKanbanData] = useState({
    shortlisted: [] as any[],
    assigned: [] as any[],
    completed: [] as any[]
  });

  // View toggle with localStorage persistence
  const [currentView, setCurrentView] = useState<'kanban' | 'table'>(() => {
    const saved = localStorage.getItem('scoutManagementView');
    return (saved === 'table' || saved === 'kanban') ? saved : 'kanban';
  });

  const handleViewChange = (view: 'kanban' | 'table') => {
    setCurrentView(view);
    localStorage.setItem('scoutManagementView', view);
  };

  // Using the consolidated data source
  const { data: assignments = [], refetch: refetchAssignments, isLoading: assignmentsLoading } = useScoutingAssignments();
  const { data: scouts = [] } = useScoutUsers();
  const { data: allPlayers = [], isLoading: playersLoading } = useUnifiedPlayersData();
  const { reports = [], loading: reportsLoading } = useReports();
  const { shortlists, loading: shortlistsLoading } = useShortlists();

  const isLoading = assignmentsLoading || playersLoading || reportsLoading || shortlistsLoading;

  // Fetch reviewed assignments
  useEffect(() => {
    const fetchReviewedAssignments = async () => {
      try {
        const { data, error } = await supabase
          .from('scouting_assignments')
          .select(`
            *,
            assigned_to_scout:profiles!assigned_to_scout_id(*)
          `)
          .eq('status', 'reviewed')
          .not('reviewed_at', 'is', null);

        if (error) {
          console.error('Error fetching reviewed assignments:', error);
          return;
        }

        const reviewedData = data?.map(assignment => {
          // Find player data from our unified players data
          const playerData = allPlayers.find(p => {
            const playerId = p.isPrivatePlayer ? p.id : p.id.toString();
            return playerId === assignment.player_id;
          });

          return {
            id: assignment.id,
            playerName: playerData?.name || 'Unknown Player',
            club: playerData?.club || 'Unknown Club',
            position: playerData?.positions?.[0] || 'Unknown',
            assignedTo: assignment.assigned_to_scout?.first_name 
              ? `${assignment.assigned_to_scout.first_name} ${assignment.assigned_to_scout.last_name || ''}`.trim()
              : assignment.assigned_to_scout?.email || 'Unknown Scout',
            avatar: playerData?.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&auto=format`,
            priority: assignment.priority,
            status: assignment.status,
            playerId: assignment.player_id,
            reviewed_at: assignment.reviewed_at
          };
        }) || [];

        setReviewedAssignments(reviewedData);
      } catch (error) {
        console.error('Error in fetchReviewedAssignments:', error);
      }
    };

    if (!isLoading && allPlayers.length > 0) {
      fetchReviewedAssignments();
    }
  }, [assignments, allPlayers, isLoading]);

  // Move scoutingAssignmentList outside useEffect to avoid dependency issues
  const scoutingAssignmentList = shortlists.find(shortlist => shortlist.is_scouting_assignment_list);

  // Transform assignments and shortlisted players into kanban format
  useEffect(() => {
    if (isLoading) return;

    console.log('Scout Management - Using consolidated assignments:', assignments.length);  
    console.log('Scout Management - Scouts:', scouts.length);
    console.log('Scout Management - All Players:', allPlayers.length);
    console.log('Scout Management - Reports:', reports.length);

    const newKanbanData = {
      shortlisted: [] as any[],
      assigned: [] as any[],
      completed: [] as any[]
    };

    // Get assigned player IDs from the consolidated source
    const assignedPlayerIds = new Set(assignments.map(a => a.player_id));

    // Create a map of player reports for quick lookup
    const playerReportsMap = new Map();
    reports.forEach(report => {
      if (report.playerId) {
        playerReportsMap.set(report.playerId, report);
      }
    });

    console.log('Player reports map size:', playerReportsMap.size);

    const scoutingAssignmentPlayerIds = new Set<string>(
      scoutingAssignmentList?.playerIds || []
    );

    console.log('Scouting assignment list:', scoutingAssignmentList);
    console.log('Scouting assignment player IDs:', Array.from(scoutingAssignmentPlayerIds));

    // Create assigned for scouting players from the dedicated list
    const scoutingAssignmentPlayers = allPlayers
      .filter(player => {
        const playerId = player.isPrivatePlayer ? player.id : player.id.toString();
        return scoutingAssignmentPlayerIds.has(playerId) && !assignedPlayerIds.has(playerId);
      })
      .map(player => ({
        id: `scouting-assignment-${player.id}`,
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
        playerId: player.isPrivatePlayer ? player.id : player.id.toString()
      }));

    // Apply search filter to scouting assignment players
    const filteredScoutingAssignment = searchTerm 
      ? scoutingAssignmentPlayers.filter(player => 
          player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.club.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : scoutingAssignmentPlayers;

    newKanbanData.shortlisted = filteredScoutingAssignment;

    // Process assigned players using consolidated data
    assignments.forEach((assignment) => {
      // Skip reviewed assignments - they shouldn't appear in the completed column
      if (assignment.status === 'reviewed') {
        return;
      }

      const scoutName = assignment.assigned_to_scout?.first_name 
        ? `${assignment.assigned_to_scout.first_name} ${assignment.assigned_to_scout.last_name || ''}`.trim()
        : assignment.assigned_to_scout?.email || 'Unknown Scout';

      // Apply scout filter
      if (selectedScout !== "all" && assignment.assigned_to_scout_id !== selectedScout) {
        return;
      }

      const playerName = assignment.players?.name || 'Unknown Player';
      const club = assignment.players?.club || 'Unknown Club';

      // Apply search filter
      if (searchTerm && !playerName.toLowerCase().includes(searchTerm.toLowerCase()) && !club.toLowerCase().includes(searchTerm.toLowerCase())) {
        return;
      }

      // Check if there's a report for this player - if so, mark as completed
      const hasReport = playerReportsMap.has(assignment.player_id);
      const effectiveStatus = hasReport ? 'completed' : assignment.status;

      console.log(`Player ${playerName} (ID: ${assignment.player_id}): hasReport=${hasReport}, effectiveStatus=${effectiveStatus}`);

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

    console.log('Final kanban data:', {
      shortlisted: newKanbanData.shortlisted.length,
      assigned: newKanbanData.assigned.length,
      completed: newKanbanData.completed.length
    });

    setKanbanData(newKanbanData);
  }, [assignments, scouts, allPlayers, reports, selectedScout, searchTerm, isLoading, scoutingAssignmentList?.playerIds]);

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
    { id: 'shortlisted', title: 'Marked for Scouting', color: 'bg-orange-500', count: kanbanData.shortlisted.length },
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
    const originalPlayer = allPlayers.find(p => {
      const playerId = p.isPrivatePlayer ? p.id : p.id.toString();
      return playerId === player.playerId;
    });
    
    if (originalPlayer) {
      setSelectedPlayer({
        id: originalPlayer.isPrivatePlayer ? originalPlayer.id : originalPlayer.id.toString(),
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

  const handleViewReport = (player: any) => {
    // Find the report for this player
    const playerReport = reports.find(report => report.playerId === player.playerId);
    if (playerReport) {
      navigate(`/report/${playerReport.id}`);
    } else {
      console.error("No report found for player:", player.playerId);
    }
  };

  const handleMarkAsReviewed = async (player: any) => {
    try {
      const { error } = await supabase
        .from('scouting_assignments')
        .update({
          status: 'reviewed',
          reviewed_at: new Date().toISOString(),
          reviewed_by_manager_id: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', player.id);

      if (error) {
        console.error('Error marking assignment as reviewed:', error);
        toast({
          title: "Error",
          description: "Failed to mark assignment as reviewed",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Assignment marked as reviewed",
      });

      // Refresh assignments to update the kanban board
      refetchAssignments();
    } catch (error) {
      console.error('Error in handleMarkAsReviewed:', error);
      toast({
        title: "Error",
        description: "An error occurred while marking assignment as reviewed",
        variant: "destructive",
      });
    }
  };

  const handleViewReviewedAssignments = () => {
    setIsReviewedModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="text-center">Loading assignments...</div>
      </div>
    );
  }

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

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Assignment Status</h2>
          {/* Show view toggle when there are 10+ players total */}
          {(kanbanData.shortlisted.length + kanbanData.assigned.length + kanbanData.completed.length) >= 10 && (
            <ScoutManagementViewToggle 
              currentView={currentView} 
              onViewChange={handleViewChange} 
            />
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={handleViewReviewedAssignments}
          className="gap-2"
        >
          View Reviewed ({reviewedAssignments.length})
        </Button>
      </div>

      {/* Status Board or Table View */}
      {currentView === 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              players={kanbanData[column.id as keyof typeof kanbanData]}
              searchTerm={searchTerm}
              selectedScout={selectedScout}
              onAssignScout={column.id === 'shortlisted' ? handleAssignScout : undefined}
              onViewReport={column.id === 'completed' ? handleViewReport : undefined}
              onMarkAsReviewed={column.id === 'completed' ? handleMarkAsReviewed : undefined}
            />
          ))}
        </div>
      ) : (
        <ScoutManagementTableView
          kanbanData={kanbanData}
          onAssignScout={handleAssignScout}
          onViewReport={handleViewReport}
          onMarkAsReviewed={handleMarkAsReviewed}
        />
      )}

      {/* Assign Scout Dialog */}
      <AssignScoutDialog
        isOpen={isAssignDialogOpen}
        onClose={handleAssignDialogClose}
        player={selectedPlayer}
      />

      {/* Reviewed Assignments Modal */}
      <ReviewedAssignmentsModal
        isOpen={isReviewedModalOpen}
        onClose={() => setIsReviewedModalOpen(false)}
        reviewedAssignments={reviewedAssignments}
        onViewReport={handleViewReport}
      />
    </div>
  );
};

export default ScoutManagement;
