
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw } from "lucide-react";

interface Team {
  id: string;
  name: string;
  league: string;
  country: string;
  venue: string | null;
  external_api_id: string;
  logo_url: string | null;
  founded: number | null;
}

const TeamsDisplay = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('league', 'Premier League')
        .order('name');

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const copyTeamId = (teamId: string, teamName: string) => {
    navigator.clipboard.writeText(teamId);
    toast({
      title: "Copied!",
      description: `${teamName} ID (${teamId}) copied to clipboard`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Premier League Teams
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTeams}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Teams imported from the database. Click on a team ID to copy it for player imports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No Premier League teams found. Import teams first to see them here.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={team.logo_url || `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`}
                    alt={`${team.name} logo`}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{team.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{team.venue || 'No venue info'}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyTeamId(team.external_api_id, team.name)}
                >
                  <Copy className="mr-2 h-3 w-3" />
                  ID: {team.external_api_id}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamsDisplay;
