
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
          scout_profile:profiles(*)
        `)
        .order('created_at', { ascending: false });

      // If user is a scout, only show their reports
      if (profile?.role === 'scout') {
        query = query.eq('scout_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match our ReportWithPlayer interface
      const transformedReports: ReportWithPlayer[] = (data || []).map((report: any) => ({
        id: report.id,
        playerId: report.player_id,
        templateId: report.template_id,
        scoutId: report.scout_id,
        createdAt: new Date(report.created_at),
        updatedAt: new Date(report.updated_at),
        status: report.status as 'draft' | 'submitted' | 'reviewed',
        sections: Array.isArray(report.sections) ? report.sections : [],
        matchContext: report.match_context,
        tags: report.tags || [],
        flaggedForReview: report.flagged_for_review || false,
        player: report.player,
        scoutProfile: report.scout_profile,
      }));

      setReports(transformedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async (reportData: Partial<Report>) => {
    if (!user) throw new Error('User not authenticated');
    if (!reportData.playerId) throw new Error('Player ID is required');

    try {
      console.log('Saving report with data:', reportData);
      
      // Transform camelCase to snake_case for database
      const dbData = {
        id: reportData.id,
        player_id: reportData.playerId,
        template_id: reportData.templateId,
        scout_id: user.id,
        status: reportData.status || 'draft',
        sections: JSON.stringify(reportData.sections || []), // Convert to JSON string
        match_context: reportData.matchContext ? JSON.stringify(reportData.matchContext) : null, // Convert to JSON string
        tags: reportData.tags,
        flagged_for_review: reportData.flaggedForReview,
        updated_at: new Date().toISOString(),
      };

      console.log('Database data being sent:', dbData);

      const { data, error } = await supabase
        .from('reports')
        .upsert(dbData)
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
