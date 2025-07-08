import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface ReviewedAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewedAssignments: any[];
  onViewReport?: (player: any) => void;
}

const ReviewedAssignmentsModal = ({ 
  isOpen, 
  onClose, 
  reviewedAssignments, 
  onViewReport 
}: ReviewedAssignmentsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reviewed Assignments ({reviewedAssignments.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {reviewedAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reviewed assignments yet
            </div>
          ) : (
            reviewedAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={assignment.avatar} alt={assignment.playerName} />
                  <AvatarFallback>
                    {assignment.playerName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{assignment.playerName}</h4>
                  <p className="text-sm text-muted-foreground">{assignment.club}</p>
                  <p className="text-sm text-muted-foreground">
                    Reviewed on {new Date(assignment.reviewed_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Reviewed
                  </Badge>
                  {assignment.priority && (
                    <Badge 
                      variant={
                        assignment.priority === 'High' ? 'destructive' : 
                        assignment.priority === 'Medium' ? 'default' : 'secondary'
                      }
                    >
                      {assignment.priority}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {onViewReport && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewReport(assignment)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View Report
                    </Button>
                  )}
                  
                  {assignment.playerId && (
                    <Link 
                      to={assignment.playerId.startsWith('private-') 
                        ? `/private-player/${assignment.playerId.replace('private-', '')}` 
                        : `/player/${assignment.playerId}`
                      }
                    >
                      <Button size="sm" variant="outline">
                        <User className="h-3 w-3 mr-1" />
                        View Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewedAssignmentsModal;