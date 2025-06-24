
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ScoutingAssignmentWithDetails {
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
  assigned_by_manager?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export const useScoutingAssignments = () => {
  return useQuery({
    queryKey: ['scouting-assignments'],
    queryFn: async (): Promise<ScoutingAssignmentWithDetails[]> => {
      // First get the assignments without player data
      const { data: assignments, error } = await supabase
        .from('scouting_assignments')
        .select(`
          *,
          assigned_to_scout:profiles!scouting_assignments_assigned_to_scout_id_fkey(first_name, last_name, email),
          assigned_by_manager:profiles!scouting_assignments_assigned_by_manager_id_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scouting assignments:', error);
        throw error;
      }

      if (!assignments || assignments.length === 0) {
        return [];
      }

      // Now fetch player data from players_new for each assignment
      const assignmentsWithPlayers = await Promise.all(
        assignments.map(async (assignment) => {
          // Convert player_id string to number for players_new table query
          const playerIdNumber = parseInt(assignment.player_id, 10);
          
          const { data: playerData, error: playerError } = await supabase
            .from('players_new')
            .select('name, currentteam, parentteam, firstposition, secondposition, age')
            .eq('id', playerIdNumber)
            .single();

          return {
            ...assignment,
            priority: assignment.priority as 'High' | 'Medium' | 'Low',
            status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed',
            players: playerError ? {
              name: 'Unknown Player',
              club: 'Unknown Club',
              positions: ['Unknown'],
              age: 0
            } : {
              name: playerData.name,
              club: playerData.currentteam || playerData.parentteam || 'Unknown Club',
              positions: [playerData.firstposition, playerData.secondposition].filter(Boolean) as string[],
              age: playerData.age || 0
            }
          };
        })
      );

      return assignmentsWithPlayers;
    },
  });
};

export const useMyScoutingTasks = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-scouting-tasks'],
    queryFn: async (): Promise<ScoutingAssignmentWithDetails[]> => {
      console.log('Fetching scouting tasks for user:', user?.id);
      
      // First try to get actual scouting assignments without player data
      const { data: assignments, error: assignmentsError } = await supabase
        .from('scouting_assignments')
        .select(`
          *,
          assigned_to_scout:profiles!scouting_assignments_assigned_to_scout_id_fkey(first_name, last_name, email),
          assigned_by_manager:profiles!scouting_assignments_assigned_by_manager_id_fkey(first_name, last_name, email)
        `)
        .eq('assigned_to_scout_id', user?.id)
        .order('deadline', { ascending: true, nullsFirst: false });

      console.log('Real assignments found:', assignments?.length || 0);

      if (!assignmentsError && assignments && assignments.length > 0) {
        // Fetch player data for each assignment from players_new
        const assignmentsWithPlayers = await Promise.all(
          assignments.map(async (assignment) => {
            const playerIdNumber = parseInt(assignment.player_id, 10);
            
            const { data: playerData, error: playerError } = await supabase
              .from('players_new')
              .select('name, currentteam, parentteam, firstposition, secondposition, age')
              .eq('id', playerIdNumber)
              .single();

            return {
              ...assignment,
              priority: assignment.priority as 'High' | 'Medium' | 'Low',
              status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed',
              players: playerError ? {
                name: 'Unknown Player',
                club: 'Unknown Club',
                positions: ['Unknown'],
                age: 0
              } : {
                name: playerData.name,
                club: playerData.currentteam || playerData.parentteam || 'Unknown Club',
                positions: [playerData.firstposition, playerData.secondposition].filter(Boolean) as string[],
                age: playerData.age || 0
              }
            };
          })
        );

        return assignmentsWithPlayers;
      }

      console.log('No real assignments found, creating mock assignments...');

      // If no assignments found, create mock assignments with real players from database
      const { data: players, error: playersError } = await supabase
        .from('players_new')
        .select('id, name, currentteam, parentteam, firstposition, secondposition, age')
        .limit(8);

      console.log('Players fetched for mock assignments:', players?.length || 0);

      if (playersError || !players || players.length === 0) {
        console.error('Error fetching players for mock assignments:', playersError);
        return [];
      }

      // Create mock assignments with real player data
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
          club: player.currentteam || player.parentteam || 'Unknown Club',
          positions: [player.firstposition, player.secondposition].filter(Boolean) as string[],
          age: player.age || 0
        }
      }));

      console.log('Mock assignments created:', mockAssignments.length);
      return mockAssignments;
    },
    enabled: !!user,
  });
};

export const useUpdateAssignmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ assignmentId, status }: { assignmentId: string; status: string }) => {
      const { error } = await supabase
        .from('scouting_assignments')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouting-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['my-scouting-tasks'] });
    },
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignment: {
      player_id: string;
      assigned_to_scout_id: string;
      assigned_by_manager_id: string;
      priority: 'High' | 'Medium' | 'Low';
      status: 'assigned' | 'in_progress' | 'completed' | 'reviewed';
      assignment_notes?: string;
      deadline?: string;
      report_type: string;
    }) => {
      console.log('Creating/updating assignment for player:', assignment.player_id);
      
      // First check if an assignment already exists for this player
      const { data: existingAssignment, error: checkError } = await supabase
        .from('scouting_assignments')
        .select('id')
        .eq('player_id', assignment.player_id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing assignment:', checkError);
        throw checkError;
      }

      if (existingAssignment) {
        console.log('Updating existing assignment:', existingAssignment.id);
        // Update the existing assignment
        const { error: updateError } = await supabase
          .from('scouting_assignments')
          .update({
            assigned_to_scout_id: assignment.assigned_to_scout_id,
            assigned_by_manager_id: assignment.assigned_by_manager_id,
            priority: assignment.priority,
            status: assignment.status,
            assignment_notes: assignment.assignment_notes,
            deadline: assignment.deadline,
            report_type: assignment.report_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAssignment.id);
        
        if (updateError) {
          console.error('Error updating assignment:', updateError);
          throw updateError;
        }
        console.log('Assignment updated successfully');
      } else {
        console.log('Creating new assignment');
        // Create a new assignment
        const { error: insertError } = await supabase
          .from('scouting_assignments')
          .insert(assignment);
        
        if (insertError) {
          console.error('Error creating assignment:', insertError);
          throw insertError;
        }
        console.log('New assignment created successfully');
      }
    },
    onSuccess: () => {
      console.log('Assignment mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['scouting-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['my-scouting-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['player-assignments'] });
    },
    onError: (error) => {
      console.error('Assignment mutation failed:', error);
    }
  });
};
