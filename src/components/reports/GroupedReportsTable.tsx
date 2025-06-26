
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Edit, Eye, Users } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { getRatingColor, formatDate } from "@/utils/reportFormatting";
import { getRecommendation } from "@/utils/reportDataExtraction";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { groupReportsByPlayer, GroupedReport } from "@/utils/reportGrouping";
import { useReportPlayerData } from "@/hooks/useReportPlayerData";

interface GroupedReportsTableProps {
  reports: ReportWithPlayer[];
  onViewReport: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onViewAllReports: (playerId: string, playerName: string) => void;
}

const GroupedReportRow = ({ groupedReport, onViewReport, onEditReport, onViewAllReports, canEdit }: {
  groupedReport: GroupedReport;
  onViewReport: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onViewAllReports: (playerId: string, playerName: string) => void;
  canEdit: boolean;
}) => {
  const { data: playerData, isLoading: playerLoading, error: playerError } = useReportPlayerData(groupedReport.playerId);
  const latestReport = groupedReport.allReports[0];
  const recommendation = getRecommendation(latestReport);

  const playerName = playerLoading ? 'Loading...' : 
                     playerError ? 'Unknown Player' :
                     playerData?.name || 'Unknown Player';
                     
  const playerClub = playerLoading ? 'Loading...' : 
                     playerError ? 'Unknown' :
                     playerData?.club || 'Unknown';
                     
  const playerPositions = playerLoading ? 'Loading...' : 
                          playerError ? 'Unknown' :
                          playerData?.positions?.join(", ") || 'Unknown';

  return (
    <TableRow key={`${groupedReport.playerId}-grouped`}>
      <TableCell className="font-medium">{playerName}</TableCell>
      <TableCell>{playerClub}</TableCell>
      <TableCell>{playerPositions}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-muted-foreground" />
          <span className="font-medium">{groupedReport.reportCount}</span>
        </div>
      </TableCell>
      <TableCell>{formatDate(latestReport.createdAt)}</TableCell>
      <TableCell>
        <Badge variant={latestReport.status === "submitted" ? "secondary" : "outline"}>
          {latestReport.status === "draft" ? "Draft" : "Submitted"}
        </Badge>
      </TableCell>
      <TableCell>
        {groupedReport.avgRating !== null ? (
          <span className={`font-semibold text-base ${getRatingColor(groupedReport.avgRating)}`}>
            {groupedReport.avgRating}
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
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewAllReports(groupedReport.playerId, playerName)}
            title="View all reports"
          >
            <Eye className="h-4 w-4" />
            All ({groupedReport.reportCount})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewReport(latestReport.id)}
            title="View latest report"
          >
            <Eye className="h-4 w-4" />
            Latest
          </Button>
          {canEdit && onEditReport && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEditReport(latestReport.id)}
              title="Edit latest report"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

const GroupedReportsTable = ({ reports, onViewReport, onEditReport, onViewAllReports }: GroupedReportsTableProps) => {
  const { user } = useAuth();
  const groupedReports = groupReportsByPlayer(reports);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Club</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Reports Count</TableHead>
          <TableHead>Latest Report</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              <Award size={14} />
              <span>Avg Rating</span>
            </div>
          </TableHead>
          <TableHead>Recommendation</TableHead>
          <TableHead className="w-[200px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupedReports.length > 0 ? (
          groupedReports.map((groupedReport: GroupedReport) => {
            const canEdit = user && groupedReport.scoutId === user.id;

            return (
              <GroupedReportRow
                key={`${groupedReport.playerId}-grouped`}
                groupedReport={groupedReport}
                onViewReport={onViewReport}
                onEditReport={onEditReport}
                onViewAllReports={onViewAllReports}
                canEdit={canEdit}
              />
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

export default GroupedReportsTable;
