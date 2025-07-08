import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/player";

interface PrivatePlayerSourceSectionProps {
  player: Player;
}

export const PrivatePlayerSourceSection = ({ player }: PrivatePlayerSourceSectionProps) => {
  if (!player.source_context) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-3">Source</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {player.source_context}
        </Badge>
      </CardContent>
    </Card>
  );
};