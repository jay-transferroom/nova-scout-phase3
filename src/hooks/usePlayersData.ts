
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";

interface PlayerNewRecord {
  id: number;
  name: string;
  currentteam: string | null;
  parentteam: string | null;
  age: number | null;
  birthdate: string | null;
  firstposition: string | null;
  secondposition: string | null;
  firstnationality: string | null;
  secondnationality: string | null;
  contractexpiration: string | null;
  imageurl: string | null;
  xtv: number | null;
  rating: number | null;
  potential: number | null;
  basevalue: number | null;
}

export const usePlayersData = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: async (): Promise<Player[]> => {
      const { data, error } = await supabase
        .from('players_new')
        .select('*');

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }

      // Transform the data to match our Player interface
      return (data as PlayerNewRecord[]).map((player) => ({
        id: player.id.toString(),
        name: player.name,
        club: player.currentteam || player.parentteam || 'Unknown',
        age: player.age || 0,
        dateOfBirth: player.birthdate || '',
        positions: [player.firstposition, player.secondposition].filter(Boolean) as string[],
        dominantFoot: 'Right' as const, // Default since not available in players_new
        nationality: player.firstnationality || 'Unknown',
        contractStatus: 'Under Contract' as const, // Default since not available in players_new
        contractExpiry: player.contractexpiration,
        region: 'Europe', // Default since not available in players_new
        image: player.imageurl,
        xtvScore: player.xtv,
        transferroomRating: player.rating,
        futureRating: player.potential,
        euGbeStatus: 'Pass' as const, // All current Premier League players have Pass status
        recentForm: undefined, // Not available in players_new
      }));
    },
  });
};
