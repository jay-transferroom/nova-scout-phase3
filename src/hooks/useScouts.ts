
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Scout {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
}

export const useScouts = () => {
  return useQuery({
    queryKey: ['scouts'],
    queryFn: async (): Promise<Scout[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
        .in('role', ['scout', 'recruitment']);

      if (error) {
        console.error('Error fetching scouts:', error);
        throw error;
      }

      return data || [];
    },
  });
};
