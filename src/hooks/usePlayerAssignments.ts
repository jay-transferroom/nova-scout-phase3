
import { useScoutingAssignments } from "./useScoutingAssignments";

export interface PlayerAssignment {
  player_id: string;
  assigned_to_scout_id: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  created_at: string;
  assigned_to_scout?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

// This hook now uses the same source of truth as other assignment hooks
export const usePlayerAssignments = () => {
  const { data: assignments = [], ...queryProps } = useScoutingAssignments();

  // Transform the data to match the expected PlayerAssignment interface
  const playerAssignments: PlayerAssignment[] = assignments.map(assignment => ({
    player_id: assignment.player_id,
    assigned_to_scout_id: assignment.assigned_to_scout_id,
    priority: assignment.priority,
    status: assignment.status,
    created_at: assignment.created_at,
    assigned_to_scout: assignment.assigned_to_scout
  }));

  console.log('Player assignments transformed:', playerAssignments.length);

  return {
    ...queryProps,
    data: playerAssignments,
    refetch: queryProps.refetch
  };
};
