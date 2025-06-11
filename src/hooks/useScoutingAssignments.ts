
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase
        .from('scouting_assignments')
        .select(`
          *,
          players!inner(name, club, positions, age),
          assigned_to_scout:profiles!scouting_assignments_assigned_to_scout_id_fkey(first_name, last_name, email),
          assigned_by_manager:profiles!scouting_assignments_assigned_by_manager_id_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scouting assignments:', error);
        throw error;
      }

      return (data || []).map(assignment => ({
        ...assignment,
        priority: assignment.priority as 'High' | 'Medium' | 'Low',
        status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed'
      }));
    },
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
