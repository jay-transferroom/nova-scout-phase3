
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UpcomingMatches = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upcoming Matches</h1>
        <p className="text-muted-foreground mt-2">
          Schedule of upcoming matches for players you're tracking
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Match Calendar</CardTitle>
            <CardDescription>
              The upcoming match calendar will show here after you start tracking players.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Visit the Scouting Tasks section to see your assigned players and their upcoming matches.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpcomingMatches;
