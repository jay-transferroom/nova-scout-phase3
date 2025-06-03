
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

const ReportsTable = ({ reports, onViewReport, onDeleteReport }: ReportsTableProps) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(dateObj);
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Club</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              <Award size={14} />
              <span>Rating</span>
            </div>
          </TableHead>
          <TableHead>Recommendation</TableHead>
          <TableHead>Scout</TableHead>
          <TableHead className="w-[150px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.length > 0 ? (
          reports.map((report) => {
            const overallRating = getOverallRating(report);
            const recommendation = getRecommendation(report);
            
            return (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.player?.name}</TableCell>
                <TableCell>{report.player?.club}</TableCell>
                <TableCell>{report.player?.positions?.join(", ")}</TableCell>
                <TableCell>{formatDate(report.createdAt)}</TableCell>
                <TableCell>
                  {report.status === "draft" ? (
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
                  {overallRating !== null && (
                    <span className={`font-semibold text-base ${getRatingColor(overallRating)}`}>
                      {overallRating}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {recommendation && (
                    <span className={getRatingColor(recommendation)}>
                      {recommendation}
                    </span>
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
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteReport(report.id, report.player?.name || "Unknown")}
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
