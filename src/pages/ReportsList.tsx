import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useReports } from "@/hooks/useReports";
import { useReportsFilter } from "@/hooks/useReportsFilter";
import { toast } from "sonner";
import { Users, List } from "lucide-react";
import ReportsTabNavigation from "@/components/reports/ReportsTabNavigation";
import ReportsTable from "@/components/reports/ReportsTable";
import GroupedReportsTable from "@/components/reports/GroupedReportsTable";
import PlayerReportsModal from "@/components/reports/PlayerReportsModal";

const ReportsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("all-reports");
  const [viewMode, setViewMode] = useState<"grouped" | "individual">("grouped");
  const [selectedPlayerReports, setSelectedPlayerReports] = useState<{
    playerId: string;
    playerName: string;
    reports: any[];
  } | null>(null);
  
  // Set initial tab from URL parameters
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["all-reports", "my-reports", "my-drafts"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  const { reports, loading, deleteReport } = useReports();
  const filteredReports = useReportsFilter(reports, activeTab);

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

  const handleViewAllReports = (playerId: string, playerName: string) => {
    const playerReports = filteredReports.filter(report => report.playerId === playerId);
    setSelectedPlayerReports({
      playerId,
      playerName,
      reports: playerReports
    });
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
          <div className="flex justify-between items-center">
            <CardTitle>{getCardTitle()}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grouped" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grouped")}
              >
                <Users className="h-4 w-4 mr-1" />
                Grouped by Player
              </Button>
              <Button
                variant={viewMode === "individual" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("individual")}
              >
                <List className="h-4 w-4 mr-1" />
                Individual Reports
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grouped" ? (
            <GroupedReportsTable 
              reports={filteredReports}
              onViewReport={handleViewReport}
              onEditReport={handleEditReport}
              onViewAllReports={handleViewAllReports}
            />
          ) : (
            <ReportsTable 
              reports={filteredReports}
              onViewReport={handleViewReport}
              onEditReport={handleEditReport}
              onDeleteReport={handleDeleteReport}
            />
          )}

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

      {selectedPlayerReports && (
        <PlayerReportsModal
          isOpen={!!selectedPlayerReports}
          onClose={() => setSelectedPlayerReports(null)}
          playerName={selectedPlayerReports.playerName}
          reports={selectedPlayerReports.reports}
          onViewReport={handleViewReport}
          onEditReport={handleEditReport}
          onDeleteReport={handleDeleteReport}
        />
      )}
    </div>
  );
};

export default ReportsList;
