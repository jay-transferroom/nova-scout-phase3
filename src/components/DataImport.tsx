import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Users, Calendar, RefreshCw, Shield, Target } from "lucide-react";
import TeamsDisplay from "./TeamsDisplay";

const DataImport = () => {
  const [isImportingFixtures, setIsImportingFixtures] = useState(false);
  const [isImportingPlayers, setIsImportingPlayers] = useState(false);
  const [isImportingTeams, setIsImportingTeams] = useState(false);
  const [isImportingTeamById, setIsImportingTeamById] = useState(false);
  const [teamId, setTeamId] = useState("33"); // Default to Manchester United
  const [season, setSeason] = useState("2024");
  const [singleTeamId, setSingleTeamId] = useState("33"); // For single team import
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

  const importTeams = async () => {
    setIsImportingTeams(true);
    try {
      console.log('Starting Premier League teams import...');
      const { data, error } = await supabase.functions.invoke('import-teams');
      
      if (error) {
        console.error('Teams import error:', error);
        throw error;
      }
      
      console.log('Teams import response:', data);
      toast({
        title: "Success",
        description: "Premier League teams imported successfully!",
      });
    } catch (error) {
      console.error('Error importing teams:', error);
      toast({
        title: "Error",
        description: `Failed to import teams: ${error.message || 'API call failed - check your API key and rate limits'}`,
        variant: "destructive",
      });
    } finally {
      setIsImportingTeams(false);
    }
  };

  const importTeamById = async () => {
    setIsImportingTeamById(true);
    try {
      console.log(`Starting team import for team ${singleTeamId}...`);
      const { data, error } = await supabase.functions.invoke('import-teams-by-id', {
        body: { team_id: singleTeamId }
      });
      
      if (error) {
        console.error('Team import error:', error);
        throw error;
      }
      
      console.log('Team import response:', data);
      
      // Use the team name from the response if available
      const teamName = data?.teamName || `team ${singleTeamId}`;
      
      toast({
        title: "Success",
        description: `Successfully imported ${teamName}!`,
      });
    } catch (error) {
      console.error('Error importing team:', error);
      toast({
        title: "Error",
        description: `Failed to import team: ${error.message || 'API call failed - check your API key and rate limits'}`,
        variant: "destructive",
      });
    } finally {
      setIsImportingTeamById(false);
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
        <p className="text-muted-foreground">Import Premier League data from RapidAPI</p>
      </div>

      {/* Step 1: Import Premier League Teams */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Shield className="h-5 w-5" />
            Step 1: Import Premier League Teams
          </CardTitle>
          <CardDescription>
            Start here! Import Premier League teams to get their IDs for player imports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={importTeams} 
            disabled={isImportingTeams}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isImportingTeams ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Premier League Teams...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import Premier League Teams
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Teams Display */}
      <TeamsDisplay />

      {/* Step 2: Import Players */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Users className="h-5 w-5" />
            Step 2: Import Players by Team
          </CardTitle>
          <CardDescription>
            Use a team ID from above to import that team's squad. Copy the ID by clicking on it.
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
                placeholder="Paste team ID here"
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
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isImportingPlayers ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Players...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import Players for Team {teamId}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Additional Options */}
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
              <Target className="h-5 w-5" />
              Import Single Team by ID
            </CardTitle>
            <CardDescription>
              Import a specific team by its ID if it's not in the Premier League list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="singleTeamId">Team ID</Label>
              <Input
                id="singleTeamId"
                value={singleTeamId}
                onChange={(e) => setSingleTeamId(e.target.value)}
                placeholder="33"
              />
            </div>
            <Button 
              onClick={importTeamById} 
              disabled={isImportingTeamById}
              className="w-full"
            >
              {isImportingTeamById ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import Team
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
