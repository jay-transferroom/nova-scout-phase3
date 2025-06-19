
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Player } from "@/types/player";
import { ReportTemplate, Report } from "@/types/report";
import { useAuth } from "@/contexts/AuthContext";
import PlayerSelectionScreen from "@/components/report-builder/PlayerSelectionScreen";
import TemplateSelectionScreen from "@/components/report-builder/TemplateSelectionScreen";
import ReportForm from "@/components/report-builder/ReportForm";
import { useReportBuilder } from "@/hooks/useReportBuilder";
import { usePlayerData } from "@/hooks/usePlayerData";

interface LocationState {
  player?: Player;
  template?: ReportTemplate;
  selectedPlayerId?: string;
}

const ReportBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [template, setTemplate] = useState<ReportTemplate | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const { user } = useAuth();
  const { initializeReport, handleSaveReport, isSubmitting } = useReportBuilder();

  const state = location.state as LocationState;
  
  // Fetch player data if we have a selectedPlayerId but no player object
  const { data: fetchedPlayer } = usePlayerData(state?.selectedPlayerId);

  useEffect(() => {
    // Get player and template from location state
    if (state?.player && state?.template) {
      setPlayer(state.player);
      setTemplate(state.template);
      const newReport = initializeReport(state.player, state.template);
      setReport(newReport);
    } else if (state?.player) {
      // Player provided, show template selection
      setPlayer(state.player);
      setShowTemplateSelection(true);
    } else if (fetchedPlayer) {
      // Player fetched from database
      setPlayer(fetchedPlayer);
      setShowTemplateSelection(true);
    } else if (state?.selectedPlayerId) {
      // Wait for player to be fetched
      return;
    } else {
      // No data provided, show player selection
      setShowPlayerSearch(true);
    }
  }, [state, fetchedPlayer, user, initializeReport]);

  const handlePlayerSelect = (selectedPlayer: Player) => {
    setPlayer(selectedPlayer);
    setShowPlayerSearch(false);
    setShowTemplateSelection(true);
  };

  const handleTemplateSelect = (selectedPlayer: Player, selectedTemplate: ReportTemplate) => {
    console.log('Template selected:', selectedTemplate);
    setTemplate(selectedTemplate);
    setShowTemplateSelection(false);
    const newReport = initializeReport(selectedPlayer, selectedTemplate);
    setReport(newReport);
  };

  const handleFieldChange = (
    sectionId: string,
    fieldId: string,
    value: any,
    notes?: string
  ) => {
    if (!report) return;

    setReport((prevReport) => {
      if (!prevReport) return null;

      return {
        ...prevReport,
        updatedAt: new Date(),
        sections: prevReport.sections.map((section) => {
          if (section.sectionId !== sectionId) return section;

          return {
            ...section,
            fields: section.fields.map((field) => {
              if (field.fieldId !== fieldId) return field;

              return {
                ...field,
                value,
                notes,
              };
            }),
          };
        }),
      };
    });
  };

  // Show player search if no player selected
  if (showPlayerSearch || (!player && !state?.selectedPlayerId)) {
    return (
      <PlayerSelectionScreen
        onSelectPlayer={handlePlayerSelect}
        onBack={() => navigate("/")}
      />
    );
  }

  // Show template selection if no template selected
  if (showTemplateSelection || !template) {
    return (
      <TemplateSelectionScreen
        player={player!}
        onSelectTemplate={handleTemplateSelect}
        onBack={() => navigate(-1)}
      />
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading report builder...</p>
      </div>
    );
  }

  return (
    <ReportForm
      player={player!}
      template={template}
      report={report}
      isSubmitting={isSubmitting}
      onFieldChange={handleFieldChange}
      onSaveDraft={() => handleSaveReport(report, player!, template, "draft")}
      onSubmitReport={() => handleSaveReport(report, player!, template, "submitted")}
      onBack={() => navigate("/")}
      onManageTemplates={() => navigate("/admin/templates")}
    />
  );
};

export default ReportBuilder;
