
import { useState } from "react";
import { ReportSectionData } from "@/types/report";
import ReportField from "@/components/ReportField";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Award } from "lucide-react";

interface ReportEditSectionProps {
  section: ReportSectionData;
  sectionTitle: string;
  onUpdate: (updatedSection: ReportSectionData) => void;
  isOverallSection?: boolean;
}

const ReportEditSection = ({ section, sectionTitle, onUpdate, isOverallSection = false }: ReportEditSectionProps) => {
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
              // Create a mock field structure for ReportField component
              const mockField = {
                id: fieldData.fieldId,
                label: fieldData.fieldId.charAt(0).toUpperCase() + fieldData.fieldId.slice(1),
                type: 'text' as const, // Default to text, this would need to be enhanced
                required: false
              };

              return (
                <ReportField
                  key={fieldData.fieldId}
                  field={mockField}
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
