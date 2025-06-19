
import { useState } from "react";
import { ReportSection, ReportField, RatingSystem } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEditor from "@/components/FieldEditor";
import { Plus, ChevronUp, ChevronDown, Trash2, GripVertical, Edit, File } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  
  const handleAddSection = () => {
    const newSection = createNewSection(defaultRatingSystem);
    const updatedSections = [...sections, newSection];
    onUpdate(updatedSections);
    setExpandedSectionId(newSection.id);
    setEditingSectionId(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onUpdate(updatedSections);
    
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(updatedSections.length ? updatedSections[0].id : null);
    }
    if (editingSectionId === sectionId) {
      setEditingSectionId(null);
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
        <Card 
          key={section.id}
          className={cn(
            "border",
            expandedSectionId === section.id ? "border-primary/50" : "",
            draggedSectionId === section.id ? "opacity-50" : ""
          )}
        >
          <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2 w-full">
              <div
                className="cursor-move p-1 hover:bg-muted rounded"
                draggable
                onDragStart={() => setDraggedSectionId(section.id)}
                onDragEnd={() => setDraggedSectionId(null)}
              >
                <GripVertical size={16} className="text-muted-foreground" />
              </div>
              
              {editingSectionId === section.id ? (
                <Input
                  value={section.title}
                  onChange={(e) => handleUpdateSection({ ...section, title: e.target.value })}
                  className="text-base font-medium border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
                  onBlur={() => setEditingSectionId(null)}
                  autoFocus
                />
              ) : (
                <div className="text-base font-medium flex-1">{section.title}</div>
              )}
              
              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setEditingSectionId(section.id)}
                >
                  <Edit size={16} />
                </Button>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleMoveSectionUp(sectionIndex)}
                    disabled={sectionIndex === 0}
                  >
                    <ChevronUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleMoveSectionDown(sectionIndex)}
                    disabled={sectionIndex === sections.length - 1}
                  >
                    <ChevronDown size={16} />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteSection(section.id)}
                >
                  <Trash2 size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setExpandedSectionId(
                      expandedSectionId === section.id ? null : section.id
                    );
                  }}
                >
                  {expandedSectionId === section.id ? "Collapse" : "Expand"}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {expandedSectionId === section.id && (
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`section-optional-${section.id}`}
                    checked={section.optional}
                    onCheckedChange={(checked) => {
                      handleUpdateSection({ 
                        ...section, 
                        optional: !!checked 
                      });
                    }}
                  />
                  <label 
                    htmlFor={`section-optional-${section.id}`}
                    className="text-sm"
                  >
                    Optional section
                  </label>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Fields</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddField(section.id)}
                      className="gap-1"
                    >
                      <Plus size={16} />
                      Add Field
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {section.fields.map((field) => (
                      <div 
                        key={field.id}
                        className={cn(
                          "border rounded-md p-3 bg-card",
                          editingFieldId === field.id ? "border-primary/50" : ""
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <File size={16} className="text-muted-foreground" />
                            <div>
                              <div className="font-medium">{field.label}</div>
                              <div className="text-xs text-muted-foreground">
                                Type: {field.type}
                                {field.required && " • Required"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 p-0 px-2"
                              onClick={() => setEditingFieldId(
                                editingFieldId === field.id ? null : field.id
                              )}
                            >
                              {editingFieldId === field.id ? "Done" : "Edit"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteField(section.id, field.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        {editingFieldId === field.id && (
                          <div className="mt-3 pt-3 border-t">
                            <FieldEditor
                              field={field}
                              onUpdate={(updatedField) => {
                                handleUpdateField(section.id, updatedField);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
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
