
import { useState } from "react";
import { ReportSection, ReportField, RatingSystem } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SectionCard from "@/components/SectionCard";

interface TemplateSectionEditorProps {
  sections: ReportSection[];
  onUpdate: (sections: ReportSection[]) => void;
  defaultRatingSystem?: RatingSystem;
}

// Standard scout recommendations
const SCOUT_RECOMMENDATIONS = [
  "Sign / Proceed to next stage",
  "Monitor / Track Further", 
  "Further Scouting Required",
  "Concerns / With Reservations",
  "Do Not Pursue"
];

const createNewSection = (defaultRatingSystem?: RatingSystem): ReportSection => {
  const ratingField: ReportField = {
    id: `field-rating-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    label: "Rating",
    type: "rating",
    required: true,
    ratingSystem: defaultRatingSystem ? { ...defaultRatingSystem } : undefined
  };

  const recommendationField: ReportField = {
    id: `field-recommendation-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    label: "Recommendation",
    type: "dropdown",
    required: true,
    options: [...SCOUT_RECOMMENDATIONS]
  };

  const descriptionField: ReportField = {
    id: `field-desc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    label: "Notes",
    type: "text",
    required: false
  };

  return {
    id: `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: "New Section",
    fields: [ratingField, recommendationField, descriptionField],
    optional: false
  };
};

const TemplateSectionEditor = ({ sections, onUpdate, defaultRatingSystem }: TemplateSectionEditorProps) => {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    sections.length ? sections[0].id : null
  );
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  
  const handleAddSection = () => {
    const newSection = createNewSection(defaultRatingSystem);
    const updatedSections = [...sections, newSection];
    onUpdate(updatedSections);
    setExpandedSectionId(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onUpdate(updatedSections);
    
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(updatedSections.length ? updatedSections[0].id : null);
    }
  };

  const handleUpdateSection = (updatedSection: ReportSection) => {
    const updatedSections = sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    onUpdate(updatedSections);
  };

  const handleUpdateField = (sectionId: string, updatedField: ReportField) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.map(field => 
            field.id === updatedField.id ? updatedField : field
          )
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
  };

  const handleAddField = (sectionId: string) => {
    const newField: ReportField = {
      id: `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      label: "New Field",
      type: "text",
      required: false
    };

    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: [...section.fields, newField]
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
    setEditingFieldId(newField.id);
  };

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.filter(field => field.id !== fieldId)
        };
      }
      return section;
    });
    
    onUpdate(updatedSections);
    
    if (editingFieldId === fieldId) {
      setEditingFieldId(null);
    }
  };

  const handleMoveSectionUp = (index: number) => {
    if (index === 0) return;
    
    const updatedSections = [...sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index - 1];
    updatedSections[index - 1] = temp;
    
    onUpdate(updatedSections);
  };

  const handleMoveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    
    const updatedSections = [...sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index + 1];
    updatedSections[index + 1] = temp;
    
    onUpdate(updatedSections);
  };

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <SectionCard
          key={section.id}
          section={section}
          sectionIndex={sectionIndex}
          totalSections={sections.length}
          isExpanded={expandedSectionId === section.id}
          isDragged={draggedSectionId === section.id}
          editingFieldId={editingFieldId}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          onMoveUp={handleMoveSectionUp}
          onMoveDown={handleMoveSectionDown}
          onToggleExpand={() => {
            setExpandedSectionId(
              expandedSectionId === section.id ? null : section.id
            );
          }}
          onDragStart={() => setDraggedSectionId(section.id)}
          onDragEnd={() => setDraggedSectionId(null)}
          onAddField={() => handleAddField(section.id)}
          onDeleteField={(fieldId) => handleDeleteField(section.id, fieldId)}
          onUpdateField={(field) => handleUpdateField(section.id, field)}
          onSetEditingField={setEditingFieldId}
        />
      ))}
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleAddSection}
      >
        <Plus size={16} className="mr-1" />
        Add Section
      </Button>
    </div>
  );
};

export default TemplateSectionEditor;
