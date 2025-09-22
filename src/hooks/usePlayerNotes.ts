import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePlayerNotes = (playerId: string) => {
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotesCount = async () => {
    if (!playerId) return;
    
    setLoading(true);
    try {
      const { count, error } = await supabase
        .from('player_notes')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', playerId);

      if (error) {
        console.error('Error fetching notes count:', error);
        return;
      }

      setNotesCount(count || 0);
    } catch (error) {
      console.error('Error in fetchNotesCount:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesCount();
  }, [playerId]);

  return {
    notesCount,
    loading,
    refetch: fetchNotesCount
  };
};