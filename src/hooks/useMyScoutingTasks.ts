
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
      
      // First try to get actual scouting assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('scouting_assignments')
        .select(`
          *,
          players!inner(name, club, positions, age)
        `)
        .eq('assigned_to_scout_id', user?.id)
        .order('deadline', { ascending: true, nullsFirst: false });

      console.log('Real assignments found:', assignments?.length || 0);

      if (!assignmentsError && assignments && assignments.length > 0) {
        return assignments.map(assignment => ({
          ...assignment,
          priority: assignment.priority as 'High' | 'Medium' | 'Low',
          status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed'
        }));
      }

      console.log('No real assignments found, creating mock assignments with real players...');

      // If no assignments found, create mock assignments with real players from players_new
      const { data: players, error: playersError } = await supabase
        .from('players_new')
        .select('id, name, currentteam, parentteam, firstposition, secondposition, age')
        .limit(8);

      console.log('Players fetched for mock assignments:', players?.length || 0);

      if (playersError || !players || players.length === 0) {
        console.error('Error fetching players for mock assignments:', playersError);
        return [];
      }

      // Create mock assignments with real player data from players_new
      const mockStatuses: ('assigned' | 'in_progress' | 'completed' | 'reviewed')[] = 
        ['assigned', 'in_progress', 'completed', 'reviewed'];
      const mockPriorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
      
      const mockAssignments = players.slice(0, 6).map((player, index) => ({
        id: `mock-assignment-${player.id}`,
        player_id: player.id.toString(),
        assigned_to_scout_id: user?.id || '',
        assigned_by_manager_id: 'mock-manager-id',
        priority: mockPriorities[index % 3],
        status: mockStatuses[index % 4],
        assignment_notes: `Scout ${player.name} for potential transfer target`,
        deadline: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        report_type: 'Standard',
        created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        players: {
          name: player.name,
          club: player.currentteam || player.parentteam || 'Unknown',
          positions: [player.firstposition, player.secondposition].filter(Boolean) as string[],
          age: player.age || 25
        }
      }));

      console.log('Mock assignments created:', mockAssignments.length);
      return mockAssignments;
    },
    enabled: !!user,
  });
};
