
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ScoutUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
  created_at: string;
}

export const useScoutUsers = () => {
  return useQuery({
    queryKey: ['scout-users'],
    queryFn: async (): Promise<ScoutUser[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['scout', 'recruitment'])
        .order('first_name');

      if (error) {
        console.error('Error fetching scout users:', error);
        throw error;
      }

      return data || [];
    },
  });
};
