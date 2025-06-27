
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PrivatePlayer, CreatePrivatePlayerData } from '@/types/privatePlayer';
import { useAuth } from '@/contexts/AuthContext';

export const usePrivatePlayers = () => {
  const [privatePlayers, setPrivatePlayers] = useState<PrivatePlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPrivatePlayers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('private_players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrivatePlayers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createPrivatePlayer = async (playerData: CreatePrivatePlayerData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('private_players')
        .insert([{
          ...playerData,
          created_by_user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state
      setPrivatePlayers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create player');
    }
  };

  const updatePrivatePlayer = async (id: string, updates: Partial<CreatePrivatePlayerData>) => {
    try {
      const { data, error } = await supabase
        .from('private_players')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setPrivatePlayers(prev => 
        prev.map(player => player.id === id ? data : player)
      );
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update player');
    }
  };

  const deletePrivatePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('private_players')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setPrivatePlayers(prev => prev.filter(player => player.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete player');
    }
  };

  useEffect(() => {
    fetchPrivatePlayers();
  }, [user]);

  return {
    privatePlayers,
    loading,
    error,
    createPrivatePlayer,
    updatePrivatePlayer,
    deletePrivatePlayer,
    refetch: fetchPrivatePlayers
  };
};
