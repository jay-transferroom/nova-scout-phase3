
import { useState } from "react";
import { ReportSection as ReportSectionType, ReportSectionData } from "@/types/report";
import ReportField from "@/components/ReportField";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ReportSectionProps {
  section: ReportSectionType;
  sectionData: ReportSectionData;
  onChange: (sectionId: string, fieldId: string, value: any, notes?: string) => void;
}

const ReportSection = ({ section, sectionData, onChange }: ReportSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border rounded-lg bg-card">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center" 
        onClick={toggleExpand}
      >
        <h3 className="text-lg font-medium">{section.title}</h3>
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
            {section.fields.map((field) => {
              const fieldData = sectionData.fields.find(f => f.fieldId === field.id);
              return (
                <ReportField
                  key={field.id}
                  field={field}
                  value={fieldData?.value}
                  notes={fieldData?.notes}
                  onChange={(value, notes) => onChange(section.id, field.id, value, notes)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSection;
