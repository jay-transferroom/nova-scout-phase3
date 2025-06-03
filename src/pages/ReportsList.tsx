
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File, FileText, BookmarkCheck, Award, Trash2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useReports } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

const ReportsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all-reports");
  const { reports, loading, deleteReport } = useReports();
  const { profile } = useAuth();
  
  // Filter reports based on active tab
  const filteredReports = reports.filter(report => {
    if (activeTab === "my-reports") {
      return report.status === "submitted";
    } else if (activeTab === "my-drafts") {
      return report.status === "draft";
    } else {
      return true; // "all-reports" tab
    }
  });

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(date));
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleDeleteReport = async (reportId: string, playerName: string) => {
    if (window.confirm(`Are you sure you want to delete the report for ${playerName}?`)) {
      try {
        await deleteReport(reportId);
        toast.success("Report deleted successfully");
      } catch (error) {
        toast.error("Failed to delete report");
      }
    }
  };

  // Get overall rating from a report
  const getOverallRating = (report: any) => {
    const overallSection = report.sections?.find((section: any) => section.sectionId === "overall");
    if (!overallSection) return null;
    
    const ratingField = overallSection.fields?.find((field: any) => field.fieldId === "overallRating");
    return ratingField?.value;
  };

  // Get recommendation from a report
  const getRecommendation = (report: any) => {
    const overallSection = report.sections?.find((section: any) => section.sectionId === "overall");
    if (!overallSection) return null;
    
    const recommendationField = overallSection.fields?.find((field: any) => field.fieldId === "recommendation");
    return recommendationField?.value;
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-8 pb-16 max-w-7xl">
        <div className="text-center">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 pb-16 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Player Reports</h1>
        <p className="text-muted-foreground">View and manage scouting reports</p>
      </div>

      <Tabs defaultValue="all-reports" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all-reports" className="flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4" />
            <span>All Reports</span>
          </TabsTrigger>
          <TabsTrigger value="my-reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Submitted</span>
          </TabsTrigger>
          <TabsTrigger value="my-drafts" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>Drafts</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {activeTab === "all-reports" && "All Scouting Reports"}
            {activeTab === "my-reports" && "Submitted Reports"}
            {activeTab === "my-drafts" && "Draft Reports"}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const overallRating = getOverallRating(report);
                  const recommendation = getRecommendation(report);
                  
                  return (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.player?.name}</TableCell>
                      <TableCell>{report.player?.club}</TableCell>
                      <TableCell>{report.player?.positions?.join(", ")}</TableCell>
                      <TableCell>{formatDate(report.created_at)}</TableCell>
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
                        {report.scout?.first_name || "Scout"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewReport(report.id)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteReport(report.id, report.player?.name || "Unknown")}
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

          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsList;
