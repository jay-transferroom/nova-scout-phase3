
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useScouts } from "@/hooks/useScouts";
import { useCreateAssignment } from "@/hooks/useScoutingAssignments";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { usePlayerAssignments } from "@/hooks/usePlayerAssignments";
import PlayerInfoCard from "@/components/assignment/PlayerInfoCard";
import ScoutSelectionForm from "@/components/assignment/ScoutSelectionForm";

interface Player {
  id: string;
  name: string;
  club: string;
  positions: string[];
}

interface AssignScoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
}

const AssignScoutDialog = ({ isOpen, onClose, player }: AssignScoutDialogProps) => {
  const { user, profile } = useAuth();
  const { data: scouts = [] } = useScouts();
  const { data: playerAssignments = [] } = usePlayerAssignments();
  const createAssignment = useCreateAssignment();

  // Find existing assignment for this player
  const existingAssignment = player ? 
    playerAssignments.find(assignment => assignment.player_id === player.id) : 
    null;

  // Combine current user with other scouts for the dropdown
  const allScoutOptions = [
    // Add current user if they have scout role
    ...(profile?.role === 'scout' ? [{
      id: user?.id || '',
      first_name: profile?.first_name || 'Me',
      last_name: profile?.last_name ? `(${profile.last_name})` : '',
      email: profile?.email || ''
    }] : []),
    // Add other scouts
    ...scouts.filter(scout => scout.id !== user?.id)
  ];

  const handleSubmit = async (formData: {
    selectedScout: string;
    priority: "High" | "Medium" | "Low";
    reportType: string;
    deadline?: Date;
    notes: string;
  }) => {
    if (!player || !user) return;

    try {
      console.log("Creating assignment with player ID:", player.id, "type:", typeof player.id);
      
      // Use the players_new ID directly as a string in the assignment
      await createAssignment.mutateAsync({
        player_id: player.id, // This should be the players_new.id as string
        assigned_to_scout_id: formData.selectedScout,
        assigned_by_manager_id: user.id,
        priority: formData.priority,
        status: 'assigned',
        assignment_notes: formData.notes || undefined,
        deadline: formData.deadline ? formData.deadline.toISOString().split('T')[0] : undefined,
        report_type: formData.reportType,
      });

      // Find the selected scout's name for the notification
      const selectedScoutInfo = allScoutOptions.find(scout => scout.id === formData.selectedScout);
      const scoutName = selectedScoutInfo ? 
        `${selectedScoutInfo.first_name} ${selectedScoutInfo.last_name}`.trim() || selectedScoutInfo.email :
        'Unknown Scout';

      const actionType = existingAssignment ? "reassigned to" : "assigned to";
      toast({
        title: existingAssignment ? "Assignment Updated" : "Assignment Created",
        description: `${player.name} has been ${actionType} ${scoutName} for scouting.`,
      });

      onClose();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: `Failed to ${existingAssignment ? 'update' : 'create'} assignment. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingAssignment ? 'Reassign Scout' : 'Assign Scout'}
          </DialogTitle>
        </DialogHeader>
        
        {player && (
          <div className="space-y-4">
            <PlayerInfoCard 
              player={player} 
              existingAssignment={existingAssignment} 
            />
            
            <ScoutSelectionForm
              allScoutOptions={allScoutOptions}
              existingAssignment={existingAssignment}
              isOpen={isOpen}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={createAssignment.isPending}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignScoutDialog;
