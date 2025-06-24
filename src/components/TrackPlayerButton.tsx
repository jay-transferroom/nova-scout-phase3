
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";
import { usePlayerTracking } from "@/hooks/usePlayerTracking";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TrackPlayerButtonProps {
  playerId: string;
  playerName: string;
}

const TrackPlayerButton = ({ playerId, playerName }: TrackPlayerButtonProps) => {
  const { user } = useAuth();
  const { isTracking, isLoading, trackPlayer, untrackPlayer, isTrackingPlayer, isUntrackingPlayer } = usePlayerTracking(playerId);

  const handleToggleTracking = () => {
    if (!user) {
      toast.error("Please sign in to track players");
      return;
    }

    if (isTracking) {
      untrackPlayer(playerId, {
        onSuccess: () => {
          toast.success(`Stopped tracking ${playerName}`);
        },
        onError: (error) => {
          console.error('Error untracking player:', error);
          toast.error("Failed to untrack player");
        },
      });
    } else {
      trackPlayer(playerId, {
        onSuccess: () => {
          toast.success(`Now tracking ${playerName} - you'll receive notifications about updates`);
        },
        onError: (error) => {
          console.error('Error tracking player:', error);
          toast.error("Failed to track player");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Star className="h-4 w-4" />
        Track Player
      </Button>
    );
  }

  return (
    <Button
      variant={isTracking ? "default" : "outline"}
      onClick={handleToggleTracking}
      disabled={isTrackingPlayer || isUntrackingPlayer}
      className="gap-2"
    >
      {isTracking ? (
        <>
          <Star className="h-4 w-4 fill-current" />
          Tracking
        </>
      ) : (
        <>
          <StarOff className="h-4 w-4" />
          Track Player
        </>
      )}
    </Button>
  );
};

export default TrackPlayerButton;
