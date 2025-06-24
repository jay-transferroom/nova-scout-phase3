
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePlayerTracking = (playerId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if user is tracking this player
  const { data: isTracking = false, isLoading } = useQuery({
    queryKey: ['player-tracking', playerId, user?.id],
    queryFn: async () => {
      if (!playerId || !user?.id) return false;
      
      const { data, error } = await supabase
        .from('player_tracking')
        .select('id')
        .eq('user_id', user.id)
        .eq('player_id', playerId)
        .maybeSingle();

      if (error) {
        console.error('Error checking player tracking:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!playerId && !!user?.id,
  });

  // Track player mutation
  const trackPlayerMutation = useMutation({
    mutationFn: async (playerIdToTrack: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('player_tracking')
        .insert({
          user_id: user.id,
          player_id: playerIdToTrack,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-tracking'] });
    },
  });

  // Untrack player mutation
  const untrackPlayerMutation = useMutation({
    mutationFn: async (playerIdToUntrack: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('player_tracking')
        .delete()
        .eq('user_id', user.id)
        .eq('player_id', playerIdToUntrack);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-tracking'] });
    },
  });

  return {
    isTracking,
    isLoading,
    trackPlayer: trackPlayerMutation.mutate,
    untrackPlayer: untrackPlayerMutation.mutate,
    isTrackingPlayer: trackPlayerMutation.isPending,
    isUntrackingPlayer: untrackPlayerMutation.isPending,
  };
};

// Hook to get all tracked players for the current user
export const useTrackedPlayers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tracked-players', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('player_tracking')
        .select(`
          id,
          player_id,
          created_at,
          players:player_id (
            id,
            name,
            club,
            positions,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tracked players:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};
