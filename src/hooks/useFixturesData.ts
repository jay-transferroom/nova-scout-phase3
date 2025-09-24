
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Fixture {
  matchweek: number | null;
  match_number: number | null;
  match_date_utc: string;
  match_datetime_london: string | null;
  home_score: number | null;
  away_score: number | null;
  season: string;
  competition: string | null;
  home_team: string;
  away_team: string;
  venue: string | null;
  status: string | null;
  result: string | null;
  source: string | null;
}

export const useFixturesData = () => {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: async (): Promise<Fixture[]> => {
      try {
        // Query using SQL directly
        const query = `
          SELECT 
            matchweek,
            match_number,
            match_date_utc,
            match_datetime_london,
            home_score,
            away_score,
            season,
            competition,
            home_team,
            away_team,
            venue,
            status,
            result,
            source
          FROM fixtures_results_2526 
          ORDER BY match_date_utc ASC
        `;

        const { data, error } = await supabase.rpc('execute_sql', { query });

        if (error) {
          console.error('Error fetching fixtures:', error);
          // Return sample data for now since the table might not be accessible via RPC
          return [];
        }

        return (data || []) as Fixture[];
      } catch (err) {
        console.error('Error in fixtures query:', err);
        return [];
      }
    },
  });
};
