
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
          created_at,
          assigned_to_scout:profiles!scouting_assignments_assigned_to_scout_id_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching player assignments:', error);
        return [];
      }

      console.log('Raw assignments from database:', data?.length || 0);

      // Filter out assignments with invalid player IDs (should be numeric strings)
      const validAssignments = (data || []).filter(assignment => {
        const playerId = assignment.player_id;
        // Check if player_id is a valid number (can be parsed as integer)
        const isValidPlayerId = /^\d+$/.test(playerId);
        
        if (!isValidPlayerId) {
          console.warn(`Filtering out assignment with invalid player_id: ${playerId}`);
          return false;
        }
        
        return true;
      });

      console.log('Valid assignments after filtering invalid IDs:', validAssignments.length);

      // Group by player_id and take the most recent assignment for each player
      const latestAssignments = new Map();
      
      validAssignments.forEach(assignment => {
        const playerId = assignment.player_id;
        if (!latestAssignments.has(playerId) || 
            new Date(assignment.created_at) > new Date(latestAssignments.get(playerId).created_at)) {
          latestAssignments.set(playerId, assignment);
        }
      });

      const result = Array.from(latestAssignments.values()).map(assignment => ({
        ...assignment,
        player_id: assignment.player_id,
        priority: assignment.priority as 'High' | 'Medium' | 'Low',
        status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed'
      }));

      console.log('Processed unique player assignments:', result.length);
      console.log('Player assignments data:', result);

      return result;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
