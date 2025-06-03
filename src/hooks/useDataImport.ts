
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDataImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<string>('');

  const clearAllData = async () => {
    try {
      console.log('Clearing all existing data...');
      
      // Clear reports first (due to foreign key constraints)
      await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Clear players
      await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Clear teams
      await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Clear fixtures
      await supabase.from('fixtures').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('All data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  const importPremierLeagueData = async () => {
    try {
      setIsImporting(true);
      setImportProgress('Clearing existing data...');
      
      const cleared = await clearAllData();
      if (!cleared) {
        throw new Error('Failed to clear existing data');
      }

      setImportProgress('Importing Premier League teams and players...');
      
      const { data: importResult, error } = await supabase.functions.invoke('import-league-data', {
        body: { 
          league_name: 'Premier League', 
          force_reimport: true 
        }
      });

      if (error) {
        throw error;
      }

      setImportProgress('Importing match fixtures...');
      
      const { data: fixturesResult, error: fixturesError } = await supabase.functions.invoke('import-football-data');
      
      if (fixturesError) {
        console.warn('Fixtures import failed, but continuing...', fixturesError);
      }

      setImportProgress('Data import completed successfully!');
      toast.success('Premier League data imported successfully');
      
      return {
        success: true,
        message: importResult?.message || 'Import completed',
        teams: importResult?.teamsImported || 0,
        players: importResult?.playersImported || 0
      };
      
    } catch (error) {
      console.error('Import error:', error);
      setImportProgress('Import failed');
      toast.error('Failed to import data');
      return { success: false, error: error.message };
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importProgress,
    importPremierLeagueData,
    clearAllData
  };
};
