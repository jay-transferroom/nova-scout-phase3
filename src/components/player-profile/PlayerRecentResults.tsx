import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFixturesData } from "@/hooks/useFixturesData";
import { format, isBefore } from "date-fns";
import { Player } from "@/types/player";

interface PlayerRecentResultsProps {
  player: Player;
}

export const PlayerRecentResults = ({ player }: PlayerRecentResultsProps) => {
  const { data: fixtures = [], isLoading } = useFixturesData();
  
  const now = new Date();
  
  // Normalize team name for matching (remove FC, AFC, etc.)
  const normalizeTeamName = (teamName: string) => {
    return teamName.replace(/\s+(FC|AFC|United)$/i, '').trim();
  };
  
  const playerTeamNormalized = normalizeTeamName(player.club);
  
  // Filter and sort recent results
  const pastFixtures = fixtures
    .filter(fixture => {
      const fixtureDate = new Date(fixture.match_date_utc);
      const homeTeamMatch = normalizeTeamName(fixture.home_team) === playerTeamNormalized;
      const awayTeamMatch = normalizeTeamName(fixture.away_team) === playerTeamNormalized;
      
      return isBefore(fixtureDate, now) && 
             fixture.status === 'Played' &&
             (homeTeamMatch || awayTeamMatch);
    })
    .sort((a, b) => new Date(b.match_date_utc).getTime() - new Date(a.match_date_utc).getTime())
    .slice(0, 5);

  const getResultBadgeVariant = (fixture: any, isHome: boolean) => {
    if (!fixture.home_score || !fixture.away_score) return "secondary";
    
    const homeScore = fixture.home_score;
    const awayScore = fixture.away_score;
    
    if (homeScore === awayScore) return "secondary";
    
    const won = isHome ? homeScore > awayScore : awayScore > homeScore;
    return won ? "default" : "destructive";
  };

  const getResultText = (fixture: any, isHome: boolean) => {
    if (!fixture.home_score || !fixture.away_score) return "N/A";
    
    const homeScore = fixture.home_score;
    const awayScore = fixture.away_score;
    
    if (homeScore === awayScore) return "D";
    
    const won = isHome ? homeScore > awayScore : awayScore > homeScore;
    return won ? "W" : "L";
  };

  if (isLoading) {
    return (
      <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold">Recent Results</CardTitle>
      </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">Recent Results</CardTitle>
        </CardHeader>
      <CardContent>
        {pastFixtures.length > 0 ? (
          <div className="space-y-2">
            {pastFixtures.map((fixture, index) => {
              const isHome = normalizeTeamName(fixture.home_team) === playerTeamNormalized;
              const opponent = isHome ? fixture.away_team : fixture.home_team;
              const score = `${fixture.home_score}-${fixture.away_score}`;
              
              return (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getResultBadgeVariant(fixture, isHome)}
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                    >
                      {getResultText(fixture, isHome)}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">
                        {isHome ? 'vs' : '@'} {opponent}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {fixture.competition}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{score}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(fixture.match_date_utc), 'MMM dd')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No recent results available
          </div>
        )}
      </CardContent>
    </Card>
  );
};