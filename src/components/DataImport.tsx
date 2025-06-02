
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Users, Calendar, RefreshCw } from "lucide-react";

const DataImport = () => {
  const [isImportingFixtures, setIsImportingFixtures] = useState(false);
  const [isImportingPlayers, setIsImportingPlayers] = useState(false);
  const [teamId, setTeamId] = useState("33"); // Default to Manchester United
  const [season, setSeason] = useState("2024");
  const { toast } = useToast();

  const importFixtures = async () => {
    setIsImportingFixtures(true);
    try {
      console.log('Starting fixture import...');
      const { data, error } = await supabase.functions.invoke('import-football-data');
      
      if (error) {
        console.error('Fixture import error:', error);
        throw error;
      }
      
      console.log('Fixture import response:', data);
      toast({
        title: "Success",
        description: "Fixtures imported successfully! Check the Upcoming Matches page to see them.",
      });
    } catch (error) {
      console.error('Error importing fixtures:', error);
      toast({
        title: "Error",
        description: `Failed to import fixtures: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsImportingFixtures(false);
    }
  };

  const importPlayers = async () => {
    setIsImportingPlayers(true);
    try {
      console.log(`Starting player import for team ${teamId}, season ${season}...`);
      const { data, error } = await supabase.functions.invoke('import-player-data', {
        body: { team_id: teamId, season: season }
      });
      
      if (error) {
        console.error('Player import error:', error);
        throw error;
      }
      
      console.log('Player import response:', data);
      toast({
        title: "Success",
        description: `Players imported successfully for team ${teamId}!`,
      });
    } catch (error) {
      console.error('Error importing players:', error);
      toast({
        title: "Error",
        description: `Failed to import players: ${error.message || 'API call failed - check your API key and rate limits'}`,
        variant: "destructive",
      });
    } finally {
      setIsImportingPlayers(false);
    }
  };

  const syncPlayerForm = async () => {
    try {
      console.log('Starting player form sync...');
      const { data, error } = await supabase.functions.invoke('sync-player-form');
      
      if (error) {
        console.error('Player form sync error:', error);
        throw error;
      }
      
      console.log('Player form sync response:', data);
      toast({
        title: "Success",
        description: "Player form data synced successfully!",
      });
    } catch (error) {
      console.error('Error syncing player form:', error);
      toast({
        title: "Error",
        description: `Failed to sync player form data: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const checkData = async () => {
    try {
      console.log('Checking current data...');
      
      // Check fixtures
      const { data: fixtures, error: fixturesError } = await supabase
        .from('fixtures')
        .select('*')
        .limit(5);
      
      if (fixturesError) throw fixturesError;
      
      // Check players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .limit(5);
      
      if (playersError) throw playersError;
      
      console.log('Current fixtures:', fixtures);
      console.log('Current players:', players);
      
      toast({
        title: "Data Check Complete",
        description: `Found ${fixtures?.length || 0} fixtures and ${players?.length || 0} players in database`,
      });
    } catch (error) {
      console.error('Error checking data:', error);
      toast({
        title: "Error",
        description: "Failed to check current data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Import</h2>
        <p className="text-muted-foreground">Import real football data from RapidAPI</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Import Fixtures
            </CardTitle>
            <CardDescription>
              Import today's matches and fixtures from the RapidAPI football data service.
              If the API fails, sample fixtures will be created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={importFixtures} 
              disabled={isImportingFixtures}
              className="w-full"
            >
              {isImportingFixtures ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import Fixtures
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Import Players
            </CardTitle>
            <CardDescription>
              Import player squad data for a specific team. Note: This requires a valid RapidAPI key with sufficient quota.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamId">Team ID</Label>
                <Input
                  id="teamId"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  placeholder="33"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Input
                  id="season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>
            <Button 
              onClick={importPlayers} 
              disabled={isImportingPlayers}
              className="w-full"
            >
              {isImportingPlayers ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import Players
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Actions</CardTitle>
          <CardDescription>
            Other data management operations and debugging tools
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={syncPlayerForm} variant="outline">
            Sync Player Form Data
          </Button>
          <Button onClick={checkData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Current Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;
