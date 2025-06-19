
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Trash2 } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";

interface ReportsTableProps {
  reports: ReportWithPlayer[];
  onViewReport: (reportId: string) => void;
  onDeleteReport: (reportId: string, playerName: string) => void;
}

// Helper function to get rating color based on value
const getRatingColor = (value: any): string => {
  if (typeof value === "number") {
    if (value >= 8) return "text-green-600";
    if (value >= 6) return "text-amber-600";
    return "text-red-600";
  }
  
  if (typeof value === "string") {
    if (["A", "A+", "Priority Sign", "Sign"].includes(value)) return "text-green-600";
    if (["B", "B+", "Consider"].includes(value)) return "text-red-600";
    return "text-red-600";
  }
  
  return "";
};

// Helper function to group reports by player
const groupReportsByPlayer = (reports: ReportWithPlayer[]) => {
  const grouped = reports.reduce((acc, report) => {
    const playerId = report.playerId;
    if (!acc[playerId]) {
      acc[playerId] = [];
    }
    acc[playerId].push(report);
    return acc;
  }, {} as Record<string, ReportWithPlayer[]>);

  return Object.values(grouped).map(playerReports => {
    // Sort by most recent first
    const sortedReports = playerReports.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const mostRecentReport = sortedReports[0];
    
    // Get all ratings for this player
    const ratings = sortedReports
      .map(report => getOverallRating(report))
      .filter(rating => rating !== null && typeof rating === "number") as number[];

    // Calculate average rating
    const avgRating = ratings.length > 0 
      ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
      : null;

    // Get the most recent recommendation
    const recommendation = getRecommendation(mostRecentReport);

    return {
      ...mostRecentReport,
      reportCount: sortedReports.length,
      avgRating,
      recommendation,
      allReports: sortedReports
    };
  });
};

// Get overall rating from a report
const getOverallRating = (report: ReportWithPlayer) => {
  const overallSection = report.sections?.find((section: any) => section.sectionId === "overall");
  if (!overallSection) return null;
  
  const ratingField = overallSection.fields?.find((field: any) => field.fieldId === "overallRating");
  return ratingField?.value;
};

// Get recommendation from a report
const getRecommendation = (report: ReportWithPlayer) => {
  const overallSection = report.sections?.find((section: any) => section.sectionId === "overall");
  if (!overallSection) return null;
  
  const recommendationField = overallSection.fields?.find((field: any) => field.fieldId === "recommendation");
  return recommendationField?.value;
};

const ReportsTable = ({ reports, onViewReport, onDeleteReport }: ReportsTableProps) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(dateObj);
  };

  const groupedReports = groupReportsByPlayer(reports);

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
                  {groupedReport.avgRating !== null && (
                    <span className={`font-semibold text-base ${getRatingColor(groupedReport.avgRating)}`}>
                      {groupedReport.avgRating}
                      {groupedReport.reportCount > 1 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (avg)
                        </span>
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {groupedReport.recommendation && (
                    <span className={getRatingColor(groupedReport.recommendation)}>
                      {groupedReport.recommendation}
                    </span>
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
