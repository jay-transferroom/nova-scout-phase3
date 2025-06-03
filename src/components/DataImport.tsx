
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download, Database, AlertCircle } from "lucide-react";
import TeamsDisplay from "./TeamsDisplay";
import PlayerPhotoUpdater from "./PlayerPhotoUpdater";

const DataImport = () => {
  const [selectedLeague, setSelectedLeague] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [forceReimport, setForceReimport] = useState(false);
  const [importResults, setImportResults] = useState<{
    message: string;
    league: string;
    teamsImported: number;
    playersImported: number;
    totalTeams: number;
    forceReimport: boolean;
  } | null>(null);

  const handleImportData = async () => {
    setIsImporting(true);
    setImportResults(null);

    try {
      console.log(`Starting data import for ${selectedLeague}, force reimport: ${forceReimport}`);

      const { data, error } = await supabase.functions.invoke('import-league-data', {
        body: { league_name: selectedLeague, force_reimport: forceReimport }
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (!data?.message) {
        throw new Error(data?.error || 'Unknown error occurred');
      }

      setImportResults({
        message: data.message,
        league: data.league,
        teamsImported: data.teamsImported,
        playersImported: data.playersImported,
        totalTeams: data.totalTeams,
        forceReimport: data.forceReimport
      });

      toast.success(data.message);

    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleForceReimportChange = (checked: boolean | "indeterminate") => {
    setForceReimport(checked === true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Import</h1>
        <p className="text-muted-foreground">
          Import football data from external APIs to populate your database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              League Import
            </CardTitle>
            <CardDescription>
              Import teams and players for a specific league.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={(value) => setSelectedLeague(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select League" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Premier League">Premier League</SelectItem>
                <SelectItem value="La Liga">La Liga</SelectItem>
                <SelectItem value="Serie A">Serie A</SelectItem>
                <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                <SelectItem value="Ligue 1">Ligue 1</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox id="force-reimport" onCheckedChange={handleForceReimportChange} />
              <label
                htmlFor="force-reimport"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Force Re-import (Deletes existing data)
              </label>
            </div>

            <Button onClick={handleImportData} disabled={isImporting || !selectedLeague} className="w-full">
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import Data
                </>
              )}
            </Button>

            {importResults && (
              <div className="space-y-2">
                <p><strong>{importResults.message}</strong></p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Teams: {importResults.teamsImported} / {importResults.totalTeams}
                  </Badge>
                  <Badge variant="default">
                    Players: {importResults.playersImported}
                  </Badge>
                  {importResults.forceReimport && (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Forced Re-import
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              This will import teams and players for the selected league.
            </p>
          </CardContent>
        </Card>
        
        <PlayerPhotoUpdater />
      </div>

      <TeamsDisplay />
    </div>
  );
};

export default DataImport;
