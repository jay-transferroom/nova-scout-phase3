import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@/types/player";
import { ReportWithPlayer } from "@/types/report";
import { groupReportsByPlayer } from "@/utils/reportGrouping";

export const usePrivatePlayerActions = () => {
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);

  const calculateAggregatedData = (playerReports: ReportWithPlayer[]) => {
    if (!playerReports || playerReports.length === 0) return undefined;
    
    const groupedReports = groupReportsByPlayer(playerReports);
    const playerData = groupedReports[0]; // Should only be one player's reports
    
    return {
      avgRating: playerData?.avgRating || null,
      recommendation: playerData?.recommendation || null,
      reportCount: playerData?.reportCount || 0
    };
  };

  const onCreateReport = (player: Player) => {
    navigate('/report-builder', { 
      state: { selectedPrivatePlayer: player } 
    });
  };

  const onOpenNotes = () => {
    setNotesOpen(true);
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  return {
    notesOpen,
    setNotesOpen,
    calculateAggregatedData,
    onCreateReport,
    onOpenNotes,
    handleViewReport
  };
};