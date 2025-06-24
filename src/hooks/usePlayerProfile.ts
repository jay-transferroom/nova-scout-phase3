
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

export const usePlayerProfile = (playerId?: string) => {
  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player', playerId],
    queryFn: async (): Promise<Player | null> => {
      if (!playerId) return null;

      console.log('Fetching player with ID:', playerId);

      const { data, error } = await supabase
        .from('players_new')
        .select('*')
        .eq('id', parseInt(playerId))
        .single();

      if (error) {
        console.error('Error fetching player:', error);
        throw error;
      }

      if (!data) return null;

      const playerRecord = data as PlayerNewRecord;

      // Transform the data to match our Player interface
      return {
        id: playerRecord.id.toString(),
        name: playerRecord.name,
        club: playerRecord.currentteam || playerRecord.parentteam || 'Unknown',
        age: playerRecord.age || 0,
        dateOfBirth: playerRecord.birthdate || '',
        positions: [playerRecord.firstposition, playerRecord.secondposition].filter(Boolean) as string[],
        dominantFoot: 'Right' as const, // Default since not available in players_new
        nationality: playerRecord.firstnationality || 'Unknown',
        contractStatus: 'Under Contract' as const, // Default since not available in players_new
        contractExpiry: playerRecord.contractexpiration,
        region: 'Europe', // Default since not available in players_new
        image: playerRecord.imageurl,
        xtvScore: playerRecord.xtv,
        transferroomRating: playerRecord.rating,
        futureRating: playerRecord.potential,
        recentForm: undefined, // Not available in players_new
      };
    },
    enabled: !!playerId,
  });

  // For reports, we still need to query using string player_id since reports table uses UUID
  const { data: playerReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['player-reports', playerId],
    queryFn: async () => {
      if (!playerId) return [];

      console.log('Fetching reports for player ID:', playerId);

      // Since reports table still uses old UUID format, we need to handle this differently
      // For now, return empty array since we don't have matching records
      return [];
    },
    enabled: !!playerId,
  });

  return {
    player,
    isLoading,
    error,
    playerReports: playerReports || [],
    reportsLoading,
  };
};
