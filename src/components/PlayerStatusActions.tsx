import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  UserPlus, 
  Plus, 
  Eye, 
  Heart, 
  HeartOff,
  UserCheck,
  UserMinus,
  PlayCircle,
  MoreHorizontal
} from "lucide-react";
import { usePlayerAssignments } from "@/hooks/usePlayerAssignments";
import { useShortlists } from "@/hooks/useShortlists";
import { usePlayerTracking } from "@/hooks/usePlayerTracking";
import { useAuth } from "@/contexts/AuthContext";
import { ReportWithPlayer } from "@/types/report";

interface PlayerStatusActionsProps {
  playerId: string;
  playerName: string;
  playerReports: ReportWithPlayer[];
}

const PlayerStatusActions = ({ playerId, playerName, playerReports }: PlayerStatusActionsProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get player data from various hooks
  const { data: assignments = [] } = usePlayerAssignments();
  const { shortlists, getPlayerShortlists, addPlayerToScoutingAssignment, removePlayerFromScoutingAssignment } = useShortlists();
  const { isTracking, trackPlayer, untrackPlayer, isTrackingPlayer, isUntrackingPlayer } = usePlayerTracking(playerId);

  // Find assignment for this player
  const playerAssignment = assignments.find(assignment => assignment.player_id === playerId);
  
  // Get shortlists this player is in
  const playerShortlists = getPlayerShortlists(playerId);
  
  // Check if player is in scouting assignment list
  const scoutingList = shortlists.find(list => list.is_scouting_assignment_list);
  const isAssignedForScouting = scoutingList?.playerIds?.includes(playerId) || false;

  // Check permissions
  const canAssignScout = profile?.role === 'recruitment' || profile?.role === 'director';
  const canAssignForScouting = profile?.role === 'recruitment' || profile?.role === 'director';

  // Action handlers
  const handleCreateReport = () => {
    navigate('/report-builder', { state: { selectedPlayerId: playerId } });
  };

  const handleViewReports = () => {
    navigate(`/reports?player=${playerId}`);
  };

  const handleAssignScout = () => {
    // TODO: Open assign scout dialog
    console.log('Assign scout to player', playerId);
  };

  const handleAddToShortlist = () => {
    // TODO: Open add to shortlist dialog
    console.log('Add player to shortlist', playerId);
  };

  const handleToggleTracking = () => {
    if (isTracking) {
      untrackPlayer(playerId);
    } else {
      trackPlayer(playerId);
    }
  };

  const handleToggleScoutingAssignment = async () => {
    setIsLoading(true);
    try {
      if (isAssignedForScouting) {
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

  // Status indicators
  const getAssignmentStatus = () => {
    if (!playerAssignment) {
      return {
        icon: <AlertCircle className="w-4 h-4 text-muted-foreground" />,
        text: "Unassigned",
        variant: "secondary" as const,
        priority: null
      };
    }

    const status = playerAssignment.status;
    const priority = playerAssignment.priority;

    switch (status) {
      case 'assigned':
        return {
          icon: <Clock className="w-4 h-4 text-orange-500" />,
          text: `Assigned to ${playerAssignment.assigned_to_scout?.first_name || 'Scout'}`,
          variant: "secondary" as const,
          priority
        };
      case 'in_progress':
        return {
          icon: <PlayCircle className="w-4 h-4 text-blue-500" />,
          text: "Report in Progress",
          variant: "default" as const,
          priority
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: "Report Completed",
          variant: "default" as const,
          priority
        };
      case 'reviewed':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: "Report Reviewed",
          variant: "default" as const,
          priority
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 text-muted-foreground" />,
          text: "Unknown Status",
          variant: "secondary" as const,
          priority
        };
    }
  };

  const assignmentStatus = getAssignmentStatus();
  const reportCount = playerReports.length;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Status Section */}
          <div className="flex items-center gap-6">
            {/* Assignment Status */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {assignmentStatus.icon}
                <span className="text-sm font-medium">{assignmentStatus.text}</span>
              </div>
              {assignmentStatus.priority && (
                <Badge 
                  variant={
                    assignmentStatus.priority === 'High' ? 'destructive' :
                    assignmentStatus.priority === 'Medium' ? 'default' : 'secondary'
                  } 
                  className="text-xs"
                >
                  {assignmentStatus.priority.toUpperCase()} PRIORITY
                </Badge>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Reports & Tracking Status */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className={reportCount === 0 ? "text-orange-600 font-medium" : ""}>
                {reportCount} Report{reportCount !== 1 ? 's' : ''}
              </span>
              <span>{playerShortlists.length} Shortlist{playerShortlists.length !== 1 ? 's' : ''}</span>
              {isTracking && (
                <div className="flex items-center gap-1 text-green-600">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Tracked</span>
                </div>
              )}
              {isAssignedForScouting && (
                <div className="flex items-center gap-1 text-blue-600">
                  <UserCheck className="w-4 h-4" />
                  <span>On Watchlist</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2">
            {/* Primary action based on state */}
            {reportCount === 0 ? (
              <Button onClick={handleCreateReport} className="gap-2">
                <FileText className="w-4 h-4" />
                Create First Report
              </Button>
            ) : (
              <Button variant="outline" onClick={handleViewReports} className="gap-2">
                <Eye className="w-4 h-4" />
                View Reports ({reportCount})
              </Button>
            )}

            {/* Secondary actions in dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Assignment actions */}
                {!playerAssignment && canAssignScout && (
                  <>
                    <DropdownMenuItem onClick={handleAssignScout}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign to Scout
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Scouting assignment toggle */}
                {canAssignForScouting && (
                  <DropdownMenuItem
                    onClick={handleToggleScoutingAssignment}
                    disabled={isLoading}
                  >
                    {isAssignedForScouting ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove from Shortlist
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Add to Shortlist
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                {/* Tracking toggle */}
                <DropdownMenuItem
                  onClick={handleToggleTracking}
                  disabled={isTrackingPlayer || isUntrackingPlayer}
                >
                  {isTracking ? (
                    <>
                      <HeartOff className="w-4 h-4 mr-2" />
                      Stop Following
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </DropdownMenuItem>

                {/* Add to shortlist */}
                <DropdownMenuItem onClick={handleAddToShortlist}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Shortlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStatusActions;