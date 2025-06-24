
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

      console.log('Player assignments fetched:', data?.length || 0);

      return (data || []).map(assignment => ({
        ...assignment,
        player_id: assignment.player_id.toString(), // Convert to string to match players_new.id
        priority: assignment.priority as 'High' | 'Medium' | 'Low',
        status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed'
      }));
    },
  });
};
