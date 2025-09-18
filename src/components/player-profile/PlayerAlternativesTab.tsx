import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@/types/player";

interface PlayerAlternativesTabProps {
  player: Player;
}

export const PlayerAlternativesTab = ({ player }: PlayerAlternativesTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Alternatives</h2>
      
      <Card>
        <CardContent className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Player Alternatives</p>
            <p>Alternative player suggestions would be displayed here based on similar playing style, position, and performance metrics.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};