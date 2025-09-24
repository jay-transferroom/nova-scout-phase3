import { useScoutingAssignments } from "./useScoutingAssignments";

// Hook to get all scouts assigned to a specific player
export const usePlayerScouts = (playerId: string) => {
  const { data: allAssignments = [], ...queryProps } = useScoutingAssignments();
  
  const playerAssignments = allAssignments.filter(assignment => 
    assignment.player_id === playerId
  );

  const scouts = playerAssignments.map(assignment => ({
    id: assignment.assigned_to_scout_id,
    first_name: assignment.assigned_to_scout?.first_name,
    last_name: assignment.assigned_to_scout?.last_name,
    email: assignment.assigned_to_scout?.email || '',
    priority: assignment.priority,
    status: assignment.status,
    assignment_id: assignment.id
  }));

  console.log(`Scouts for player ${playerId}:`, scouts.length);

  return {
    ...queryProps,
    data: scouts,
    assignments: playerAssignments
  };
};