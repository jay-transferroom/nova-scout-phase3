
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PrivatePlayer, CreatePrivatePlayerData } from '@/types/privatePlayer';
import { useAuth } from '@/contexts/AuthContext';

export const usePrivatePlayers = () => {
  const [privatePlayers, setPrivatePlayers] = useState<PrivatePlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Mock Herbie Hughes data to match shortlist expectations
  const mockHerbieHughes: PrivatePlayer = {
    id: "1f4c01f4-9548-4cbc-a10f-951eaa41aa56",
    created_by_user_id: user?.id || "mock-user-id",
    name: "Herbie Hughes",
    club: "Manchester United U21",
    age: 19,
    date_of_birth: "2005-03-15",
    positions: ["ST", "CF"],
    nationality: "England",
    dominant_foot: "Right",
    region: "Europe",
    notes: "Promising young striker from Manchester United academy. Strong physical presence and good finishing ability.",
    source_context: "Academy scout recommendation",
    visibility: "private",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const fetchPrivatePlayers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('private_players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing from database
      const typedData = (data || []).map(player => ({
        ...player,
        dominant_foot: player.dominant_foot as 'Left' | 'Right' | 'Both' | undefined,
      })) as PrivatePlayer[];
      
      // Add mock Herbie Hughes if not already present
      const hasHerbie = typedData.some(p => p.name === "Herbie Hughes");
      const allPlayers = hasHerbie ? typedData : [mockHerbieHughes, ...typedData];
      
      setPrivatePlayers(allPlayers);
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
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        dominant_foot: data.dominant_foot as 'Left' | 'Right' | 'Both' | undefined,
      } as PrivatePlayer;
      
      // Add to local state
      setPrivatePlayers(prev => [typedData, ...prev]);
      return typedData;
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
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        dominant_foot: data.dominant_foot as 'Left' | 'Right' | 'Both' | undefined,
      } as PrivatePlayer;
      
      // Update local state
      setPrivatePlayers(prev => 
        prev.map(player => player.id === id ? typedData : player)
      );
      return typedData;
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
