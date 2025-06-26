
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
      untrackPlayer(playerId, {
        onSuccess: () => {
          toast.success(`Stopped notifications for ${playerName}`);
        },
        onError: (error) => {
          console.error('Error untracking player:', error);
          toast.error("Failed to stop notifications");
        },
      });
    } else {
      trackPlayer(playerId, {
        onSuccess: () => {
          toast.success(`Now getting notifications for ${playerName} - you'll receive updates`);
        },
        onError: (error) => {
          console.error('Error tracking player:', error);
          toast.error("Failed to enable notifications");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Bell className="h-4 w-4" />
        Notify Me
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
          <Bell className="h-4 w-4 fill-current" />
          Notifications On
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          Notify Me
        </>
      )}
    </Button>
  );
};

export default TrackPlayerButton;
