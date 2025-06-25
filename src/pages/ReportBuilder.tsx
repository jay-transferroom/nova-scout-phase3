
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [template, setTemplate] = useState<ReportTemplate | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const { user } = useAuth();
  const { initializeReport, handleSaveReport, isSubmitting } = useReportBuilder();

  const state = location.state as LocationState;
  
  // Get playerId from URL parameters or state
  const playerIdFromUrl = searchParams.get('playerId');
  const assignmentId = searchParams.get('assignmentId');
  const playerIdToFetch = playerIdFromUrl || state?.selectedPlayerId;
  
  // Fetch player data if we have a playerId
  const { data: fetchedPlayer, isLoading: playerLoading } = usePlayerData(playerIdToFetch || undefined);

  // Initialize the component state only once
  useEffect(() => {
    if (initialized) return;

    console.log('ReportBuilder initializing once...');
    
    // Case 1: Both player and template provided via state
    if (state?.player && state?.template) {
      console.log('Both player and template provided via state');
      setPlayer(state.player);
      setTemplate(state.template);
      const newReport = initializeReport(state.player, state.template);
      setReport(newReport);
      setInitialized(true);
      return;
    }

    // Case 2: Only player provided via state
    if (state?.player) {
      console.log('Player provided via state, showing template selection');
      setPlayer(state.player);
      setShowTemplateSelection(true);
      setInitialized(true);
      return;
    }

    // Case 3: Player fetched from URL/state ID
    if (playerIdToFetch && fetchedPlayer) {
      console.log('Player fetched from ID, going to template selection');
      setPlayer(fetchedPlayer);
      setShowTemplateSelection(true);
      setInitialized(true);
      return;
    }

    // Case 4: No player data available
    if (!playerIdToFetch && !state?.player && !playerLoading) {
      console.log('No player data provided, showing player selection');
      setShowPlayerSearch(true);
      setInitialized(true);
      return;
    }

    // Case 5: Still loading player data
    if (playerIdToFetch && playerLoading) {
      console.log('Waiting for player to be fetched');
      return;
    }

  }, [state, fetchedPlayer, playerLoading, playerIdToFetch, initializeReport, initialized]);

  const handlePlayerSelect = useCallback((selectedPlayer: Player) => {
    setPlayer(selectedPlayer);
    setShowPlayerSearch(false);
    setShowTemplateSelection(true);
  }, []);

  const handleTemplateSelect = useCallback((selectedPlayer: Player, selectedTemplate: ReportTemplate) => {
    console.log('Template selected:', selectedTemplate);
    setTemplate(selectedTemplate);
    setShowTemplateSelection(false);
    const newReport = initializeReport(selectedPlayer, selectedTemplate);
    setReport(newReport);
  }, [initializeReport]);

  const handleFieldChange = useCallback((
    sectionId: string,
    fieldId: string,
    value: any,
    notes?: string
  ) => {
    setReport((prevReport) => {
      if (!prevReport) return null;

      const updatedSections = prevReport.sections.map((section) => {
        if (section.sectionId !== sectionId) return section;

        const updatedFields = section.fields.map((field) => {
          if (field.fieldId !== fieldId) return field;

          return {
            ...field,
            value,
            notes,
          };
        });

        return {
          ...section,
          fields: updatedFields,
        };
      });

      return {
        ...prevReport,
        updatedAt: new Date(),
        sections: updatedSections,
      };
    });
  }, []);

  // Show loading state while fetching player
  if (playerIdToFetch && playerLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading player information...</p>
      </div>
    );
  }

  // Show player search if no player is available
  if (showPlayerSearch) {
    return (
      <PlayerSelectionScreen
        onSelectPlayer={handlePlayerSelect}
        onBack={() => navigate("/")}
      />
    );
  }

  // Show template selection if we have a player but no template
  if (showTemplateSelection && player) {
    return (
      <TemplateSelectionScreen
        player={player}
        onSelectTemplate={handleTemplateSelect}
        onBack={() => navigate(-1)}
      />
    );
  }

  // Show loading while initializing
  if (!initialized || !report || !player) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading report builder...</p>
      </div>
    );
  }

  return (
    <ReportForm
      player={player}
      template={template}
      report={report}
      isSubmitting={isSubmitting}
      onFieldChange={handleFieldChange}
      onSaveDraft={() => handleSaveReport(report, player, template, "draft")}
      onSubmitReport={() => handleSaveReport(report, player, template, "submitted")}
      onBack={() => navigate("/")}
      onManageTemplates={() => navigate("/admin/templates")}
    />
  );
};

export default ReportBuilder;
