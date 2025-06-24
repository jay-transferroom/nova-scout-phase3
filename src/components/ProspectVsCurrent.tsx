
import { TrendingUp, Star } from "lucide-react";
import { Player } from "@/types/player";
import { Prospect } from "@/data/mockProspects";

interface ProspectVsCurrentProps {
  currentBest: Player | null;
  prospect: Prospect;
}

const ProspectVsCurrent = ({ currentBest, prospect }: ProspectVsCurrentProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          Current Best
        </h4>
        {currentBest ? (
          <div className="p-3 border rounded-lg">
            <div className="font-medium">{currentBest.name}</div>
            <div className="text-sm text-muted-foreground mb-2">
              {currentBest.club} • Age {currentBest.age}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Rating</span>
                <span className="font-medium">
                  {currentBest.recentForm?.rating ? currentBest.recentForm.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Matches</span>
                <span className="font-medium">{currentBest.recentForm?.matches || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Goals</span>
                <span className="font-medium">{currentBest.recentForm?.goals || 0}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">No current players for this position</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Star className="h-4 w-4 text-green-600" />
          Prospect
        </h4>
        <div className="p-3 border rounded-lg border-green-200 bg-green-50">
          <div className="font-medium">{prospect.name}</div>
          <div className="text-sm text-muted-foreground mb-2">
            {prospect.club} • Age {prospect.age}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Rating</span>
              <span className="font-medium text-green-600">{prospect.rating}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>xTV</span>
              <span className="font-medium text-green-600">£{prospect.xTV}M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectVsCurrent;
