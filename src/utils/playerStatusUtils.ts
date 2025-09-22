// Unified player status determination logic
// This ensures consistent status display across all views

export type PlayerStatus = 'marked_for_scouting' | 'assigned_to_scout' | 'completed' | 'unassigned';

export interface PlayerStatusInfo {
  status: PlayerStatus;
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  scoutName?: string;
}

interface StatusDeterminationParams {
  playerId: string;
  assignments: any[];
  reports: any[];
  scoutingAssignmentPlayerIds: Set<string>;
}

export const determinePlayerStatus = ({
  playerId,
  assignments,
  reports,
  scoutingAssignmentPlayerIds
}: StatusDeterminationParams): PlayerStatusInfo => {
  
  // Check if player has any reports (completed status takes priority)
  const hasReport = reports.some(report => report.playerId === playerId);
  
  // Find active assignment for this player
  const assignment = assignments.find(a => a.player_id === playerId);
  
  // Check if player is in the scouting assignment list
  const isInScoutingList = scoutingAssignmentPlayerIds.has(playerId);
  
  // Status determination logic (in order of priority):
  
  // 1. If player has a report, they are completed
  if (hasReport) {
    const scoutName = assignment?.assigned_to_scout ? 
      `${assignment.assigned_to_scout.first_name || ''} ${assignment.assigned_to_scout.last_name || ''}`.trim() || 
      assignment.assigned_to_scout.email : 
      'Unknown Scout';
      
    return {
      status: 'completed',
      label: `${scoutName} (completed)`,
      variant: 'outline',
      className: 'bg-green-100 text-green-800 border-0',
      scoutName
    };
  }
  
  // 2. If player has an active assignment, they are assigned to scout
  if (assignment) {
    const scoutName = assignment.assigned_to_scout ? 
      `${assignment.assigned_to_scout.first_name || ''} ${assignment.assigned_to_scout.last_name || ''}`.trim() || 
      assignment.assigned_to_scout.email : 
      'Unknown Scout';
      
    const statusColors: { [key: string]: string } = {
      'assigned': 'bg-red-100 text-red-800',
      'in_progress': 'bg-orange-100 text-orange-800',
      'reviewed': 'bg-blue-100 text-blue-800'
    };
    
    const statusLabels: { [key: string]: string } = {
      'assigned': 'assigned',
      'in_progress': 'in progress', 
      'reviewed': 'reviewed'
    };
    
    return {
      status: 'assigned_to_scout',
      label: `${scoutName} (${statusLabels[assignment.status] || 'assigned'})`,
      variant: 'outline',
      className: `${statusColors[assignment.status] || statusColors.assigned} border-0`,
      scoutName
    };
  }
  
  // 3. If player is in scouting assignment list (but no active assignment), they are marked for scouting
  if (isInScoutingList) {
    return {
      status: 'marked_for_scouting',
      label: 'Marked for Scouting',
      variant: 'secondary',
      className: 'bg-orange-100 text-orange-800'
    };
  }
  
  // 4. Otherwise, they are unassigned
  return {
    status: 'unassigned',
    label: 'Unassigned',
    variant: 'secondary'
  };
};

// Helper function to get status for use in Scout Management kanban columns
export const getPlayerKanbanStatus = (statusInfo: PlayerStatusInfo): 'shortlisted' | 'assigned' | 'completed' => {
  switch (statusInfo.status) {
    case 'marked_for_scouting':
      return 'shortlisted';
    case 'assigned_to_scout':
      return 'assigned';
    case 'completed':
      return 'completed';
    default:
      return 'shortlisted'; // Default for unassigned players in kanban view
  }
};

// Helper function to create badge props from status info
export const getStatusBadgeProps = (statusInfo: PlayerStatusInfo) => {
  return {
    variant: statusInfo.variant,
    className: statusInfo.className,
    children: statusInfo.label
  };
};