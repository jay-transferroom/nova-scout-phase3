
import { useQuery } from "@tanstack/react-query";
import { useMyScoutingTasks } from "@/hooks/useScoutingAssignments";

interface ScoutingTask {
  id: string;
  playerName: string;
  club: string;
  position: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  upcomingMatch: {
    date: string;
    opposition: string;
    competition: string;
    venue: string;
  } | null;
  requirementId: string;
  playerId: string;
}

export const useScoutingTasks = () => {
  const { data: assignments = [], ...query } = useMyScoutingTasks();

  const transformedData = assignments.map((assignment) => ({
    id: assignment.id,
    playerName: assignment.players?.name || 'Unknown Player',
    club: assignment.players?.club || 'Unknown Club',
    position: assignment.players?.positions[0] || 'Unknown',
    location: 'TBD', // Could be enhanced with player location data
    priority: assignment.priority,
    upcomingMatch: null, // Could be enhanced with fixture data
    requirementId: assignment.id, // Using assignment ID for now
    playerId: assignment.player_id,
  }));

  return {
    ...query,
    data: transformedData,
  };
};
