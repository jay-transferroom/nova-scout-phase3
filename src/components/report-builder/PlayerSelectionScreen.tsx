
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import UnifiedPlayerSearch from "@/components/UnifiedPlayerSearch";
import { Player } from "@/types/player";

interface PlayerSelectionScreenProps {
  onSelectPlayer: (player: Player) => void;
  onBack: () => void;
}

const PlayerSelectionScreen = ({ onSelectPlayer, onBack }: PlayerSelectionScreenProps) => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Report</CardTitle>
          <p className="text-muted-foreground">First, select a player to create a report for.</p>
        </CardHeader>
        <CardContent>
          <UnifiedPlayerSearch 
            onSelectPlayer={onSelectPlayer}
            variant="full"
            placeholder="Search player name, club, position or ID"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerSelectionScreen;
