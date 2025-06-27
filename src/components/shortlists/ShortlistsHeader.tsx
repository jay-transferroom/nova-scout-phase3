
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Shortlist {
  id: string;
  name: string;
  description: string;
  color: string;
  filter: (player: any) => boolean;
}

interface ShortlistsHeaderProps {
  currentList: Shortlist | undefined;
  playerCount: number;
  onExportList: () => void;
}

export const ShortlistsHeader = ({ currentList, playerCount, onExportList }: ShortlistsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <CardTitle>{currentList?.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {currentList?.description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {playerCount} players
        </Badge>
        <Button variant="outline" size="sm" onClick={onExportList}>
          <Download className="h-4 w-4 mr-1" />
          Export List
        </Button>
      </div>
    </div>
  );
};
