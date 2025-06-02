
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Users, Calendar } from "lucide-react";

const DataImport = () => {
  const [isImportingFixtures, setIsImportingFixtures] = useState(false);
  const [isImportingPlayers, setIsImportingPlayers] = useState(false);
  const [teamId, setTeamId] = useState("33"); // Default to Manchester United
  const [season, setSeason] = useState("2024");
  const { toast } = useToast();

  const importFixtures = async () => {
    setIsImportingFixtures(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-football-data');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Fixtures imported successfully!",
      });
    } catch (error) {
      console.error('Error importing fixtures:', error);
      toast({
        title: "Error",
        description: "Failed to import fixtures. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImportingFixtures(false);
    }
  };

  const importPlayers = async () => {
    setIsImportingPlayers(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-player-data', {
        body: { team_id: teamId, season: season }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Players imported successfully for team ${teamId}!`,
      });
    } catch (error) {
      console.error('Error importing players:', error);
      toast({
        title: "Error",
        description: "Failed to import players. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImportingPlayers(false);
    }
  };

  const syncPlayerForm = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-player-form');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Player form data synced successfully!",
      });
    } catch (error) {
      console.error('Error syncing player form:', error);
      toast({
        title: "Error",
        description: "Failed to sync player form data. Please try again.",
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
              Import today's matches and fixtures from the RapidAPI football data service
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
              Import player squad data for a specific team
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
            Other data management operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={syncPlayerForm} variant="outline">
            Sync Player Form Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;
