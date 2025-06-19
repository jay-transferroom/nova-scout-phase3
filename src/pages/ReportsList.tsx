
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useReports } from "@/hooks/useReports";
import { useReportsFilter } from "@/hooks/useReportsFilter";
import { toast } from "sonner";
import ReportsTabNavigation from "@/components/reports/ReportsTabNavigation";
import ReportsTable from "@/components/reports/ReportsTable";

const ReportsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all-reports");
  const { reports, loading, deleteReport } = useReports();
  const filteredReports = useReportsFilter(reports, activeTab);

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleEditReport = (reportId: string) => {
    navigate(`/reports/${reportId}/edit`);
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

      <ReportsTabNavigation onTabChange={setActiveTab} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{getCardTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportsTable 
            reports={filteredReports}
            onViewReport={handleViewReport}
            onEditReport={handleEditReport}
            onDeleteReport={handleDeleteReport}
          />

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
