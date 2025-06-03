
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportWithPlayer, Report } from '@/types/report';
import { useAuth } from '@/contexts/AuthContext';

export const useReports = () => {
  const [reports, setReports] = useState<ReportWithPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchReports = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('reports')
        .select(`
          *,
          player:players(*),
          scout:profiles(*)
        `)
        .order('created_at', { ascending: false });

      // If user is a scout, only show their reports
      if (profile?.role === 'scout') {
        query = query.eq('scout_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async (reportData: Partial<Report>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('reports')
        .upsert({
          ...reportData,
          scout_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReports(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      await fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user, profile]);

  return {
    reports,
    loading,
    saveReport,
    deleteReport,
    refetch: fetchReports,
  };
};
