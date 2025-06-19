
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportWithPlayer } from "@/types/report";
import { formatDate, getRatingColor } from "@/utils/reportFormatting";
import { getOverallRating, getRecommendation } from "@/utils/reportDataExtraction";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PlayerReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  reports: ReportWithPlayer[];
  onViewReport: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onDeleteReport: (reportId: string, playerName: string) => void;
}

const PlayerReportsModal = ({ 
  isOpen, 
  onClose, 
  playerName, 
  reports, 
  onViewReport, 
  onEditReport, 
  onDeleteReport 
}: PlayerReportsModalProps) => {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Reports for {playerName} ({reports.length})</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {reports.map((report) => {
            const canEdit = user && report.scoutId === user.id;
            const overallRating = getOverallRating(report);
            const recommendation = getRecommendation(report);

            return (
              <div key={report.id} className="border rounded-lg p-4 bg-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === "submitted" ? "secondary" : "outline"}>
                        {report.status === "draft" ? "Draft" : "Submitted"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scout: {report.scoutProfile?.first_name || "Unknown"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {overallRating !== null && overallRating !== undefined && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <span className={`font-semibold text-lg ${getRatingColor(overallRating)}`}>
                          {overallRating}
                        </span>
                      </div>
                    )}
                    
                    {recommendation && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Recommendation</p>
                        <span className={`font-medium ${getRatingColor(recommendation)}`}>
                          {recommendation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      onViewReport(report.id);
                      onClose();
                    }}
                    title="View report"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {canEdit && onEditReport && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onEditReport(report.id);
                        onClose();
                      }}
                      title="Edit report"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {canEdit && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onDeleteReport(report.id, playerName);
                        onClose();
                      }}
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerReportsModal;
