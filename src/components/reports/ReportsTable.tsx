
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Trash2, Edit, Eye, User, FileText, UserCheck } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { getRatingColor, formatDate } from "@/utils/reportFormatting";
import { getOverallRating, getRecommendation } from "@/utils/reportDataExtraction";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useReportPlayerData } from "@/hooks/useReportPlayerData";
import VerdictBadge from "@/components/VerdictBadge";
import { useNavigate } from "react-router-dom";

interface ReportsTableProps {
  reports: ReportWithPlayer[];
  onViewReport: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onDeleteReport: (reportId: string, playerName: string) => void;
}

const ReportRow = ({ report, onViewReport, onEditReport, onDeleteReport, canEdit }: {
  report: ReportWithPlayer;
  onViewReport: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onDeleteReport: (reportId: string, playerName: string) => void;
  canEdit: boolean;
}) => {
  const { data: playerData, isLoading: playerLoading, error: playerError } = useReportPlayerData(report.playerId);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const overallRating = getOverallRating(report);
  const verdict = getRecommendation(report);

  console.log(`Report ${report.id} - Player ID: ${report.playerId}, Player Data:`, playerData, 'Loading:', playerLoading, 'Error:', playerError);

  // Display loading state while fetching player data
  const playerName = playerLoading ? 'Loading...' : 
                     playerError ? `Error loading player` :
                     playerData?.name || `Player ID: ${report.playerId}`;
                     
  const playerClub = playerLoading ? 'Loading...' : 
                     playerError ? 'Unknown' :
                     playerData?.club || 'Unknown';
                     
  const playerPositions = playerLoading ? 'Loading...' : 
                          playerError ? 'Unknown' :
                          playerData?.positions?.join(", ") || 'Unknown';

  const handleViewPlayerProfile = () => {
    if (playerData) {
      // Check if it's a private player by looking at the ID format
      if (report.playerId.startsWith('private-')) {
        const privatePlayerId = report.playerId.replace('private-', '');
        navigate(`/private-player/${privatePlayerId}`);
      } else {
        navigate(`/player/${report.playerId}`);
      }
    }
  };

  const handleCreateReport = () => {
    if (playerData) {
      if (report.playerId.startsWith('private-')) {
        // For private players
        navigate('/report-builder', { 
          state: { selectedPrivatePlayer: playerData } 
        });
      } else {
        // For public players
        navigate('/report-builder', { 
          state: { selectedPlayer: playerData } 
        });
      }
    }
  };

  const handleScoutManagerVerdict = () => {
    // Navigate to player profile where scout manager verdict can be added
    handleViewPlayerProfile();
  };

  // Only show scout manager verdict button for recruitment users
  const canAddVerdict = profile?.role === 'recruitment';

  return (
    <TableRow key={report.id}>
      <TableCell className="font-medium">
        {playerName}
      </TableCell>
      <TableCell>{playerClub}</TableCell>
      <TableCell>{playerPositions}</TableCell>
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
        {verdict ? (
          <VerdictBadge verdict={verdict} />
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell>
        {report.scoutProfile?.first_name || "Scout"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-1 justify-end flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewReport(report.id)}
            title="View report"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewPlayerProfile}
            title="View player profile"
            disabled={playerLoading || playerError}
          >
            <User className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCreateReport}
            title="Create new report for this player"
            disabled={playerLoading || playerError}
          >
            <FileText className="h-4 w-4" />
          </Button>
          {canAddVerdict && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleScoutManagerVerdict}
              title="Add scout manager verdict"
              disabled={playerLoading || playerError}
            >
              <UserCheck className="h-4 w-4" />
            </Button>
          )}
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
              onClick={() => onDeleteReport(report.id, playerName)}
              title="Delete report"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

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
          <TableHead>Verdict</TableHead>
          <TableHead>Scout</TableHead>
          <TableHead className="w-[250px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.length > 0 ? (
          reports.map((report) => {
            const canEdit = user && report.scoutId === user.id;

            return (
              <ReportRow
                key={report.id}
                report={report}
                onViewReport={onViewReport}
                onEditReport={onEditReport}
                onDeleteReport={onDeleteReport}
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

export default ReportsTable;
