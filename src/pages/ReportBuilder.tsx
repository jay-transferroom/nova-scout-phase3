import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { ReportTemplate, Report, ReportSectionData } from "@/types/report";
import ReportSection from "@/components/ReportSection";
import { useAuth } from "@/contexts/AuthContext";
import { useReports } from "@/hooks/useReports";
import { ArrowLeft, Save, Send, Settings } from "lucide-react";
import { toast } from "sonner";
import PlayerSearch from "@/components/PlayerSearch";
import TemplateSelection from "@/components/TemplateSelection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationState {
  player: Player;
  template: ReportTemplate;
}

// Generate a proper UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const ReportBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [template, setTemplate] = useState<ReportTemplate | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const { user } = useAuth();
  const { saveReport } = useReports();

  useEffect(() => {
    // Get player and template from location state
    const state = location.state as LocationState;
    if (state?.player && state?.template) {
      setPlayer(state.player);
      setTemplate(state.template);
      initializeReport(state.player, state.template);
    } else {
      // If no data provided, show player selection
      setShowPlayerSearch(true);
    }
  }, [location, user]);

  const initializeReport = (selectedPlayer: Player, selectedTemplate: ReportTemplate) => {
    const newReport: Report = {
      id: generateUUID(),
      playerId: selectedPlayer.id,
      templateId: selectedTemplate.id,
      scoutId: user?.id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      sections: selectedTemplate.sections.map((section) => ({
        sectionId: section.id,
        fields: section.fields.map((field) => ({
          fieldId: field.id,
          value: null,
        })),
      })),
    };

    setReport(newReport);
  };

  const handlePlayerSelect = (selectedPlayer: Player) => {
    setPlayer(selectedPlayer);
    setShowPlayerSearch(false);
    setShowTemplateSelection(true);
  };

  const handleTemplateSelect = (selectedPlayer: Player, selectedTemplate: ReportTemplate) => {
    setTemplate(selectedTemplate);
    setShowTemplateSelection(false);
    initializeReport(selectedPlayer, selectedTemplate);
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

  const handleSaveReport = async (status: "draft" | "submitted") => {
    if (!report || !player) return;
    
    setIsSubmitting(true);

    try {
      const reportData = {
        id: report.id,
        player_id: player.id,
        template_id: template?.id || "",
        status,
        sections: report.sections,
      };

      await saveReport(reportData);
      
      if (status === "submitted") {
        toast.success(`Report for ${player.name} has been submitted successfully.`);
        navigate("/reports");
      } else {
        toast.success("Report saved as draft.");
      }
    } catch (error) {
      toast.error("Failed to save report. Please try again.");
      console.error("Error saving report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show player search if no player selected
  if (showPlayerSearch || !player) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Report</CardTitle>
            <p className="text-muted-foreground">First, select a player to create a report for.</p>
          </CardHeader>
          <CardContent>
            <PlayerSearch onSelectPlayer={handlePlayerSelect} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show template selection if no template selected
  if (showTemplateSelection || !template) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => setShowPlayerSearch(true)} className="gap-2">
            <ArrowLeft size={16} />
            Back to Player Selection
          </Button>
        </div>

        <TemplateSelection 
          player={player}
          isOpen={true}
          onClose={() => setShowPlayerSearch(true)}
          onSelectTemplate={handleTemplateSelect}
        />
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

  // Separate overall section from other sections
  const overallSection = template.sections.find(section => section.id === "overall");
  const otherSections = template.sections.filter(section => section.id !== "overall");

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
        
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/templates")}
            className="gap-2"
          >
            <Settings size={16} />
            Manage Templates
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSaveReport("draft")} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save size={16} />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSaveReport("submitted")} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <Send size={16} />
            Submit Report
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <div className="bg-muted/50 p-4 rounded-md mb-6">
        <div className="flex items-center gap-4">
          {player.image ? (
            <img 
              src={player.image} 
              alt={player.name} 
              className="w-16 h-16 rounded-full object-cover" 
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold">{player.name.charAt(0)}</span>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold">{player.name}</h2>
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>{player.club}</span>
              <span>•</span>
              <span>{player.positions.join(", ")}</span>
              <span>•</span>
              <span>{player.age} years</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Render overall section first if it exists */}
        {overallSection && (
          <ReportSection
            key={overallSection.id}
            section={overallSection}
            sectionData={report.sections.find(s => s.sectionId === overallSection.id)!}
            onChange={handleFieldChange}
            isOverallSection={true}
          />
        )}

        {/* Render all other sections */}
        {otherSections.map((section) => (
          <ReportSection
            key={section.id}
            section={section}
            sectionData={report.sections.find(s => s.sectionId === section.id)!}
            onChange={handleFieldChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportBuilder;
