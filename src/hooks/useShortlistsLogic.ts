
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

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
      return <Badge variant="secondary">Unassigned</Badge>;
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

    return (
      <Badge 
        variant="outline" 
        className={`${statusColors[effectiveStatus]} border-0`}
      >
        {scoutName} ({statusLabels[effectiveStatus]})
      </Badge>
    );
  };

  const getEuGbeBadge = (status: string) => {
    const colors: { [key: string]: string } = {
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
