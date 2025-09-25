import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useFixturesData } from "@/hooks/useFixturesData";
import { format, isAfter, isBefore } from "date-fns";
import { Player } from "@/types/player";

interface PlayerMatchDataSectionProps {
  player: Player;
}

export const PlayerMatchDataSection = ({ player }: PlayerMatchDataSectionProps) => {
  const { data: fixtures = [], isLoading } = useFixturesData();
  
  const now = new Date();
  
  // Filter and sort fixtures
  const pastFixtures = fixtures
    .filter(fixture => {
      const fixtureDate = new Date(fixture.match_date_utc);
      return isBefore(fixtureDate, now) && 
             fixture.status === 'finished' &&
             (fixture.home_team === player.club || fixture.away_team === player.club);
    })
    .sort((a, b) => new Date(b.match_date_utc).getTime() - new Date(a.match_date_utc).getTime())
    .slice(0, 5);

  const upcomingFixtures = fixtures
    .filter(fixture => {
      const fixtureDate = new Date(fixture.match_date_utc);
      return isAfter(fixtureDate, now) && 
             fixture.status !== 'finished' &&
             (fixture.home_team === player.club || fixture.away_team === player.club);
    })
    .sort((a, b) => new Date(a.match_date_utc).getTime() - new Date(b.match_date_utc).getTime())
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
        <CardHeader>
          <CardTitle>Recent Results & Upcoming Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading match data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Results & Upcoming Fixtures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Results */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Last 5 Results
          </h4>
          {pastFixtures.length > 0 ? (
            <div className="space-y-2">
              {pastFixtures.map((fixture, index) => {
                const isHome = fixture.home_team === player.club;
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
        </div>

        {/* Upcoming Fixtures */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Next 5 Fixtures
          </h4>
          {upcomingFixtures.length > 0 ? (
            <div className="space-y-2">
              {upcomingFixtures.map((fixture, index) => {
                const isHome = fixture.home_team === player.club;
                const opponent = isHome ? fixture.away_team : fixture.home_team;
                const fixtureDate = new Date(fixture.match_date_utc);
                
                return (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {isHome ? 'vs' : '@'} {opponent}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>{fixture.competition}</span>
                          {fixture.venue && (
                            <>
                              <span>•</span>
                              <MapPin className="w-3 h-3" />
                              <span>{fixture.venue}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">
                        {format(fixtureDate, 'MMM dd')}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {format(fixtureDate, 'HH:mm')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No upcoming fixtures scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};