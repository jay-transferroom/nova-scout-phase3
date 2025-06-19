
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@/types/player";
import { ReportTemplate, Report } from "@/types/report";
import { useAuth } from "@/contexts/AuthContext";
import { useReports } from "@/hooks/useReports";
import { toast } from "sonner";

// Generate a proper UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useReportBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveReport } = useReports();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initializeReport = (selectedPlayer: Player, selectedTemplate: ReportTemplate): Report => {
    console.log('Initializing report with template:', selectedTemplate);
    
    return {
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
  };

  const handleSaveReport = async (report: Report, player: Player, template: ReportTemplate | null, status: "draft" | "submitted") => {
    if (!report || !player) return;
    
    setIsSubmitting(true);

    try {
      const reportData = {
        id: report.id,
        playerId: player.id,
        templateId: template?.id || "",
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

  return {
    initializeReport,
    handleSaveReport,
    isSubmitting,
  };
};
