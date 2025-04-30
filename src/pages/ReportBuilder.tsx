
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { ReportTemplate, Report, ReportSectionData } from "@/types/report";
import ReportSection from "@/components/ReportSection";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send } from "lucide-react";

interface LocationState {
  player: Player;
  template: ReportTemplate;
}

const ReportBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [template, setTemplate] = useState<ReportTemplate | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get player and template from location state
    const state = location.state as LocationState;
    if (!state?.player || !state?.template) {
      navigate("/");
      toast({
        title: "Error",
        description: "Missing player or template information",
        variant: "destructive",
      });
      return;
    }

    setPlayer(state.player);
    setTemplate(state.template);

    // Initialize report data
    const newReport: Report = {
      id: `report-${Date.now()}`,
      playerId: state.player.id,
      templateId: state.template.id,
      scoutId: "scout-1", // In a real app, this would come from authentication
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      sections: state.template.sections.map((section) => ({
        sectionId: section.id,
        fields: section.fields.map((field) => ({
          fieldId: field.id,
          value: null,
        })),
      })),
    };

    setReport(newReport);
  }, [location, navigate]);

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

  const saveReport = (status: "draft" | "submitted") => {
    if (!report) return;
    
    setIsSubmitting(true);

    // In a real app, this would save to a database
    const updatedReport = {
      ...report,
      status,
      updatedAt: new Date(),
    };

    console.log("Saving report:", updatedReport);

    // Simulate API call
    setTimeout(() => {
      setReport(updatedReport);
      setIsSubmitting(false);
      
      if (status === "submitted") {
        toast({
          title: "Report Submitted",
          description: `Report for ${player?.name} has been submitted successfully.`,
        });
        navigate("/");
      } else {
        toast({
          title: "Report Saved",
          description: `Report saved as draft.`,
        });
      }
    }, 1000);
  };

  if (!player || !template || !report) {
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
            onClick={() => saveReport("draft")} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save size={16} />
            Save Draft
          </Button>
          <Button 
            onClick={() => saveReport("submitted")} 
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
