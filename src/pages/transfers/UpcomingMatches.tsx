import { useFixturesData } from "@/hooks/useFixturesData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin, Trophy } from "lucide-react";
import { format } from "date-fns";

const UpcomingMatches = () => {
  const { data: fixtures = [], isLoading, error } = useFixturesData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'live':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'postponed':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading fixtures...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading fixtures. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upcoming Matches</h2>
        <p className="text-muted-foreground">Track upcoming fixtures and matches for scouting opportunities</p>
      </div>

      <div className="grid gap-4">
        {fixtures.map((fixture) => (
          <Card key={fixture.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {fixture.home_team} vs {fixture.away_team}
                </CardTitle>
                <Badge className={getStatusColor(fixture.status)}>
                  {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {fixture.competition}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(fixture.fixture_date), 'PPP p')}
                </div>
                {fixture.venue && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {fixture.venue}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            {(fixture.home_score !== null && fixture.away_score !== null) && (
              <CardContent>
                <div className="text-2xl font-bold text-center">
                  {fixture.home_score} - {fixture.away_score}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {fixtures.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          No fixtures available at the moment.
        </div>
      )}
    </div>
  );
};

export default UpcomingMatches;
