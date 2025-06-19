
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
    if (["B", "B+", "Consider"].includes(value)) return "text-amber-600";
    return "text-red-600";
  }
  
  return "";
};

// Get overall rating from a report - improved logic
const getOverallRating = (report: ReportWithPlayer) => {
  console.log(`Extracting rating for player ${report.player?.name}:`, report.sections);
  
  if (!report.sections || !Array.isArray(report.sections)) {
    console.log('No sections or sections not array');
    return null;
  }
  
  // Try to find overall rating in different sections and field names
  for (const section of report.sections) {
    console.log(`Checking section:`, section);
    
    if (!section.fields || !Array.isArray(section.fields)) {
      console.log('Section has no fields or fields not array');
      continue;
    }
    
    // Look for common rating field names - check both fieldId and label
    for (const field of section.fields) {
      console.log(`Checking field:`, field);
      
      const isRatingField = 
        field.fieldId === "overallRating" || 
        field.fieldId === "overall_rating" ||
        field.fieldId === "rating" ||
        field.fieldId === "overall" ||
        (field.label && field.label.toLowerCase().includes("overall")) ||
        (field.label && field.label.toLowerCase().includes("rating")) ||
        (field.label && field.label.toLowerCase().includes("score"));
      
      if (isRatingField && field.value !== null && field.value !== undefined && field.value !== "") {
        console.log('Found rating field:', field);
        const numericValue = typeof field.value === 'number' ? field.value : parseFloat(field.value);
        if (!isNaN(numericValue)) {
          return numericValue;
        }
      }
    }
  }
  
  console.log('No rating found');
  return null;
};

// Get recommendation from a report - improved logic
const getRecommendation = (report: ReportWithPlayer) => {
  console.log(`Extracting recommendation for player ${report.player?.name}:`, report.sections);
  
  if (!report.sections || !Array.isArray(report.sections)) {
    console.log('No sections or sections not array');
    return null;
  }
  
  // Try to find recommendation in different sections and field names
  for (const section of report.sections) {
    console.log(`Checking section for recommendation:`, section);
    
    if (!section.fields || !Array.isArray(section.fields)) {
      console.log('Section has no fields or fields not array');
      continue;
    }
    
    // Look for common recommendation field names
    for (const field of section.fields) {
      console.log(`Checking recommendation field:`, field);
      
      const isRecommendationField = 
        field.fieldId === "recommendation" || 
        field.fieldId === "overall_recommendation" ||
        field.fieldId === "verdict" ||
        field.fieldId === "decision" ||
        field.fieldId === "outcome" ||
        (field.label && field.label.toLowerCase().includes("recommendation")) ||
        (field.label && field.label.toLowerCase().includes("verdict")) ||
        (field.label && field.label.toLowerCase().includes("decision")) ||
        (field.label && field.label.toLowerCase().includes("outcome"));
      
      if (isRecommendationField && field.value && field.value !== "") {
        console.log('Found recommendation field:', field);
        return field.value;
      }
    }
  }
  
  console.log('No recommendation found');
  return null;
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
      .filter(rating => rating !== null && rating !== undefined && typeof rating === "number") as number[];

    console.log(`Player ${mostRecentReport.player?.name} all ratings:`, ratings);

    // Calculate average rating
    const avgRating = ratings.length > 0 
      ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
      : null;

    // Get the most recent recommendation
    const recommendation = getRecommendation(mostRecentReport);
    console.log(`Player ${mostRecentReport.player?.name} recommendation:`, recommendation);
    console.log(`Player ${mostRecentReport.player?.name} avg rating:`, avgRating);

    return {
      ...mostRecentReport,
      reportCount: sortedReports.length,
      avgRating,
      recommendation,
      allReports: sortedReports
    };
  });
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
