
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  league: string;
  country: string;
  founded?: number;
  venue?: string;
  external_api_id: string;
  logo_url?: string;
}

export const useTeamsData = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async (): Promise<Team[]> => {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }

      return data || [];
    },
  });
};
