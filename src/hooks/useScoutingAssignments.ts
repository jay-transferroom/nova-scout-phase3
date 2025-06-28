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
    imageUrl?: string;
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

// Single source of truth for all assignment data
export const useScoutingAssignments = () => {
  return useQuery({
    queryKey: ['scouting-assignments'],
    queryFn: async (): Promise<ScoutingAssignmentWithDetails[]> => {
      console.log('Fetching all scouting assignments...');
      
      // Get all assignments with scout profile data
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
        console.log('No assignments found');
        return [];
      }

      console.log('Raw assignments from database:', assignments.length);

      // Filter out assignments with invalid player IDs
      const validAssignments = assignments.filter(assignment => {
        const playerId = assignment.player_id;
        const isValidPlayerId = /^\d+$/.test(playerId);
        
        if (!isValidPlayerId) {
          console.warn(`Filtering out assignment with invalid player_id: ${playerId}`);
          return false;
        }
        
        return true;
      });

      console.log('Valid assignments after filtering invalid IDs:', validAssignments.length);

      // Group by player_id and keep only the most recent assignment for each player
      const latestAssignments = new Map();
      validAssignments.forEach(assignment => {
        const playerId = assignment.player_id;
        if (!latestAssignments.has(playerId) || 
            new Date(assignment.created_at) > new Date(latestAssignments.get(playerId).created_at)) {
          latestAssignments.set(playerId, assignment);
        }
      });

      console.log(`Deduplicated assignments: ${latestAssignments.size} unique players`);

      // Fetch player data for each unique assignment
      const assignmentsWithPlayers = await Promise.all(
        Array.from(latestAssignments.values()).map(async (assignment) => {
          const playerIdNumber = parseInt(assignment.player_id, 10);
          
          const { data: playerData, error: playerError } = await supabase
            .from('players_new')
            .select('name, currentteam, parentteam, firstposition, secondposition, age, imageurl')
            .eq('id', playerIdNumber)
            .single();

          if (playerError || !playerData) {
            console.warn(`Player not found for ID: ${playerIdNumber}, skipping assignment`);
            return null;
          }

          return {
            ...assignment,
            priority: assignment.priority as 'High' | 'Medium' | 'Low',
            status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed',
            players: {
              name: playerData.name,
              club: playerData.currentteam || playerData.parentteam || 'Unknown Club',
              positions: [playerData.firstposition, playerData.secondposition].filter(Boolean) as string[],
              age: playerData.age || 0,
              imageUrl: playerData.imageurl
            }
          };
        })
      );

      // Filter out null entries
      const finalAssignments = assignmentsWithPlayers.filter(assignment => assignment !== null);

      console.log(`Final processed assignments: ${finalAssignments.length}`);
      return finalAssignments;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

// Hook for getting assignments for a specific scout (used in Assigned Players)
export const useMyScoutingTasks = () => {
  const { user } = useAuth();
  const { data: allAssignments = [], ...queryProps } = useScoutingAssignments();
  
  const myAssignments = allAssignments.filter(assignment => 
    assignment.assigned_to_scout_id === user?.id
  );

  console.log(`My assignments for user ${user?.id}:`, myAssignments.length);

  return {
    ...queryProps,
    data: myAssignments,
  };
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
      console.log('Assigning to scout:', assignment.assigned_to_scout_id);
      
      // Check if assignments already exist for this player
      const { data: existingAssignments, error: checkError } = await supabase
        .from('scouting_assignments')
        .select('id, created_at, assigned_to_scout_id')
        .eq('player_id', assignment.player_id)
        .order('created_at', { ascending: false });

      if (checkError) {
        console.error('Error checking existing assignments:', checkError);
        throw checkError;
      }

      console.log('Existing assignments found:', existingAssignments?.length || 0);

      if (existingAssignments && existingAssignments.length > 0) {
        // Update the most recent assignment
        const mostRecentAssignment = existingAssignments[0];
        console.log('Updating assignment:', mostRecentAssignment.id);
        
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
          .eq('id', mostRecentAssignment.id);
        
        if (updateError) {
          console.error('Error updating assignment:', updateError);
          throw updateError;
        }

        // Clean up any duplicate assignments for this player
        if (existingAssignments.length > 1) {
          const duplicateIds = existingAssignments.slice(1).map(a => a.id);
          console.log('Cleaning up duplicate assignments:', duplicateIds);
          
          const { error: deleteError } = await supabase
            .from('scouting_assignments')
            .delete()
            .in('id', duplicateIds);
            
          if (deleteError) {
            console.warn('Error cleaning up duplicates:', deleteError);
          }
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
    },
    onError: (error) => {
      console.error('Assignment mutation failed:', error);
    }
  });
};
