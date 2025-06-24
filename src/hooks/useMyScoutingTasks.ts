
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ScoutingAssignment {
  id: string;
  player_id: string;
  assigned_to_scout_id: string;
  assigned_by_manager_id: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  assignment_notes?: string;
  deadline?: string;
  report_type: string;
  created_at: string;
  updated_at: string;
  players?: {
    name: string;
    club: string;
    positions: string[];
    age: number;
  };
  assigned_to_scout?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export const useMyScoutingTasks = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-scouting-tasks'],
    queryFn: async (): Promise<ScoutingAssignment[]> => {
      console.log('Fetching scouting tasks for user:', user?.id);
      
      // Fetch real scouting assignments with player data from players_new
      const { data: assignments, error: assignmentsError } = await supabase
        .from('scouting_assignments')
        .select(`
          *,
          assigned_to_scout:profiles!scouting_assignments_assigned_to_scout_id_fkey(first_name, last_name, email)
        `)
        .eq('assigned_to_scout_id', user?.id)
        .order('deadline', { ascending: true, nullsFirst: false });

      console.log('Real assignments found:', assignments?.length || 0);

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        return [];
      }

      if (!assignments || assignments.length === 0) {
        console.log('No assignments found for user');
        return [];
      }

      // For each assignment, fetch the corresponding player data from players_new
      const assignmentsWithPlayers = await Promise.all(
        assignments.map(async (assignment) => {
          const { data: playerData, error: playerError } = await supabase
            .from('players_new')
            .select('name, currentteam, parentteam, firstposition, secondposition, age')
            .eq('id', assignment.player_id)
            .single();

          if (playerError) {
            console.error('Error fetching player data for assignment:', assignment.id, playerError);
            return {
              ...assignment,
              priority: assignment.priority as 'High' | 'Medium' | 'Low',
              status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed',
              players: {
                name: 'Unknown Player',
                club: 'Unknown Club',
                positions: ['Unknown'],
                age: 0
              }
            };
          }

          return {
            ...assignment,
            priority: assignment.priority as 'High' | 'Medium' | 'Low',
            status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed',
            players: {
              name: playerData.name,
              club: playerData.currentteam || playerData.parentteam || 'Unknown Club',
              positions: [playerData.firstposition, playerData.secondposition].filter(Boolean) as string[],
              age: playerData.age || 0
            }
          };
        })
      );

      console.log('Assignments with player data:', assignmentsWithPlayers.length);
      return assignmentsWithPlayers;
    },
    enabled: !!user,
  });
};
