
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Globe, Database, Users } from "lucide-react";
import TeamsDisplay from "./TeamsDisplay";

const DataImport = () => {
  const [isImportingLeague, setIsImportingLeague] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState("");
  const { toast } = useToast();

  const availableLeagues = [
    'Premier League',
    'La Liga', 
    'Serie A',
    'Bundesliga',
    'Ligue 1'
  ];

  const importLeagueData = async () => {
    if (!selectedLeague) {
      toast({
        title: "Error",
        description: "Please select a league first",
        variant: "destructive",
      });
      return;
    }

    setIsImportingLeague(true);
    try {
      console.log(`Starting import for ${selectedLeague}...`);
      const { data, error } = await supabase.functions.invoke('import-league-data', {
        body: { league_name: selectedLeague }
      });
      
      if (error) {
        console.error('League import error:', error);
        throw error;
      }
      
      console.log('League import response:', data);
      toast({
        title: "Success",
        description: `Successfully imported ${selectedLeague} with ${data.teamsImported} teams and ${data.playersImported} players!`,
      });
    } catch (error) {
      console.error('Error importing league data:', error);
      toast({
        title: "Error",
        description: `Failed to import ${selectedLeague}: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsImportingLeague(false);
    }
  };

  const checkData = async () => {
    try {
      console.log('Checking current data...');
      
      // Check teams
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .limit(10);
      
      if (teamsError) throw teamsError;
      
      // Check players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .limit(10);
      
      if (playersError) throw playersError;
      
      console.log('Current teams:', teams);
      console.log('Current players:', players);
      
      toast({
        title: "Data Check Complete",
        description: `Found ${teams?.length || 0} teams and ${players?.length || 0} players in database`,
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
        <h2 className="text-2xl font-bold mb-2">League Data Import</h2>
        <p className="text-muted-foreground">
          Select a league to automatically import all teams and players. This will make them searchable in your scouting database.
        </p>
      </div>

      {/* Main League Import */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Globe className="h-5 w-5" />
            Import Complete League Data
          </CardTitle>
          <CardDescription>
            Choose a league and we'll automatically import all teams and their players for you to scout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="league-select" className="text-sm font-medium">
              Select League
            </label>
            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a league to import" />
              </SelectTrigger>
              <SelectContent>
                {availableLeagues.map((league) => (
                  <SelectItem key={league} value={league}>
                    {league}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={importLeagueData} 
            disabled={isImportingLeague || !selectedLeague}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isImportingLeague ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing {selectedLeague}...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import {selectedLeague || 'League'} Data
              </>
            )}
          </Button>
          
          {selectedLeague && (
            <p className="text-sm text-muted-foreground">
              This will import all teams and players from {selectedLeague}, making them searchable in your database.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Teams Display */}
      <TeamsDisplay />

      {/* Data Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Status
          </CardTitle>
          <CardDescription>
            Check what data is currently in your scouting database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkData} variant="outline" className="w-full">
            <Users className="mr-2 h-4 w-4" />
            Check Current Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;
