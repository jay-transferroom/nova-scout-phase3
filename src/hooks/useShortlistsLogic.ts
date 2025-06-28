
import { useMemo } from "react";

interface UseShortlistsLogicProps {
  allPlayers: any[];
  assignments: any[];
  reports: any[];
  selectedList: string | null;
  searchTerm: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  euGbeFilter: string;
  shortlists: any[];
}

export const useShortlistsLogic = ({
  allPlayers,
  assignments,
  reports,
  selectedList,
  searchTerm,
  sortBy,
  sortOrder,
  euGbeFilter,
  shortlists
}: UseShortlistsLogicProps) => {
  
  // Mock private players on shortlists - including Herbie Hughes
  const getPrivatePlayersForShortlist = (shortlistId: string) => {
    const mockPrivatePlayersOnShortlists: { [key: string]: any[] } = {
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
  
  // Get players based on list type - FIXED LOGIC
  let currentPublicPlayers: any[] = [];
  let currentPrivatePlayers: any[] = [];
  
  if (currentList) {
    // Get private players for this shortlist first
    currentPrivatePlayers = getPrivatePlayersForShortlist(currentList.id);
    
    // For custom lists (those with playerIds but no filter), only show manually added players
    if (currentList.playerIds && currentList.playerIds.length > 0 && !currentList.filter) {
      // Custom shortlist - only show manually added public players
      currentPublicPlayers = allPlayers.filter(player => 
        currentList.playerIds.includes(player.id.toString())
      );
    }
    // For default lists with filters, apply the filter to get base players
    else if (currentList.filter && typeof currentList.filter === 'function') {
      currentPublicPlayers = allPlayers.filter(currentList.filter);
      
      // Then add any manually added players that aren't already included
      if (currentList.playerIds && currentList.playerIds.length > 0) {
        const manualPlayers = allPlayers.filter(player => 
          currentList.playerIds.includes(player.id.toString()) &&
          !currentPublicPlayers.some(existing => existing.id.toString() === player.id.toString())
        );
        currentPublicPlayers = [...currentPublicPlayers, ...manualPlayers];
      }
    }
    // For lists with only playerIds and no filter (shouldn't happen with current setup, but defensive)
    else if (currentList.playerIds && currentList.playerIds.length > 0) {
      currentPublicPlayers = allPlayers.filter(player => 
        currentList.playerIds.includes(player.id.toString())
      );
    }
    
    // Remove duplicates from public players
    const seenIds = new Set();
    currentPublicPlayers = currentPublicPlayers.filter(player => {
      const id = player.id.toString();
      if (seenIds.has(id)) {
        return false;
      }
      seenIds.add(id);
      return true;
    });
  }
  
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
  const sortedPlayers = useMemo(() => {
    return [...euGbeFilteredPlayers].sort((a, b) => {
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
  }, [euGbeFilteredPlayers, sortBy, sortOrder]);

  const formatXtvScore = (score: number) => {
    return (score / 1000000).toFixed(1);
  };

  // Updated to use consolidated assignment data
  const getPlayerAssignment = (playerId: string) => {
    const assignment = assignments.find(assignment => assignment.player_id === playerId);
    console.log(`Looking for assignment for player ${playerId}:`, assignment);
    return assignment;
  };

  // Create reports map for quick lookup
  const playerReportsMap = new Map();
  reports.forEach(report => {
    if (report.playerId) {
      playerReportsMap.set(report.playerId, report);
    }
  });

  const getAssignmentBadge = (playerId: string) => {
    const assignment = getPlayerAssignment(playerId);
    if (!assignment) {
      return {
        variant: "secondary" as const,
        children: "Unassigned"
      };
    }

    // Check if there's a report for this player - if so, mark as completed
    const hasReport = playerReportsMap.has(playerId);
    const effectiveStatus = hasReport ? 'completed' : assignment.status;

    const scoutName = assignment.assigned_to_scout ? 
      `${assignment.assigned_to_scout.first_name || ''} ${assignment.assigned_to_scout.last_name || ''}`.trim() || 
      assignment.assigned_to_scout.email : 
      'Unknown Scout';

    const statusColors: { [key: string]: string } = {
      'assigned': 'bg-red-100 text-red-800',
      'in_progress': 'bg-orange-100 text-orange-800', 
      'completed': 'bg-green-100 text-green-800',
      'reviewed': 'bg-blue-100 text-blue-800'
    };

    const statusLabels: { [key: string]: string } = {
      'assigned': 'assigned',
      'in_progress': 'in progress',
      'completed': 'completed',
      'reviewed': 'reviewed'
    };

    return {
      variant: "outline" as const,
      className: `${statusColors[effectiveStatus]} border-0`,
      children: `${scoutName} (${statusLabels[effectiveStatus]})`
    };
  };

  const getEuGbeBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      'Pass': 'bg-green-100 text-green-800',
      'Fail': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    
    return {
      variant: "outline" as const,
      className: `${colors[status]} border-0`,
      children: status
    };
  };

  return {
    currentList,
    sortedPlayers,
    getPrivatePlayersForShortlist,
    formatXtvScore,
    getPlayerAssignment,
    getAssignmentBadge,
    getEuGbeBadge
  };
};
