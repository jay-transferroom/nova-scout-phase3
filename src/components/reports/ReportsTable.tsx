
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Trash2, Edit, Eye } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { getRatingColor, formatDate } from "@/utils/reportFormatting";
import { getOverallRating, getRecommendation } from "@/utils/reportDataExtraction";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface ReportsTableProps {
  reports: ReportWithPlayer[];
  onViewReport: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onDeleteReport: (reportId: string, playerName: string) => void;
}

const ReportsTable = ({ reports, onViewReport, onEditReport, onDeleteReport }: ReportsTableProps) => {
  const { user } = useAuth();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Club</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Report Date</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              <Award size={14} />
              <span>Rating</span>
            </div>
          </TableHead>
          <TableHead>Recommendation</TableHead>
          <TableHead>Scout</TableHead>
          <TableHead className="w-[200px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.length > 0 ? (
          reports.map((report) => {
            const canEdit = user && report.scoutId === user.id;
            const overallRating = getOverallRating(report);
            const recommendation = getRecommendation(report);

            return (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.player?.name}</TableCell>
                <TableCell>{report.player?.club}</TableCell>
                <TableCell>{report.player?.positions?.join(", ")}</TableCell>
                <TableCell>{formatDate(report.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={report.status === "submitted" ? "secondary" : "outline"}>
                    {report.status === "draft" ? "Draft" : "Submitted"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {overallRating !== null && overallRating !== undefined ? (
                    <span className={`font-semibold text-base ${getRatingColor(overallRating)}`}>
                      {overallRating}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {recommendation ? (
                    <span className="text-slate-600 font-medium">
                      {recommendation}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {report.scoutProfile?.first_name || "Scout"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewReport(report.id)}
                      title="View report"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canEdit && onEditReport && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditReport(report.id)}
                        title="Edit report"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canEdit && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeleteReport(report.id, report.player?.name || "Unknown")}
                        title="Delete report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
              No reports found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ReportsTable;
