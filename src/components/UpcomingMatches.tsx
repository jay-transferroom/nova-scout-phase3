import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFixturesData, Fixture } from "@/hooks/useFixturesData";
import { format, isAfter, isToday, isTomorrow, addDays } from "date-fns";

const UpcomingMatches = () => {
  const navigate = useNavigate();
  const { data: fixtures = [], isLoading } = useFixturesData();

  // Filter for upcoming matches (next 7 days)
  const now = new Date();
  const nextWeek = addDays(now, 7);
  
  const upcomingMatches = fixtures
    .filter(fixture => {
      const fixtureDate = new Date(fixture.match_date_utc);
      return isAfter(fixtureDate, now) && !isAfter(fixtureDate, nextWeek) && fixture.status !== 'completed';
    })
    .slice(0, 5);

  const getMatchDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return "Today";
    }
    
    if (isTomorrow(date)) {
      return "Tomorrow";
    }
    
    return format(date, "MMM dd");
  };

  const getMatchTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading matches...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Matches
          </div>
          <Badge variant="secondary">{upcomingMatches.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingMatches.length > 0 ? (
          <div className="space-y-3">
            {upcomingMatches.map((match, index) => (
              <div
                key={`${match.match_number}-${index}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    <span>{match.home_team}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span>{match.away_team}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{getMatchDateDisplay(match.match_date_utc)} at {getMatchTime(match.match_date_utc)}</span>
                    </div>
                    {match.venue && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{match.venue}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {match.competition}
                  </Badge>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/calendar")}
            >
              View Full Calendar
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No upcoming matches in the next 7 days</p>
            <Button
              variant="outline"
              onClick={() => navigate("/calendar")}
            >
              View Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMatches;