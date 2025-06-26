
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const usePlayerTracking = (playerId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if user is tracking this player
  const { data: isTracking = false, isLoading } = useQuery({
    queryKey: ['player-tracking', playerId, user?.id],
    queryFn: async () => {
      if (!playerId || !user?.id) return false;
      
      console.log('Checking tracking for player ID:', playerId, 'user ID:', user.id);
      
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

      console.log('Tracking player:', playerIdToTrack, 'for user:', user.id);

      const { error } = await supabase
        .from('player_tracking')
        .insert({
          user_id: user.id,
          player_id: playerIdToTrack,
        });

      if (error) {
        console.error('Error tracking player:', error);
        throw error;
      }
    },
    onSuccess: (_, playerIdToTrack) => {
      queryClient.invalidateQueries({ queryKey: ['player-tracking'] });
      // Get player name from the context or pass it as a parameter
      toast.success(`Now getting notifications for this player - you'll receive updates`);
    },
    onError: (error) => {
      console.error('Error tracking player:', error);
      toast.error("Failed to enable notifications");
    },
  });

  // Untrack player mutation
  const untrackPlayerMutation = useMutation({
    mutationFn: async (playerIdToUntrack: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Untracking player:', playerIdToUntrack, 'for user:', user.id);

      const { error } = await supabase
        .from('player_tracking')
        .delete()
        .eq('user_id', user.id)
        .eq('player_id', playerIdToUntrack);

      if (error) {
        console.error('Error untracking player:', error);
        throw error;
      }
    },
    onSuccess: (_, playerIdToUntrack) => {
      queryClient.invalidateQueries({ queryKey: ['player-tracking'] });
      toast.success(`Stopped notifications for this player`);
    },
    onError: (error) => {
      console.error('Error untracking player:', error);
      toast.error("Failed to stop notifications");
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
