import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useFixturesData } from "@/hooks/useFixturesData";
import { format, isAfter } from "date-fns";
import { Player } from "@/types/player";

interface PlayerUpcomingFixturesProps {
  player: Player;
}

export const PlayerUpcomingFixtures = ({ player }: PlayerUpcomingFixturesProps) => {
  const { data: fixtures = [], isLoading } = useFixturesData();
  
  const now = new Date();
  
  // Normalize team name for matching (remove FC, AFC, etc.)
  const normalizeTeamName = (teamName: string) => {
    return teamName.replace(/\s+(FC|AFC|United)$/i, '').trim();
  };
  
  const playerTeamNormalized = normalizeTeamName(player.club);
  
  // Filter and sort upcoming fixtures
  const upcomingFixtures = fixtures
    .filter(fixture => {
      const fixtureDate = new Date(fixture.match_date_utc);
      const homeTeamMatch = normalizeTeamName(fixture.home_team) === playerTeamNormalized;
      const awayTeamMatch = normalizeTeamName(fixture.away_team) === playerTeamNormalized;
      
      return isAfter(fixtureDate, now) && 
             fixture.status !== 'Played' &&
             (homeTeamMatch || awayTeamMatch);
    })
    .sort((a, b) => new Date(a.match_date_utc).getTime() - new Date(b.match_date_utc).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold">Upcoming Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading fixtures...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold">Upcoming Fixtures</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingFixtures.length > 0 ? (
          <div className="space-y-2">
            {upcomingFixtures.map((fixture, index) => {
              const isHome = normalizeTeamName(fixture.home_team) === playerTeamNormalized;
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
      </CardContent>
    </Card>
  );
};