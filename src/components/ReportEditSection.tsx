
import { useState } from "react";
import { ReportSectionData } from "@/types/report";
import ReportField from "@/components/ReportField";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Award } from "lucide-react";

interface ReportEditSectionProps {
  section: ReportSectionData;
  sectionTitle: string;
  templateSection?: any; // Add template section to get field metadata
  onUpdate: (updatedSection: ReportSectionData) => void;
  isOverallSection?: boolean;
}

// Standard scout recommendations
const SCOUT_RECOMMENDATIONS = [
  "Sign / Proceed to next stage",
  "Monitor / Track Further", 
  "Further Scouting Required",
  "Concerns / With Reservations",
  "Do Not Pursue"
];

const ReportEditSection = ({ 
  section, 
  sectionTitle, 
  templateSection, 
  onUpdate, 
  isOverallSection = false 
}: ReportEditSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFieldUpdate = (fieldId: string, value: any, notes?: string) => {
    const updatedFields = section.fields.map(field =>
      field.fieldId === fieldId 
        ? { ...field, value, notes }
        : field
    );

    const updatedSection: ReportSectionData = {
      ...section,
      fields: updatedFields
    };

    onUpdate(updatedSection);
  };

  return (
    <div className={`border rounded-lg bg-card ${isOverallSection ? 'border-primary/30 bg-primary/5' : ''}`}>
      <div 
        className="p-4 cursor-pointer flex justify-between items-center" 
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2">
          {isOverallSection && <Award className="text-primary" size={20} />}
          <h3 className={`text-lg font-medium ${isOverallSection ? 'text-primary' : ''}`}>{sectionTitle}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={(e) => { 
          e.stopPropagation();
          toggleExpand();
        }}>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          <div className="grid gap-4">
            {section.fields.map((fieldData) => {
              // Find the corresponding field definition from the template
              const templateField = templateSection?.fields?.find((tf: any) => tf.id === fieldData.fieldId);
              
              // Create a proper field structure for ReportField component
              let field = {
                id: fieldData.fieldId,
                label: templateField?.label || fieldData.fieldId.charAt(0).toUpperCase() + fieldData.fieldId.slice(1),
                type: templateField?.type || 'text' as const,
                required: templateField?.required || false,
                description: templateField?.description,
                options: templateField?.options,
                ratingSystem: templateField?.ratingSystem
              };

              // Special handling for recommendation fields to ensure they use the latest options
              if (fieldData.fieldId === 'recommendation' || 
                  field.label.toLowerCase().includes('recommendation') ||
                  field.label.toLowerCase().includes('verdict') ||
                  field.label.toLowerCase().includes('decision')) {
                field = {
                  ...field,
                  type: 'dropdown' as const,
                  options: SCOUT_RECOMMENDATIONS
                };
              }

              return (
                <ReportField
                  key={fieldData.fieldId}
                  field={field}
                  value={fieldData.value}
                  notes={fieldData.notes}
                  onChange={(value, notes) => handleFieldUpdate(fieldData.fieldId, value, notes)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportEditSection;
