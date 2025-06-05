
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataImport } from "@/hooks/useDataImport";
import { toast } from "sonner";
import { Loader2, Download, Database, AlertCircle } from "lucide-react";

const DataImport = () => {
  const [selectedLeague, setSelectedLeague] = useState("");
  const [forceReimport, setForceReimport] = useState(false);
  const { isImporting, importProgress, importLeagueData } = useDataImport();
  const [importResults, setImportResults] = useState<{
    message: string;
    league: string;
    teams: number;
    players: number;
    duplicatesSkipped: number;
    totalTeams: number;
    forceReimport: boolean;
  } | null>(null);

  const handleImportData = async () => {
    if (!selectedLeague) {
      toast.error("Please select a league to import");
      return;
    }

    const result = await importLeagueData(selectedLeague, forceReimport);
    if (result.success) {
      setImportResults({
        message: result.message,
        league: result.league,
        teams: result.teams,
        players: result.players,
        duplicatesSkipped: result.duplicatesSkipped,
        totalTeams: result.totalTeams,
        forceReimport: result.forceReimport
      });
    }
  };

  const handleForceReimportChange = (checked: boolean | "indeterminate") => {
    setForceReimport(checked === true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Data Import</h1>
        <p className="text-muted-foreground mt-2">
          Import football data from external APIs to populate your database
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
              Import teams and players for a specific league from external APIs.
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
                Force Re-import (Clears existing data for selected league)
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

            {isImporting && importProgress && (
              <div className="text-sm text-muted-foreground">
                Status: {importProgress}
              </div>
            )}

            {importResults && (
              <div className="space-y-2">
                <p><strong>{importResults.message}</strong></p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    League: {importResults.league}
                  </Badge>
                  <Badge variant="secondary">
                    Teams: {importResults.teams} / {importResults.totalTeams}
                  </Badge>
                  <Badge variant="default">
                    Players: {importResults.players}
                  </Badge>
                  {importResults.duplicatesSkipped > 0 && (
                    <Badge variant="outline">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Duplicates Skipped: {importResults.duplicatesSkipped}
                    </Badge>
                  )}
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
              This will import teams, players, and fixtures (Premier League only) for the selected league using external football APIs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Status</CardTitle>
            <CardDescription>
              Monitor the progress of your data imports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isImporting ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Import in progress...</span>
                </div>
                {importProgress && (
                  <p className="text-sm text-muted-foreground">{importProgress}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  No import currently running. Select a league and click "Import Data" to begin.
                </p>
                <div className="text-xs text-muted-foreground">
                  <p><strong>Note:</strong> Match fixtures are currently only available for Premier League imports.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataImport;
