
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PlayerPitches = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Player Pitches</h1>
        <p className="text-muted-foreground mt-2">
          Review proposals from clubs and agents for players that match your requirements
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>No Active Pitches</CardTitle>
            <CardDescription>
              You don't have any player pitches at the moment. Once clubs and agents propose players to you,
              they will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create player requirements to start receiving player proposals.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerPitches;
