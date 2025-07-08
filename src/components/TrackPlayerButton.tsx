
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
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
      toast.error("Please sign in to get notifications");
      return;
    }

    if (isTracking) {
      untrackPlayer(playerId);
    } else {
      trackPlayer(playerId);
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled size="sm" className="gap-1">
        <Bell className="h-3 w-3" />
        Track
      </Button>
    );
  }

  return (
    <Button
      variant={isTracking ? "default" : "outline"}
      onClick={handleToggleTracking}
      disabled={isTrackingPlayer || isUntrackingPlayer}
      size="sm"
      className="gap-1"
    >
      {isTracking ? (
        <>
          <Bell className="h-3 w-3 fill-current" />
          On
        </>
      ) : (
        <>
          <BellOff className="h-3 w-3" />
          Track
        </>
      )}
    </Button>
  );
};

export default TrackPlayerButton;
