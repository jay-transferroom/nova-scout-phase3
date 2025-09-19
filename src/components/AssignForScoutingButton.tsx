import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useShortlists } from "@/hooks/useShortlists";
import { useAuth } from "@/contexts/AuthContext";
import { UserCheck, UserMinus } from "lucide-react";

interface AssignForScoutingButtonProps {
  playerId: string;
  playerName: string;
  className?: string;
}

const AssignForScoutingButton = ({ 
  playerId, 
  playerName, 
  className 
}: AssignForScoutingButtonProps) => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { 
    shortlists, 
    addPlayerToScoutingAssignment, 
    removePlayerFromScoutingAssignment 
  } = useShortlists();

  // Check if user has permission (recruitment or director)
  const canAssignForScouting = profile?.role === 'recruitment' || profile?.role === 'director';

  if (!canAssignForScouting) {
    return null;
  }

  // Find the scouting assignment list and check if player is already assigned
  const scoutingList = shortlists.find(list => list.is_scouting_assignment_list);
  const isAssigned = scoutingList?.playerIds?.includes(playerId) || false;

  const handleToggleAssignment = async () => {
    setIsLoading(true);
    try {
      if (isAssigned) {
        await removePlayerFromScoutingAssignment(playerId);
      } else {
        await addPlayerToScoutingAssignment(playerId);
      }
    } catch (error) {
      console.error('Error toggling scouting assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isAssigned ? "secondary" : "default"}
      size="sm"
      onClick={handleToggleAssignment}
      disabled={isLoading}
      className={className}
    >
      {isAssigned ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Remove from Scouting
        </>
      ) : (
        <>
          <UserCheck className="h-4 w-4 mr-2" />
          Assign for Scouting
        </>
      )}
    </Button>
  );
};

export default AssignForScoutingButton;