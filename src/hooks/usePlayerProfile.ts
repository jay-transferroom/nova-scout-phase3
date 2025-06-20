
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";
import { ReportWithPlayer } from "@/types/report";

interface PlayerWithForm {
  id: string;
  name: string;
  club: string;
  age: number;
  date_of_birth: string;
  positions: string[];
  dominant_foot: 'Left' | 'Right' | 'Both';
  nationality: string;
  contract_status: 'Free Agent' | 'Under Contract' | 'Loan' | 'Youth Contract';
  contract_expiry: string | null;
  region: string;
  image_url: string | null;
  xtv_score: number | null;
  transferroom_rating: number | null;
  future_rating: number | null;
  player_recent_form: Array<{
    matches: number;
    goals: number;
    assists: number;
    rating: number;
  }> | null;
}

export const usePlayerProfile = (id: string | undefined) => {
  const playerQuery = useQuery({
    queryKey: ['player', id],
    queryFn: async (): Promise<Player | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          player_recent_form (
            matches,
            goals,
            assists,
            rating
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching player:', error);
        throw error;
      }

      if (!data) return null;

      const playerData = data as PlayerWithForm;
      
      return {
        id: playerData.id,
        name: playerData.name,
        club: playerData.club,
        age: playerData.age,
        dateOfBirth: playerData.date_of_birth,
        positions: playerData.positions,
        dominantFoot: playerData.dominant_foot,
        nationality: playerData.nationality,
        contractStatus: playerData.contract_status,
        contractExpiry: playerData.contract_expiry,
        region: playerData.region,
        image: playerData.image_url,
        xtvScore: playerData.xtv_score,
        transferroomRating: playerData.transferroom_rating,
        futureRating: playerData.future_rating,
        recentForm: playerData.player_recent_form?.[0] ? {
          matches: playerData.player_recent_form[0].matches,
          goals: playerData.player_recent_form[0].goals,
          assists: playerData.player_recent_form[0].assists,
          rating: playerData.player_recent_form[0].rating,
        } : undefined,
      };
    },
    enabled: !!id,
  });

  const reportsQuery = useQuery({
    queryKey: ['player-reports', id],
    queryFn: async (): Promise<ReportWithPlayer[]> => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          player:players(*),
          scout_profile:profiles(*)
        `)
        .eq('player_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching player reports:', error);
        throw error;
      }

      return (data || []).map((report: any) => {
        let sections = report.sections;
        if (typeof sections === 'string') {
          try {
            sections = JSON.parse(sections);
          } catch (e) {
            console.log(`Failed to parse sections for report ${report.id}:`, e);
            sections = [];
          }
        }

        return {
          id: report.id,
          playerId: report.player_id,
          templateId: report.template_id,
          scoutId: report.scout_id,
          createdAt: new Date(report.created_at),
          updatedAt: new Date(report.updated_at),
          status: report.status as 'draft' | 'submitted' | 'reviewed',
          sections: Array.isArray(sections) ? sections : [],
          matchContext: report.match_context,
          tags: report.tags || [],
          flaggedForReview: report.flagged_for_review || false,
          player: report.player,
          scoutProfile: report.scout_profile,
        };
      });
    },
    enabled: !!id,
  });

  return {
    player: playerQuery.data,
    isLoading: playerQuery.isLoading,
    error: playerQuery.error,
    playerReports: reportsQuery.data,
    reportsLoading: reportsQuery.isLoading,
  };
};
