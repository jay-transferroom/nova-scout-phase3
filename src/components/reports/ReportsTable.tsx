
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Trash2 } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { groupReportsByPlayer } from "@/utils/reportGrouping";
import { getRatingColor, formatDate } from "@/utils/reportFormatting";

interface ReportsTableProps {
  reports: ReportWithPlayer[];
  onViewReport: (reportId: string) => void;
  onDeleteReport: (reportId: string, playerName: string) => void;
}

const ReportsTable = ({ reports, onViewReport, onDeleteReport }: ReportsTableProps) => {
  const groupedReports = groupReportsByPlayer(reports);
  console.log('Final grouped reports with ratings:', groupedReports);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Club</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Reports</TableHead>
          <TableHead>Latest Report</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              <Award size={14} />
              <span>Avg Rating</span>
            </div>
          </TableHead>
          <TableHead>Recommendation</TableHead>
          <TableHead>Scout</TableHead>
          <TableHead className="w-[150px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupedReports.length > 0 ? (
          groupedReports.map((groupedReport) => {
            return (
              <TableRow key={groupedReport.playerId}>
                <TableCell className="font-medium">{groupedReport.player?.name}</TableCell>
                <TableCell>{groupedReport.player?.club}</TableCell>
                <TableCell>{groupedReport.player?.positions?.join(", ")}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {groupedReport.reportCount} report{groupedReport.reportCount > 1 ? 's' : ''}
                  </span>
                </TableCell>
                <TableCell>{formatDate(groupedReport.createdAt)}</TableCell>
                <TableCell>
                  {groupedReport.status === "draft" ? (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Draft
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Submitted
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {groupedReport.avgRating !== null && groupedReport.avgRating !== undefined ? (
                    <span className={`font-semibold text-base ${getRatingColor(groupedReport.avgRating)}`}>
                      {groupedReport.avgRating}
                      {groupedReport.reportCount > 1 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (avg)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {groupedReport.recommendation ? (
                    <span className={getRatingColor(groupedReport.recommendation)}>
                      {groupedReport.recommendation}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {groupedReport.scoutProfile?.first_name || "Scout"}
                  {groupedReport.reportCount > 1 && (
                    <span className="text-xs text-muted-foreground block">
                      +{groupedReport.reportCount - 1} more
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewReport(groupedReport.id)}
                      title={groupedReport.reportCount > 1 ? "View latest report" : "View report"}
                    >
                      View Latest
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteReport(groupedReport.id, groupedReport.player?.name || "Unknown")}
                      title="Delete latest report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
              No reports found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ReportsTable;
