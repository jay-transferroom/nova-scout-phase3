import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/useReports";
import { useReportsFilter } from "@/hooks/useReportsFilter";
import { toast } from "sonner";
import ReportsTabNavigation from "@/components/reports/ReportsTabNavigation";
import ReportsTable from "@/components/reports/ReportsTable";

const ReportsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("all-reports");
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  
  // Set initial tab from URL parameters
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["all-reports", "my-reports", "my-drafts"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  const { reports, loading, deleteReport } = useReports();
  const filteredReports = useReportsFilter(reports, activeTab);
  
  // Pagination logic
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);
  
  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);
  
  const handleViewReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handleEditReport = (reportId: string) => {
    navigate(`/report/${reportId}/edit`);
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


  const getCardTitle = () => {
    if (activeTab === "all-reports") return "All Scouting Reports";
    if (activeTab === "my-reports") return "My Reports";
    return "Draft Reports";
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

      <ReportsTabNavigation onTabChange={setActiveTab} activeTab={activeTab} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{getCardTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportsTable 
            reports={paginatedReports}
            onViewReport={handleViewReport}
            onEditReport={handleEditReport}
            onDeleteReport={handleDeleteReport}
          />

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} reports
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsList;
