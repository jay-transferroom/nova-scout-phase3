
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerAssignment {
  player_id: string;
  assigned_to_scout_id: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  assigned_to_scout?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export const usePlayerAssignments = () => {
  return useQuery({
    queryKey: ['player-assignments'],
    queryFn: async (): Promise<PlayerAssignment[]> => {
      const { data, error } = await supabase
        .from('scouting_assignments')
        .select(`
          player_id,
          assigned_to_scout_id,
          priority,
          status,
          assigned_to_scout:profiles!scouting_assignments_assigned_to_scout_id_fkey(first_name, last_name, email)
        `);

      if (error) {
        console.error('Error fetching player assignments:', error);
        return [];
      }

      return (data || []).map(assignment => ({
        ...assignment,
        priority: assignment.priority as 'High' | 'Medium' | 'Low',
        status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed'
      }));
    },
  });
};
