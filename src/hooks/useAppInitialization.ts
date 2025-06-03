
import { useEffect, useState } from 'react';
import { useDataImport } from './useDataImport';
import { supabase } from '@/integrations/supabase/client';

export const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState<string>('Checking data...');
  const { importPremierLeagueData } = useDataImport();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if we have any teams data
        const { data: existingTeams, error } = await supabase
          .from('teams')
          .select('id')
          .eq('league', 'Premier League')
          .limit(1);

        if (error) {
          console.error('Error checking existing data:', error);
          setInitializationStatus('Error checking data');
          setIsInitialized(true);
          return;
        }

        // If no Premier League teams exist, import data
        if (!existingTeams || existingTeams.length === 0) {
          setInitializationStatus('No data found. Importing Premier League data...');
          console.log('No Premier League data found, starting import...');
          
          const result = await importPremierLeagueData();
          
          if (result.success) {
            setInitializationStatus(`Import complete! ${result.teams} teams, ${result.players} players imported.`);
          } else {
            setInitializationStatus('Import failed, but app will continue to work');
          }
        } else {
          setInitializationStatus('Data already available');
          console.log('Premier League data already exists, skipping import');
        }

      } catch (error) {
        console.error('App initialization error:', error);
        setInitializationStatus('Initialization failed, but app will continue');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  return {
    isInitialized,
    initializationStatus
  };
};
