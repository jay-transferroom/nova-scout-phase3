import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@/types/player";

interface PrivatePlayerNotesSectionProps {
  player: Player;
}

export const PrivatePlayerNotesSection = ({ player }: PrivatePlayerNotesSectionProps) => {
  if (!player.notes) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-3">Scout Notes</h3>
        <p className="text-gray-700">{player.notes}</p>
      </CardContent>
    </Card>
  );
};