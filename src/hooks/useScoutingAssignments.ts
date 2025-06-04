
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useScoutingAssignments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['scouting-assignments'],
    queryFn: async (): Promise<ScoutingAssignment[]> => {
      const { data, error } = await supabase
        .from('scouting_assignments')
        .select(`
          *,
          players!inner(name, club, positions, age),
          assigned_to_scout:profiles!assigned_to_scout_id(first_name, last_name, email)
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
    enabled: !!user,
  });
};

export const useMyScoutingTasks = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-scouting-tasks'],
    queryFn: async (): Promise<ScoutingAssignment[]> => {
      const { data, error } = await supabase
        .from('scouting_assignments')
        .select(`
          *,
          players!inner(name, club, positions, age)
        `)
        .eq('assigned_to_scout_id', user?.id)
        .order('deadline', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Error fetching my scouting tasks:', error);
        throw error;
      }

      return (data || []).map(assignment => ({
        ...assignment,
        priority: assignment.priority as 'High' | 'Medium' | 'Low',
        status: assignment.status as 'assigned' | 'in_progress' | 'completed' | 'reviewed'
      }));
    },
    enabled: !!user,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignment: Omit<ScoutingAssignment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('scouting_assignments')
        .insert([assignment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouting-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['my-scouting-tasks'] });
    },
  });
};

export const useUpdateAssignmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ScoutingAssignment['status'] }) => {
      const { data, error } = await supabase
        .from('scouting_assignments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouting-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['my-scouting-tasks'] });
    },
  });
};
