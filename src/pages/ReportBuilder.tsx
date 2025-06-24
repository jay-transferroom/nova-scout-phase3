
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
    console.log('ReportBuilder useEffect - state:', state);
    console.log('ReportBuilder useEffect - fetchedPlayer:', fetchedPlayer);
    
    // Get player and template from location state
    if (state?.player && state?.template) {
      console.log('Both player and template provided');
      setPlayer(state.player);
      setTemplate(state.template);
      const newReport = initializeReport(state.player, state.template);
      setReport(newReport);
    } else if (state?.player) {
      // Player provided, show template selection
      console.log('Player provided, showing template selection');
      setPlayer(state.player);
      setShowTemplateSelection(true);
    } else if (state?.selectedPlayerId && fetchedPlayer) {
      // Player ID provided and player fetched - go directly to template selection
      console.log('Player fetched from ID, going to template selection');
      setPlayer(fetchedPlayer);
      setShowTemplateSelection(true);
    } else if (state?.selectedPlayerId && !fetchedPlayer) {
      // Wait for player to be fetched
      console.log('Waiting for player to be fetched');
      return;
    } else {
      // No data provided, show player selection
      console.log('No data provided, showing player selection');
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

  // Show player search if no player selected and no selectedPlayerId
  if (showPlayerSearch || (!player && !state?.selectedPlayerId)) {
    return (
      <PlayerSelectionScreen
        onSelectPlayer={handlePlayerSelect}
        onBack={() => navigate("/")}
      />
    );
  }

  // Show template selection if we have a player but no template
  if ((showTemplateSelection && player) || (player && !template)) {
    return (
      <TemplateSelectionScreen
        player={player}
        onSelectTemplate={handleTemplateSelect}
        onBack={() => navigate(-1)}
      />
    );
  }

  // Loading state while fetching player
  if (state?.selectedPlayerId && !player && !fetchedPlayer) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading player information...</p>
      </div>
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
