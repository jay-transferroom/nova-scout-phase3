
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Fixture {
  id: string;
  home_team: string;
  away_team: string;
  competition: string;
  fixture_date: string;
  venue: string | null;
  status: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
  home_score: number | null;
  away_score: number | null;
  external_api_id: string | null;
}

export const useFixturesData = () => {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: async (): Promise<Fixture[]> => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('fixture_date', { ascending: true });

      if (error) {
        console.error('Error fetching fixtures:', error);
        throw error;
      }

      return data;
    },
  });
};
