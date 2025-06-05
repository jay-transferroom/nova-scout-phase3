
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
      
      // Clear player form data
      await supabase.from('player_recent_form').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Clear player fixtures
      await supabase.from('player_fixtures').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
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

  const clearLeagueData = async (leagueName: string) => {
    try {
      console.log(`Clearing existing data for ${leagueName}...`);
      
      // Get team names for this league to filter players
      const { data: leagueTeams } = await supabase
        .from('teams')
        .select('name')
        .eq('league', leagueName);
      
      const teamNames = leagueTeams?.map(team => team.name) || [];
      
      if (teamNames.length > 0) {
        // Clear players from teams in this league
        await supabase
          .from('players')
          .delete()
          .in('club', teamNames);
      }
      
      // Clear teams from this league
      await supabase
        .from('teams')
        .delete()
        .eq('league', leagueName);
      
      console.log(`${leagueName} data cleared successfully`);
      return true;
    } catch (error) {
      console.error(`Error clearing ${leagueName} data:`, error);
      return false;
    }
  };

  const importLeagueData = async (leagueName: string, forceReimport: boolean = false) => {
    try {
      setIsImporting(true);
      
      if (forceReimport) {
        setImportProgress(`Clearing existing ${leagueName} data...`);
        const cleared = await clearLeagueData(leagueName);
        if (!cleared) {
          throw new Error(`Failed to clear existing ${leagueName} data`);
        }
      }

      setImportProgress(`Importing ${leagueName} teams and players...`);
      
      const { data: importResult, error } = await supabase.functions.invoke('import-league-data', {
        body: { 
          league_name: leagueName, 
          force_reimport: forceReimport 
        }
      });

      if (error) {
        throw error;
      }

      if (!importResult?.message) {
        throw new Error(importResult?.error || 'Unknown error occurred');
      }

      // Only import fixtures for Premier League for now
      if (leagueName === 'Premier League') {
        setImportProgress('Importing match fixtures...');
        
        const { data: fixturesResult, error: fixturesError } = await supabase.functions.invoke('import-football-data');
        
        if (fixturesError) {
          console.warn('Fixtures import failed, but continuing...', fixturesError);
        }
      }

      const duplicatesMessage = importResult?.duplicatesSkipped > 0 
        ? ` (${importResult.duplicatesSkipped} duplicates avoided)`
        : '';

      setImportProgress(`${leagueName} data import completed successfully!${duplicatesMessage}`);
      toast.success(`${leagueName} data imported successfully${duplicatesMessage}`);
      
      return {
        success: true,
        message: importResult?.message || 'Import completed',
        league: leagueName,
        teams: importResult?.teamsImported || 0,
        players: importResult?.playersImported || 0,
        duplicatesSkipped: importResult?.duplicatesSkipped || 0,
        totalTeams: importResult?.totalTeams || 0,
        forceReimport: importResult?.forceReimport || forceReimport
      };
      
    } catch (error) {
      console.error('Import error:', error);
      setImportProgress('Import failed');
      toast.error(`Failed to import ${leagueName} data`);
      return { success: false, error: error.message };
    } finally {
      setIsImporting(false);
    }
  };

  const importPremierLeagueData = async () => {
    return await importLeagueData('Premier League', true);
  };

  return {
    isImporting,
    importProgress,
    importLeagueData,
    importPremierLeagueData,
    clearAllData,
    clearLeagueData
  };
};
